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
  level: number
  bountyScore: number
  hackathonScore: number
  communityScore: number
  badges: Pick<Badge, 'id' | 'name' | 'icon'>[]
}

export type Leaderboard = LeaderboardEntry[]

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
