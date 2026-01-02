export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface Reputation {
  id: string
  userId: string
  score: number
  level: number
  bountyScore: number
  hackathonScore: number
  communityScore: number
  badges: Badge[]
  rank: number
  createdAt: string
  updatedAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  firstName: string
  lastName: string
  profilePicture: string
  score: number
  level: string
  bountyScore: number
  hackathonScore: number
  communityScore: number
  category: string
  isVerified: boolean
  earnedAmount: number
  completedTask: number
  successRate: number
  badges: Pick<Badge, 'id' | 'name' | 'icon'>[]
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export type Leaderboard = PaginatedResponse<LeaderboardEntry>

export interface ReputationHistoryEntry {
  id: string
  userId: string
  change: number
  reason: string
  category: string
  referenceId: string
  createdAt: string
}

export type ReputationHistory = ReputationHistoryEntry[]
