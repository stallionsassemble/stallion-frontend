import { create } from 'zustand'

interface AdminState {
  stepUpToken: string | null
  stepUpExpiresAt: number | null
  setStepUpToken: (token: string, expiresInSeconds: number) => void
  clearStepUpToken: () => void
  isStepUpValid: () => boolean
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stepUpToken: null,
  stepUpExpiresAt: null,

  setStepUpToken: (token, expiresInSeconds) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000
    set({ stepUpToken: token, stepUpExpiresAt: expiresAt })
  },

  clearStepUpToken: () => {
    set({ stepUpToken: null, stepUpExpiresAt: null })
  },

  isStepUpValid: () => {
    const { stepUpToken, stepUpExpiresAt } = get()
    if (!stepUpToken || !stepUpExpiresAt) return false
    return Date.now() < stepUpExpiresAt
  },
}))
