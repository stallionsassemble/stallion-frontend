'use client'

import { useAuth } from '@/lib/store/use-auth'
import { AccountRestricted } from './account-restricted'
import { ReactNode } from 'react'

interface AccountStatusGuardProps {
  children: ReactNode
}

export function AccountStatusGuard({ children }: AccountStatusGuardProps) {
  const { user, isAuthenticated } = useAuth()

  // Only check status for authenticated users
  if (isAuthenticated && user?.status && user.status !== 'ACTIVE') {
    return <AccountRestricted status={user.status as 'SUSPENDED' | 'BANNED'} />
  }

  return <>{children}</>
}
