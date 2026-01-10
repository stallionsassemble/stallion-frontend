import { api } from '@/lib/api'
import {
  Badge,
  Leaderboard,
  RecentEarnerResponse,
  Reputation,
  ReputationHistory,
} from '@/lib/types/reputation'

class ReputationService {
  async getMyReputation() {
    const response = await api.get<Reputation>('/reputation')
    return response.data
  }

  async getUserReputation(userId: string) {
    const response = await api.get<Reputation>(`/reputation/user/${userId}`)
    return response.data
  }

  async getLeaderboard(params?: {
    page?: number
    limit?: number
    category?: string
  }) {
    const response = await api.get<Leaderboard>('/reputation/leaderboard', {
      params,
    })
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

  async getRecentEarners(page?: number, limit?: number, days?: number) {
    const response = await api.get<RecentEarnerResponse>(
      '/reputation/leaderboard/recent-earners',
      {
        params: {
          page,
          limit,
          days,
        },
      }
    )
    return response.data
  }
}

export const reputationService = new ReputationService()
