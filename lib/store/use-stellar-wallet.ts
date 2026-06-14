/**
 * Zustand store for the admin Stellar wallet connection state.
 * Persists the wallet address in localStorage so the user doesn't
 * have to reconnect on every page load.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StellarWalletState {
  address: string | null
  isConnecting: boolean
  isAdminVerified: boolean // true if connected address matches on-chain admin
  adminMismatchWarning: boolean // true if connected but address ≠ on-chain admin

  setAddress: (address: string | null) => void
  setIsConnecting: (v: boolean) => void
  setAdminVerified: (v: boolean) => void
  setAdminMismatchWarning: (v: boolean) => void
  disconnect: () => void
}

export const useStellarWallet = create<StellarWalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnecting: false,
      isAdminVerified: false,
      adminMismatchWarning: false,

      setAddress: (address) => set({ address }),
      setIsConnecting: (v) => set({ isConnecting: v }),
      setAdminVerified: (v) => set({ isAdminVerified: v }),
      setAdminMismatchWarning: (v) => set({ adminMismatchWarning: v }),
      disconnect: () =>
        set({
          address: null,
          isAdminVerified: false,
          adminMismatchWarning: false,
        }),
    }),
    {
      name: 'stallion-stellar-wallet',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ address: state.address }),
    },
  ),
)
