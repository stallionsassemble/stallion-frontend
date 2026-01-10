import { useQuery } from '@tanstack/react-query'
import { reputationService } from './index'

export const reputationKeys = {
  all: ['reputation'] as const,
  me: () => [...reputationKeys.all, 'me'] as const,
  user: (userId: string) => [...reputationKeys.all, 'user', userId] as const,
  leaderboard: () => [...reputationKeys.all, 'leaderboard'] as const,
  history: () => [...reputationKeys.all, 'history'] as const,
  historyUser: (userId: string) =>
    [...reputationKeys.all, 'history', userId] as const,
  badges: () => [...reputationKeys.all, 'badges'] as const,
  badge: (id: string) => [...reputationKeys.all, 'badges', id] as const,
  recentEarners: () => [...reputationKeys.all, 'recent-earners'] as const,
}

export function useMyReputation() {
  return useQuery({
    queryKey: reputationKeys.me(),
    queryFn: () => reputationService.getMyReputation(),
  })
}

export function useUserReputation(userId: string) {
  return useQuery({
    queryKey: reputationKeys.user(userId),
    queryFn: () => reputationService.getUserReputation(userId),
    enabled: !!userId,
  })
}

export function useLeaderboard(params?: {
  page?: number
  limit?: number
  category?: string
}) {
  return useQuery({
    queryKey: [...reputationKeys.leaderboard(), params],
    queryFn: () => reputationService.getLeaderboard(params),
  })
}

export function useMyHistory() {
  return useQuery({
    queryKey: reputationKeys.history(),
    queryFn: () => reputationService.getMyHistory(),
  })
}

export function useUserHistory(userId: string) {
  return useQuery({
    queryKey: reputationKeys.historyUser(userId),
    queryFn: () => reputationService.getUserHistory(userId),
    enabled: !!userId,
  })
}

export function useBadges() {
  return useQuery({
    queryKey: reputationKeys.badges(),
    queryFn: () => reputationService.getBadges(),
  })
}

export function useBadge(badgeId: string) {
  return useQuery({
    queryKey: reputationKeys.badge(badgeId),
    queryFn: () => reputationService.getBadge(badgeId),
    enabled: !!badgeId,
  })
}

export function useRecentEarners(params?: {
  page?: number
  limit?: number
  days?: number
}) {
  return useQuery({
    queryKey: [...reputationKeys.recentEarners(), params],
    queryFn: () =>
      reputationService.getRecentEarners(
        params?.page,
        params?.limit,
        params?.days
      ),
  })
}
