import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AdminState {
  stepUpToken: string | null
  stepUpExpiresAt: number | null
  setStepUpToken: (token: string, expiresInSeconds: number) => void
  clearStepUpToken: () => void
  isStepUpValid: () => boolean
  getValidStepUpToken: () => string | null
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      stepUpToken: null,
      stepUpExpiresAt: null,

      setStepUpToken: (token, expiresInSeconds) => {
        const ttl = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0 ? expiresInSeconds : 600
        const expiresAt = Date.now() + ttl * 1000
        set({ stepUpToken: token, stepUpExpiresAt: expiresAt })
      },

      clearStepUpToken: () => {
        set({ stepUpToken: null, stepUpExpiresAt: null })
      },

      isStepUpValid: () => Boolean(get().getValidStepUpToken()),

      getValidStepUpToken: () => {
        const { stepUpToken, stepUpExpiresAt } = get()
        if (!stepUpToken || !stepUpExpiresAt) return null
        if (Date.now() >= stepUpExpiresAt) return null
        return stepUpToken
      },
    }),
    {
      name: 'stallion-admin-storage',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? undefined as unknown as Storage : sessionStorage
      ),
      partialize: (state) => ({
        stepUpToken: state.stepUpToken,
        stepUpExpiresAt: state.stepUpExpiresAt,
      }),
    }
  )
)
