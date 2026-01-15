import { authService } from '@/lib/api/auth'
import { LoginValues } from '@/lib/schemas/auth'
import { AuthResponse, User } from '@/lib/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  mfaEnabled: boolean

  passkeyRegisterOptions: () => Promise<any>
  passkeyRegisterVerify: (data: { response: any; name: string }) => Promise<{
    verified: boolean
    passkeyId: string
    name: string
    message: string
  }>
  passkeyAuthOptions: (email?: string) => Promise<any>
  passkeyAuthVerify: (data: {
    response: any
    email: string
  }) => Promise<AuthResponse>

  // Actions
  login: (data: LoginValues & { totpCode?: string }) => Promise<boolean>
  requestVerification: (data: { email: string; role?: string }) => Promise<void>
  verifyCode: (data: {
    email: string
    code: string
    type: string
    role?: string
    totpCode?: string
  }) => Promise<User | null>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setMfaEnabled: (mfaEnabled: boolean) => void
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      mfaEnabled: false,

      passkeyRegisterOptions: async () => {
        return await authService.passkeyRegisterOptions()
      },

      passkeyRegisterVerify: async (data) => {
        return await authService.passkeyRegisterVerify(data)
      },

      passkeyAuthOptions: async (email) => {
        return await authService.passkeyAuthOptions(email)
      },

      passkeyAuthVerify: async (data) => {
        const response = await authService.passkeyAuthVerify(data)
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          mfaEnabled: response.mfaEnabled,
        })
        return response
      },

      login: async (data) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(data)

          // Update State
          set({
            isAuthenticated: true,
            isLoading: false,
            mfaEnabled: response.mfaEnabled,
          })
          return !!response.mfaEnabled
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      requestVerification: async (data) => {
        set({ isLoading: true })
        try {
          await authService.requestVerification(data)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      verifyCode: async (data: {
        email: string
        code: string
        type: string
        role?: string
        totpCode?: string
      }) => {
        set({ isLoading: true })
        try {
          // Destructure type out, leave the rest for the API payload
          const { type, ...payload } = data

          let response
          if (type === 'login') {
            response = await authService.verifyLoginCode({
              email: payload.email,
              code: payload.code,
              totpCode: payload.totpCode,
            })
          } else {
            const { role, ...signupPayload } = payload
            response = await authService.verifySignupCode({
              ...signupPayload,
              //role,
            })
          }
          set({
            user: {
              ...response.user,
              mfaEnabled: response.mfaEnabled ?? response.user.mfaEnabled,
            },
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.user
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          // Attempt API logout but clear state regardless
          await authService.logout().catch(() => {})
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setMfaEnabled: (mfaEnabled: boolean) => set({ mfaEnabled }),

      checkAuth: async () => {
        const { accessToken } = get()
        if (!accessToken) return

        try {
          const user = await authService.profile()
          set({ user, isAuthenticated: true })
        } catch (error) {
          // If we fail to fetch profile (e.g. token expired), we should probably logout or just leave state as is?
          // For now, let's just log it and potentially clear auth if strictly 401 vs network error
          console.error('Failed to refresh user profile', error)
        }
      },
    }),
    {
      name: 'stallion-auth-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        mfaEnabled: state.mfaEnabled,
      }),
    }
  )
)
