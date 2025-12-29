import { api } from '@/lib/api'
import { LoginValues } from '@/lib/schemas/auth'
import {
  AuthResponse,
  CheckUsernameResponse,
  LoginResponse,
  MFAResponse,
  MFAVerifyResponse,
  User,
} from '@/lib/types'

export class AuthService {
  // --- Auth & Verification ---

  async login(data: LoginValues & { totpCode?: string }) {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  }

  async requestVerification(data: { email: string; role?: string }) {
    const response = await api.post<{ message: string }>(
      '/auth/signup/request-verification',
      data
    )
    return response.data
  }

  async verifySignupCode(data: { email: string; code: string; role?: string }) {
    const response = await api.post<AuthResponse>(
      '/auth/signup/verify-code',
      data
    )
    return response.data
  }

  async verifyLoginCode(data: {
    email: string
    code: string
    totpCode?: string
    role?: string
  }) {
    const response = await api.post<AuthResponse>(
      '/auth/login/verify-code',
      data
    )
    return response.data
  }

  // --- Passkeys (WebAuthn) ---

  async passkeyRegisterOptions() {
    const response = await api.post('/auth/passkey/register-options')
    return response.data
  }

  async passkeyRegisterVerify(data: unknown) {
    const response = await api.post<{ success: boolean }>(
      '/auth/passkey/register-verify',
      data
    )
    return response.data
  }

  async passkeyAuthOptions() {
    const response = await api.post('/auth/passkey/auth-options')
    return response.data
  }

  async passkeyAuthVerify(data: unknown) {
    const response = await api.post<AuthResponse>(
      '/auth/passkey/auth-verify',
      data
    )
    return response.data
  }

  async refreshToken(refreshToken: string) {
    const response = await api.post<{
      accessToken: string
      refreshToken: string
    }>('/auth/refresh', { refreshToken })
    return response.data
  }

  async logout() {
    const response = await api.post<{ message: string }>('/auth/logout')
    return response.data
  }

  // --- MFA & Security ---

  async setupMfa(userId: string) {
    const response = await api.post<MFAResponse>(`/auth/setup-mfa/${userId}`)
    return response.data
  }

  async verifyTotp(userId: string, code: string) {
    const response = await api.post<MFAVerifyResponse>(
      `/auth/verify-totp/${userId}`,
      { code }
    )
    return response.data
  }

  // --- Profile Completion ---

  async completeProfileContributor(data: any) {
    const response = await api.post<{ message: string; user: User }>(
      '/auth/signup/complete-profile/contributor',
      data
    )
    return response.data
  }

  async completeProfileOwner(data: any) {
    const response = await api.post<{ message: string }>(
      '/auth/signup/complete-profile/owner',
      data
    )
    return response.data
  }

  async checkUsername(username: string) {
    const response = await api.get<CheckUsernameResponse>(
      `/auth/check-username/${username}`
    )
    return response.data
  }

  async profile() {
    const response = await api.get<User>('/auth/profile')
    return response.data
  }
}

export const authService = new AuthService()
