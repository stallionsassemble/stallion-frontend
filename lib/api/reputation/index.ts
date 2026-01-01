import { api } from '@/lib/api'
import {
  Badge,
  Leaderboard,
  Reputation,
  ReputationHistory,
} from '@/lib/types/reputation'

class ReputationService {
  async getMyReputation() {
    const response = await api.get<Reputation>('/reputation/me')
    return response.data
  }

  async getUserReputation(userId: string) {
    const response = await api.get<Reputation>(`/reputation/user/${userId}`)
    return response.data
  }

  async getLeaderboard() {
    const response = await api.get<Leaderboard>('/reputation/leaderboard')
    return response.data
  }

  async getMyHistory() {
    const response = await api.get<ReputationHistory>('/reputation/history')
    return response.data
  }

  async getUserHistory(userId: string) {
    const response = await api.get<ReputationHistory>(
      `/reputation/history/${userId}`
    )
    return response.data
  }

  async getBadges() {
    const response = await api.get<Badge[]>('/reputation/badges')
    return response.data
  }

  async getBadge(badgeId: string) {
    const response = await api.get<Badge>(`/reputation/badges/${badgeId}`)
    return response.data
  }
}

export const reputationService = new ReputationService()
