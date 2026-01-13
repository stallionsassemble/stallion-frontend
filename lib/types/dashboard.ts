export interface TalentDashboardStats {
  totalEarnings: number
  earningsPercentageChange: number
  activeBounties: number
  completedBounties: number
  completedProjects: number
}

export interface ProjectOwnerStats {
  totalBountiesCreated: number
  totalPaidOut: number
  paidOutPercentageChange: number
  pendingPayments: number
  totalContributors: number
}

export interface ProjectContributor {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePicture: string
  bio: string
  location: string
  skills: string[]
  totalBountiesParticipated: number
  totalProjectsParticipated: number
  totalEarnings: number
  createdAt: string
}

export type ProjectContributorsResponse = ProjectContributor[]
