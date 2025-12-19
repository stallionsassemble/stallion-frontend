export interface LeaderboardUser {
  rank: number
  name: string
  handle: string
  avatar: string // URL
  isVerified?: boolean
  rating: number // e.g., 4.98
  completedTasks: number
  earnedAmount: number
  successRate: number // e.g. 98
  skills?: string[]
  category?: string
}
