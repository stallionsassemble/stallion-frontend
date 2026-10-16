'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store/use-auth'
import { consumePostAuthRedirect } from '@/lib/post-auth-redirect'

/** After logging in or registering, sends the user back to the page that asked them to sign in. */
export function PostAuthRedirect() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const path = consumePostAuthRedirect()
    if (path) router.replace(path)
  }, [user, router])

  return null
}
