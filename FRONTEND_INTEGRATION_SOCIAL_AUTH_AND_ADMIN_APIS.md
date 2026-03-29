# Stallion Frontend Integration Guide

Last updated: 2026-03-07

## Scope

This guide documents the implemented backend functionality for:

- Social sign-in/sign-up (Google and Apple)
- Admin dashboard and management APIs
- Admin step-up verification (TOTP/passkey)
- Funding wallet configuration behavior
- Pagination, filtering, and response shapes

## Environment and Base URL

- Global API prefix: `/api`
- Swagger: `/api/docs`
- Auth scheme: `Authorization: Bearer <accessToken>`

All paths below are shown without the `/api` prefix.

## 1. Social Auth

### Endpoint

- `POST /auth/social`

### Request body

```json
{
  "provider": "GOOGLE",
  "idToken": "<provider-id-token>",
  "role": "CONTRIBUTOR"
}
```

Body fields:

- `provider`: `GOOGLE | APPLE` (required)
- `idToken`: provider-issued ID token (required)
- `role`: `CONTRIBUTOR | PROJECT_OWNER` (required only when creating a brand new user)

### Response (200)

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "cm...",
    "email": "user@example.com",
    "role": "CONTRIBUTOR",
    "profileCompleted": false
  },
  "message": "Social authentication successful.",
  "provider": "GOOGLE",
  "isNewUser": true
}
```

### Social auth behavior

1. Backend verifies provider token server-side.
2. User resolution order:
   - linked social account `(provider, providerSubject)`
   - fallback to existing user by email
3. If no user exists:
   - `role` is mandatory
   - user is created with `emailVerified=true`, `profileCompleted=false`, `status=ACTIVE`
4. Social account is linked if not already linked.
5. JWT tokens are issued in the same shape as existing auth flows.

### Frontend flow

1. Obtain ID token from Google/Apple SDK.
2. Call `POST /auth/social`.
3. If `400` with "Role is required for first-time social signup", prompt role selection and retry with `role`.
4. Save `accessToken`/`refreshToken`.
5. If `user.profileCompleted === false`, route to profile completion flow.

### Common errors

- `400`: missing role for first-time signup, missing email from provider on first signup
- `401`: invalid/expired provider token
- `403`: account suspended/banned

## 2. Account State Enforcement (Frontend Impact)

The backend blocks suspended/banned users across auth and protected routes:

- Login
- Token refresh
- JWT-protected access

Statuses:

- `ACTIVE`: normal access
- `SUSPENDED`: blocked until unsuspended
- `BANNED`: blocked

Timed suspension expiry is auto-processed by cron. Expired timed suspensions are automatically reactivated.

## 3. Admin Security Model

## 3.1 Base admin requirement

All `/admin/*` routes require:

- valid JWT
- `role = ADMIN`

## 3.2 Step-up requirement for sensitive actions

Sensitive admin actions additionally require a short-lived step-up token.

How to send step-up token:

- Header: `x-admin-step-up-token: <token>` (preferred)
- Fallback body key: `stepUpToken`

Step-up token TTL:

- Configurable via `ADMIN_STEP_UP_TTL_SECONDS`
- Defaults to `600` seconds

### Step-up endpoints

- `POST /admin/security/step-up/totp`
  - body: `{ "code": "123456" }`
- `POST /admin/security/step-up/passkey/options`
  - body: none
- `POST /admin/security/step-up/passkey/verify`
  - body: `{ "response": <webauthn-authentication-response> }`

Step-up success response:

```json
{
  "token": "<step-up-token>",
  "expiresInSeconds": 600
}
```

### Frontend step-up flow (recommended)

1. User clicks sensitive admin action.
2. Frontend opens step-up modal (TOTP or passkey).
3. Verify via one of step-up endpoints.
4. Store step-up token in memory (not localStorage).
5. Send token in `x-admin-step-up-token` header on sensitive calls.
6. If action fails with step-up error/expiry, re-run step-up flow.

## 4. Funding Wallet Configuration

### Endpoints

- `GET /admin/funding-wallet`
- `PUT /admin/funding-wallet` (step-up required)
- `DELETE /admin/funding-wallet` (step-up required)

### `GET` response

```json
{
  "fundingWalletId": "cm_wallet_123",
  "source": "admin"
}
```

`source` values:

- `admin`: explicitly set by admin
- `env`: fallback from deprecated `FUNDING_WALLET_ID`
- `none`: no value configured

### Runtime precedence

1. Admin-set platform setting
2. Deprecated env fallback `FUNDING_WALLET_ID`

## 5. Admin Main Dashboard

### Endpoint

- `GET /admin/dashboard`

### Response shape

```json
{
  "totalUsers": 123,
  "activeWorks": 37,
  "totalPayoutsUsd": 41230.55,
  "userGrowth": {
    "currentMonthDailyRegistrations": {
      "2026-03-01": 3,
      "2026-03-02": 5
    },
    "monthToDate": 28,
    "today": 2,
    "genderDistribution": {
      "MALE": 40,
      "FEMALE": 30,
      "UNSPECIFIED": 53
    }
  },
  "payoutAnalytics": [
    {
      "month": "2026-03",
      "token": "USDC",
      "totalAmount": 1200,
      "totalUsd": 1200,
      "count": 9
    }
  ],
  "workStatus": {
    "normalized": {
      "active": 30,
      "completed": 20,
      "cancelled": 4,
      "closed": 2
    },
    "raw": {
      "bounties": {
        "ACTIVE": 10,
        "COMPLETED": 5,
        "CLOSED": 1
      },
      "projects": {
        "OPEN": 9,
        "IN_PROGRESS": 11,
        "COMPLETED": 15,
        "CANCELLED": 3,
        "CLOSED": 2
      }
    }
  },
  "jobPerformance": [
    {
      "quarter": "2025-Q4",
      "bountiesCreated": 22,
      "projectsCreated": 18
    }
  ]
}
```

## 6. Pagination Contract (All Admin List Endpoints)

Standard query params:

- `page` (default `1`)
- `limit` (default `10`)

Standard response:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## 7. Admin API Spec

## 7.1 Users

- `GET /admin/users/stats`
  - returns: `totalUsers`, `activeUsers`, `suspendedUsers`, `bannedUsers`
- `GET /admin/users`
  - filters: `search`, `role`, `status`, `gender`, `createdFrom`, `createdTo`, `page`, `limit`
  - each user includes: `reputationRating`, `bountiesParticipated`, `projectsParticipated`, `earningsUsd`, `lastActiveAt`
- `POST /admin/users`
  - body: `{ "email": "...", "role": "CONTRIBUTOR|PROJECT_OWNER|ADMIN" }`
  - creates uncompleted-profile user, sends invite email with frontend login prefill link
- `POST /admin/users/:id/reset-2fa` (step-up required)
  - clears TOTP secret, backup codes, MFA flag, and all passkeys
- `POST /admin/users/:id/make-admin` (step-up required)
- `POST /admin/users/:id/suspend` (step-up required)
  - body: `{ "indefinite": false, "durationHours": 72, "reason": "..." }`
  - if `indefinite=true`, `durationHours` not required
- `POST /admin/users/:id/ban` (step-up required)
  - body: `{ "reason": "..." }`

## 7.2 Bounties

- `GET /admin/bounties/stats`
  - returns: `active`, `completed`, `escrowLocked`
- `GET /admin/bounties`
  - filters: `status`, `ownerId`, `currency`, `search`, `isFeatured`, `page`, `limit`
  - includes owner details + `applicantCount`
- `PATCH /admin/bounties/:id/feature` (step-up required)
  - body: `{ "isFeatured": true }`
- `PATCH /admin/bounties/:id` (step-up required)
  - body shape: same as `UpdateBountyDto`
- `DELETE /admin/bounties/:id` (step-up required)

## 7.3 Projects

- `GET /admin/projects/stats`
  - returns: `active`, `completed`, `escrowLocked`
- `GET /admin/projects`
  - filters: `status`, `ownerId`, `type`, `search`, `isFeatured`, `page`, `limit`
  - includes owner details + `applicantCount`
- `PATCH /admin/projects/:id/feature` (step-up required)
  - body: `{ "isFeatured": true }`
- `PATCH /admin/projects/:id` (step-up required)
  - body shape: same as `UpdateProjectDto`
- `DELETE /admin/projects/:id` (step-up required)

## 7.4 Payouts

- `GET /admin/payouts/stats`
  - returns:
    - `pendingApproval`
    - `pendingAmountUsd`
    - `completed30dUsd`
    - `issues` (failed/disputed)
- `GET /admin/payouts`
  - filters: `status`, `sourceType`, `token`, `search`, `requestedFrom`, `requestedTo`, `page`, `limit`
  - includes contributor details and linked bounty/project/milestone context
- `POST /admin/payouts/:id/retry` (step-up required)
  - only for failed milestone payouts

## 7.5 Hackathons

- `GET /admin/hackathons/stats`
  - returns: `totalHackathons`, `activeHackathons`, `totalPrizePoolUsd`, `totalParticipants`, `totalSubmissions`
- `GET /admin/hackathons`
  - filters: `status`, `ownerId`, `search`, `page`, `limit`
  - item fields include: host, title, description, status, duration, participants, prizePool
- `POST /admin/hackathons` (step-up required)
  - body:

```json
{
  "ownerId": "cm_owner_id",
  "payload": { "title": "...", "description": "..." }
}
```

- `PATCH /admin/hackathons/:id` (step-up required)
  - body: partial hackathon payload
- `DELETE /admin/hackathons/:id` (step-up required)

## 8. Sensitive Endpoints Requiring Step-Up

Use `x-admin-step-up-token` for:

- `PUT /admin/funding-wallet`
- `DELETE /admin/funding-wallet`
- `POST /admin/users/:id/reset-2fa`
- `POST /admin/users/:id/make-admin`
- `POST /admin/users/:id/suspend`
- `POST /admin/users/:id/ban`
- `PATCH /admin/bounties/:id/feature`
- `PATCH /admin/bounties/:id`
- `DELETE /admin/bounties/:id`
- `PATCH /admin/projects/:id/feature`
- `PATCH /admin/projects/:id`
- `DELETE /admin/projects/:id`
- `POST /admin/payouts/:id/retry`
- `POST /admin/hackathons`
- `PATCH /admin/hackathons/:id`
- `DELETE /admin/hackathons/:id`

## 9. Unified Payout Data (Frontend Notes)

Payout records are now unified across:

- Bounty winners (`sourceType = BOUNTY_WIN`)
- Project milestones (`sourceType = PROJECT_MILESTONE`)

Status progression (milestone payouts):

- `PENDING_APPROVAL` -> `PROCESSING` -> `COMPLETED`
- failure path: `FAILED`

Additional metadata fields may be present for UI context.

## 10. Error Handling Recommendations

Frontend should handle:

- `400`: validation or business rule violations
- `401`: missing/invalid JWT
- `403`: role restriction or step-up missing/invalid
- `404`: resource not found

Recommended UX:

- On step-up-related `403`, reopen step-up modal and retry operation.
- On social signup role error (`400`), prompt role selection and retry.
- On suspended/banned auth errors, show account-state specific blocking UI.

## 11. Quick Sequence Examples

## 11.1 Social signup/signin

```text
Frontend -> Provider SDK (Google/Apple): get idToken
Frontend -> Backend: POST /auth/social
Backend -> Frontend: tokens + user + isNewUser
Frontend: if profileCompleted=false -> onboarding flow
```

## 11.2 Sensitive admin action

```text
Frontend -> Backend: POST /admin/security/step-up/totp (or passkey verify)
Backend -> Frontend: { token, expiresInSeconds }
Frontend -> Backend: sensitive /admin/* request with x-admin-step-up-token
Backend -> Frontend: success
```

## 12. Source of Truth

- Swagger UI remains the executable contract for DTO validation and route visibility.
- Use this document for frontend flow design and payload/UX conventions.- failure path: `FAILED`

Additional metadata fields may be present for UI context.

## 10. Error Handling Recommendations

Frontend should handle:

- `400`: validation or business rule violations
- `401`: missing/invalid JWT
- `403`: role restriction or step-up missing/invalid
- `404`: resource not found

Recommended UX:

- On step-up-related `403`, reopen step-up modal and retry operation.
- On social signup role error (`400`), prompt role selection and retry.
- On suspended/banned auth errors, show account-state specific blocking UI.

## 11. Quick Sequence Examples

## 11.1 Social signup/signin

```text
Frontend -> Provider SDK (Google/Apple): get idToken
Frontend -> Backend: POST /auth/social
Backend -> Frontend: tokens + user + isNewUser
Frontend: if profileCompleted=false -> onboarding flow
```

## 11.2 Sensitive admin action

```text
Frontend -> Backend: POST /admin/security/step-up/totp (or passkey verify)
Backend -> Frontend: { token, expiresInSeconds }
Frontend -> Backend: sensitive /admin/* request with x-admin-step-up-token
Backend -> Frontend: success
```

## 12. Source of Truth

- Swagger UI remains the executable contract for DTO validation and route visibility.
- Use this document for frontend flow design and payload/UX conventions.
