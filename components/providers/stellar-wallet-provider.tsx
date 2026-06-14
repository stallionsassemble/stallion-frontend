'use client'

import { useEffect } from 'react'
import { initStellarWalletsKit } from '@/lib/stellar/wallet-kit'

/**
 * Client-only provider that initialises the Stellar Wallets Kit once
 * on mount. Place this high in the component tree (dashboard layout)
 * so the kit is ready before any child triggers wallet actions.
 */
export function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initStellarWalletsKit().catch((err) => {
      console.warn('Failed to initialise StellarWalletsKit:', err)
    })
  }, [])

  return <>{children}</>
}
