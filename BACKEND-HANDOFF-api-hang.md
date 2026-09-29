# Backend Handoff — `api.stallion.so` requests hang indefinitely (blocks Google sign-in)

**Reported by:** Frontend team (stallion-frontend)
**Date:** 2026-09-28
**Severity:** High — Google sign-in is unusable in production; `/auth/signup/request-verification` and `/hackathons` also hang
**Component:** `api.stallion.so` (Express, Node — `x-powered-by: Express`)

---

## 1. Summary

`POST /api/auth/social` (Google sign-in) never returns a response in production. The frontend shows a permanent "Connecting to GOOGLE..." spinner and the user is never signed in.

Root-cause investigation ruled out the frontend, Google, CORS, DNS, TLS and the auth layer. The evidence points to **the production API hanging on certain request paths** — two endpoints are confirmed to never respond, and the social-auth path shows the same signature.

**Requests that are rejected early (auth / JWT / validation) return in ~1.2s. Requests that proceed further into application logic never return at all.**

---

## 2. User-facing impact

| Surface | Symptom |
|---|---|
| `/auth/login` → "Continue with Google" | Permanent "Connecting to GOOGLE..." spinner, never signs in, no error shown |
| `/auth/register` → Google | Same |
| Sign up with email | `POST /api/auth/signup/request-verification` hangs, no response |
| Public hackathons page | `GET /api/hackathons` hangs, no response |

Because the frontend axios instance had **no timeout**, all of these surface as an infinite spinner rather than an error.

---

## 3. Evidence

Measured 2026-09-28 against production from outside the cluster. All requests included `Origin: https://stallion.so`.

### 3.1 Healthy — respond in ~1.2s

| # | Request | Result | Time |
|---|---|---|---|
| 1 | `OPTIONS /api/auth/social` (preflight) | `204`, `access-control-allow-origin: *` | fast |
| 2 | `GET /api/auth/profile` (no token) | `401` | 1.22s |
| 3 | `GET /api/bounties?limit=1` | `401` | 1.37s |
| 4 | `GET /api/projects?limit=1` | `400` | 1.10s |
| 5 | `POST /api/auth/login` (bad creds) | `400` | 1.16s |
| 6 | `POST /api/auth/social` (**fake** ID token) | `401 {"message":"Invalid Google ID token","error":"Unauthorized","statusCode":401}` | fast |
| 7 | `POST /api/auth/refresh` (bogus token) | `401 {"message":"Invalid or expired refresh token","error":"Unauthorized","statusCode":401}` | 1.32s |

### 3.2 Confirmed hanging — no response at all

| # | Request | Result |
|---|---|---|
| 8 | `GET /api/hackathons?limit=1` | No response, killed at **25s**. `curl` exit `status=000` |
| 9 | `POST /api/auth/signup/request-verification` | No response, killed at **40s**. `curl` exit `status=000` |

In both cases the client sent the request, the TCP/TLS connection was established, the request body was sent, and the server never wrote a response.

---

## 4. What this tells us

### 4.1 The hang is downstream of early rejection

A **fake** ID token returns `401 "Invalid Google ID token"` instantly — that request never leaves JWT verification. A **real** ID token verifies successfully and proceeds into application logic, and that is where the request stalls.

This is the same shape as #8 and #9: those requests pass validation/authorization and then stall; the ones in 3.1 that are rejected early come straight back.

### 4.2 Google is not the problem

The frontend's `onSuccess` handler fires and `processSocialAuth()` starts — the "Connecting to GOOGLE..." toast only appears *after* Google has returned a valid ID token. Google is issuing credentials correctly to `https://stallion.so`. The request that stalls is the frontend's `POST /api/auth/social`.

### 4.3 Not CORS, DNS, TLS, or HTTP/2

- Preflight returns `204` with `access-control-allow-origin: *` and echoes `content-type, authorization, x-admin-step-up-token`.
- Same host, same process serves both the healthy and hanging requests — DNS, TLS termination and HTTP/2 are working.
- `alt-svc: h3=":443"` and HTTP/2 responses are returned on the fast path.

### 4.4 ⚠️ A ~1.2s floor on every response is itself suspicious

Even requests rejected immediately take **1.1–1.4s**. That is abnormally slow for an Express/NestJS API and suggests something incurs per-request overhead on the hot path — e.g. a middleware, a DNS lookup, or an outbound call made for *every* request. Endpoints that go one step further than rejection never finish at all.

**This is worth investigating on its own;** it may share a root cause with the hang.

---

## 5. Most likely cause

**Outbound calls issued without `connect` and/or response timeouts, so the socket never resolves.**

This fits both hanging endpoints:

- `POST /auth/signup/request-verification` → outbound **SMTP/email**
- `GET /api/hackathons` → likely an **external API call** (Stellar RPC/Horizon, or another service)

An un-timed `connect` to an unreachable host, or a TCP socket that is accepted but never responds, will hang **indefinitely** — Node/axios/undici do not time out by default. This also explains why it is production-only: those integrations are commonly stubbed, mocked or localhost in the dev environment.

The ~1.2s floor in 4.4 may be the same class of problem at smaller scale.

### Other things to rule out

- **Connection pool exhaustion** — leaked/held Prisma or TypeORM clients. Symptoms would be identical under load.
- **Long-running or unindexed query** on the social-auth user lookup/upsert path.
- **Missing transaction release / deadlock** on the write path.
- **A hung job or semaphore** in a guard/interceptor that wraps the affected routes only.

---

## 6. What we need from you

1. **Pull the logs for `POST /api/auth/social` from the last day.** The decisive question: **are those requests arriving, and are they completing?** We expect to see them arrive and never respond. This also confirms the inference in 4.1, which we could not measure directly (we have no valid Google ID token to test with).
2. **Instrument or trace the hang.** The most reliable method is a diagnostic log emitted immediately before and after the outbound call in `request-verification` — the last log line before the stall identifies the culprit.
3. **Add explicit timeouts to every outbound call**: SMTP, `pg`/`prisma` connection settings, `undici`/`axios` request configs, and any third-party HTTP client. Suggested baseline: 5s connect, 10s response.
4. **Investigate the ~1.2s per-request floor** in 4.4.
5. **Consider a global request timeout** (e.g. `server.requestTimeout` / a NestJS interceptor) so a stalled handler returns a `5xx` instead of hanging.

### Acceptance criteria

- `GET /api/hackathons?limit=1` returns a response in < 2s.
- `POST /api/auth/signup/request-verification` returns a response in < 5s.
- `POST /api/auth/social` with a valid Google ID token returns `200` (or `400` for a new user missing a role) in < 2s.
- Any backend dependency that is down degrades to a fast `5xx` rather than an indefinite hang.

---

## 7. Repro

```bash
# Hangs — no response, kill after 60s
curl -v -X POST https://api.stallion.so/api/auth/signup/request-verification \
  -H "Origin: https://stallion.so" -H "Content-Type: application/json" \
  -d '{"email":"repro@example.com","role":"CONTRIBUTOR"}' --max-time 60

# Hangs — no response, kill after 30s
curl -v "https://api.stallion.so/api/hackathons?limit=1" --max-time 30

# Control — always fast, use to confirm the host is otherwise healthy
curl -s -o /dev/null -w "status=%{http_code} total=%{time_total}s\n" \
  https://api.stallion.so/api/auth/profile
```

---

## 8. Frontend changes already made

Shipped separately; listed so they are not mistaken for the fix.

- Added a 20s timeout to `POST /auth/social` so this class of failure surfaces as an error instead of an infinite spinner.
- Improved the error message for timeouts and unreachable-server cases.
- Wired Google's `error_callback` so OAuth/popup failures are visible.
- Removed the deprecated `use_fedcm_for_prompt` flag and set `use_fedcm_for_button={false}`.
- Extracted the Google button into `components/auth/google-sign-in-button.tsx` (login and register shared a duplicated, divergent block).

None of these fix the hang — they only make the failure legible. **The hang requires the backend fix in section 6.**

---

## 9. Caveats

- We could not test `POST /api/auth/social` with a **valid** Google ID token, so the assertion that it hangs is inferred from the reported UI behaviour plus the pattern in 3.1/3.2. **Log evidence in item 6.1 is needed to confirm.**
- The two `request-verification` probes used throwaway `@example.com` addresses. If that handler sends real email, two outbound emails may have been triggered.
- All timings were single samples, not averaged, and taken from outside the cluster; internal/region-local latency will differ.
