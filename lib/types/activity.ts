export interface ActivityMetadata {
  bountyTitle: string
  position: number
  reward: string
  currency: string
}

export interface ActivityUser {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePicture: string
}

export interface ActivityBounty {
  id: string
  title: string
  rewardCurrency: string
}

export type ActivityType =
  | 'BOUNTY_CREATED'
  | 'BOUNTY_SUBMISSION'
  | 'BOUNTY_WON'
  | 'BOUNTY_COMPLETED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_WON'
  | 'PROJECT_APPLICATION_SUBMITTED'
  | 'PROJECT_APPLICATION_ACCEPTED'
  | 'PROJECT_APPLICATION_REJECTED'
  | 'PROJECT_MILESTONE_SUBMITTED'
  | 'PROJECT_MILESTONE_APPROVED'
  | 'PROJECT_MILESTONE_PAID'
  | 'PROJECT_COMPLETED'
  | 'PROJECT_CANCELLED'
  | 'HACKATHON_CREATED'
  | 'HACKATHON_SUBMISSION'
  | 'HACKATHON_WON'
  | 'HACKATHON_COMPLETED'
  | 'FORUM_THREAD_CREATED'
  | 'FORUM_POST_CREATED'
  | 'FORUM_COMMENT_CREATED'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  metadata: ActivityMetadata
  createdAt: string
  user: ActivityUser
  bounty: ActivityBounty
}

export interface ActivityResponse {
  data: Activity[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
