'use client'

import { GoogleLogin, type NonOAuthError } from '@react-oauth/google'
import { toast } from 'sonner'

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void | Promise<void>
  action?: 'sign in' | 'sign up'
}

/**
 * Google Identity Services button.
 *
 * FedCM is explicitly disabled. Google auto-migrates GIS sites onto the FedCM
 * button flow, and FedCM fails *silently* — a blocked popup, Chrome's
 * "third-party sign-in" setting being off, or a privacy extension intercepting
 * `accounts.google.com/gsi/confirm` all freeze the button with no callback and
 * no error. `@react-oauth/google` never registers Google's `error_callback`, so
 * those failures are invisible. The legacy popup flow surfaces them instead.
 */
export function GoogleSignInButton({
  onCredential,
  action = 'sign in',
}: GoogleSignInButtonProps) {
  const fail = (message: string) => {
    console.error(`[google-sign-in] ${message}`)
    toast.error(message)
  }

  const handleNonOAuthError = (nonOAuthError: NonOAuthError) => {
    // A user closing the popup is a deliberate cancel, not a failure.
    if (nonOAuthError.type === 'popup_closed') return

    fail(
      `Could not ${action} with Google (${nonOAuthError.type}). ` +
        'Your browser may be blocking popups — allow them for this site and try again.'
    )
  }

  // `error_callback` is part of Google's real IdConfiguration and
  // @react-oauth/google forwards unrecognised props to
  // `google.accounts.id.initialize()`, but the package's own `IdConfiguration`
  // type omits it, so it is added via a spread.
  const errorHandling = { error_callback: handleNonOAuthError }

  return (
    <div className="w-full h-10 md:h-12 overflow-hidden rounded-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            fail('Google did not return a credential. Please try again.')
            return
          }
          await onCredential(credentialResponse.credential)
        }}
        onError={() => fail(`Failed to ${action} with Google. Please try again.`)}
        theme="outline"
        size="large"
        shape="pill"
        width="100%"
        use_fedcm_for_button={false}
        containerProps={{ style: { height: '100%' } }}
        {...errorHandling}
      />
    </div>
  )
}
