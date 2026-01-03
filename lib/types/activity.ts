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

export interface Activity {
  id: string
  type: string
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
