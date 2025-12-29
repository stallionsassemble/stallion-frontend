import { api } from '@/lib/api'
import { User } from '@/lib/types'

export class UserService {
  async getUser(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }

  async updateUser(id: string, data: Partial<User>) {
    const response = await api.patch<User>(`/users/${id}`, data)
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
}

export const userService = new UserService()
