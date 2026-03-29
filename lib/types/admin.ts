import { User } from './index'
import { Bounty } from './bounties'

export interface AdminDashboardStats {
  totalUsers: number
  activeWorks: number
  totalPayoutsUsd: number
  userGrowth: {
    currentMonthDailyRegistrations: Record<string, number>
    monthToDate: number
    today: number
    genderDistribution: {
      MALE: number
      FEMALE: number
      UNSPECIFIED: number
    }
  }
  payoutAnalytics: Array<{
    month: string
    token: string
    totalAmount: number
    totalUsd: number
    count: number
  }>
  workStatus: {
    normalized: {
      active: number
      completed: number
      cancelled: number
      closed: number
    }
    raw: {
      bounties: Record<string, number>
      projects: Record<string, number>
    }
  }
  jobPerformance: Array<{
    quarter: string
    bountiesCreated: number
    projectsCreated: number
  }>
}

export interface UserAdminStats {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  bannedUsers: number
}

export interface BountyAdminStats {
  active: number
  completed: number
  disputed: number
  escrowLocked: number | string
}

export interface PayoutAdminStats {
  pendingApproval: number
  pendingAmountUsd: number
  completed30dUsd: number
  issues: number
}

export interface HackathonAdminStats {
  totalHackathons: number
  activeHackathons: number
  totalPrizePoolUsd: number
  totalParticipants: number
  totalSubmissions: number
}

export interface AdminMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface AdminPaginatedResponse<T> {
  data: T[]
  meta: AdminMeta
}

export interface AdminUser extends User {
  reputationRating: number
  bountiesParticipated: number
  projectsParticipated: number
  earningsUsd: number
  lastActiveAt: string | null
}

export interface AdminBounty extends Bounty {
  applicantCount: number
}

export interface SocialAuthDto {
  provider: 'GOOGLE' | 'APPLE'
  idToken: string
  role?: 'CONTRIBUTOR' | 'PROJECT_OWNER'
}

export interface SocialAuthResponse {
  accessToken: string
  refreshToken: string
  user: User & { profileCompleted: boolean }
  message: string
  provider: string
  isNewUser: boolean
}

export interface StepUpResponse {
  token: string
  expiresInSeconds: number
}

export interface FundingWalletResponse {
  fundingWalletId: string | null
  source: 'admin' | 'env' | 'none'
}
