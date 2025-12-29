import { useAuth } from '@/lib/store/use-auth'
import axios from 'axios'

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  let token = useAuth.getState().accessToken

  // Fallback: Try reading from localStorage if state is empty but storage exists
  if (!token && typeof window !== 'undefined') {
    try {
      const storage = localStorage.getItem('stallion-auth-storage')
      if (storage) {
        const parsed = JSON.parse(storage)
        token = parsed.state?.accessToken
      }
    } catch (e) {
      console.error('Failed to parse auth storage', e)
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip retry for verification endpoints where 401 means invalid code, not invalid token
    if (
      originalRequest.url?.includes('/verify-code') ||
      originalRequest.url?.includes('/verify-totp')
    ) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        let refreshToken = useAuth.getState().refreshToken

        // Fallback: Try reading from localStorage
        if (!refreshToken && typeof window !== 'undefined') {
          const storage = localStorage.getItem('stallion-auth-storage')
          if (storage) {
            const parsed = JSON.parse(storage)
            refreshToken = parsed.state?.refreshToken
          }
        }

        if (refreshToken) {
          // Use a fresh axios instance to avoid interceptor loops
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {
              refreshToken,
            }
          )

          const newAccessToken = data.accessToken || data.access_token
          const newRefreshToken = data.refreshToken || data.refresh_token

          if (newAccessToken) {
            useAuth
              .getState()
              .setTokens(newAccessToken, newRefreshToken || refreshToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        useAuth.getState().logout()
      }
    }
    return Promise.reject(error)
  }
)
