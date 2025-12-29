import { api } from '@/lib/api'

class ReputationService {
  async getMyReputation() {
    const response = await api.get('/reputation/me')
    return response.data
  }

  async getUserReputation(userId: string) {
    const response = await api.get(`/reputation/user/${userId}`)
    return response.data
  }

  async getLeaderboard() {
    const response = await api.get('/reputation/leaderboard')
    return response.data
  }

  async getMyHistory() {
    const response = await api.get('/reputation/history')
    return response.data
  }

  async getUserHistory(userId: string) {
    const response = await api.get(`/reputation/history/${userId}`)
    return response.data
  }

  async getBadges() {
    const response = await api.get('/reputation/badges')
    return response.data
  }

  async getBadge(badgeId: string) {
    const response = await api.get(`/reputation/badges/${badgeId}`)
    return response.data
  }
}

export const reputationService = new ReputationService()
