export interface LeaderboardEntry {
  id: string
  rank: number
  userId: string
  username: string
  firstName?: string
  lastName?: string
  profilePicture?: string
  category: string
  level: number
  completedTasksCount: number
  earnedAmount: number
  successRate: number
  rating: number // 1-5
  totalReviews: number
}
