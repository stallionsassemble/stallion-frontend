import { api } from '@/lib/api'
import { User, UserSubmissionsResponse } from '@/lib/types'

export class UserService {
  async getUser(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }

  async getUserByUsername(username: string) {
    const response = await api.get<User>(`/users/${username}`)
    return response.data
  }

  async updateContributorProfile(data: Partial<User>) {
    const response = await api.patch<{ message: string }>(
      `/settings/profile/contributor`,
      data
    )
    return response.data
  }

  async updateOwnerProfile(data: Partial<User>) {
    const response = await api.patch<{ message: string }>(
      `/settings/profile/project-owner`,
      data
    )
    return response.data
  }

  async deleteUser(id: string) {
    const response = await api.delete<{ message: string }>(`/users/${id}`)
    return response.data
  }

  async getReputation() {
    const response = await api.get<{
      score: number
      history: any[]
      badges: any[]
    }>('/reputation/me')
    return response.data
  }

  async getUserSubmissions() {
    const response = await api.get<UserSubmissionsResponse>(
      `/users/submissions`
    )
    return response.data
  }
}

export const userService = new UserService()
