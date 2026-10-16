const KEY = 'stallion:post-auth-redirect'

// Only same-site paths are accepted, so a crafted value can never send users elsewhere.
const isSafePath = (path: string) => path.startsWith('/') && !path.startsWith('//')

export function rememberPostAuthRedirect(path: string) {
  try {
    if (isSafePath(path)) sessionStorage.setItem(KEY, path)
  } catch {
    // sessionStorage can be unavailable (private mode); the user just lands on the dashboard.
  }
}

export function consumePostAuthRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return path && isSafePath(path) ? path : null
  } catch {
    return null
  }
}
