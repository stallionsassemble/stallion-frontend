import { User } from '@/lib/types'

export interface Currency {
  code: string
  name: string
  tokenAddress: string
  decimals: number
}

export type Currencies = Currency[]

export interface BountyDistribution {
  rank: number
  percentage: number | number[]
}

export interface BountySubmissionField {
  name: string
  label: string
  type: 'url' | 'text' | 'number'
  required: boolean
}

export interface BountyAttachment {
  filename: string
  url: string
  size: number
  mimetype?: string
}

export interface Bounty {
  id: string
  title: string
  shortDescription: string
  description: string
  reward: string
  rewardCurrency: string
  status: 'ACTIVE' | 'COMPLETED' | 'CLOSED'
  skills: string[]

  // Fields present in responses
  contractBountyId?: number
  ownerId: string
  owner?: User
  createdAt: string
  updatedAt: string

  // Deadlines
  submissionDeadline: string
  judgingDeadline: string

  // Extended fields
  requirements?: string[]
  deliverables?: string[]
  attachments?: BountyAttachment[]
  submissionFields?: BountySubmissionField[]

  // Distribution can be named 'distribution' or 'rewardDistribution' in different contexts
  distribution?: BountyDistribution[]
  rewardDistribution?: BountyDistribution[]

  token?: string
  txHash?: string
  applicationCount?: number
  submissionCount?: number
}

export interface CreateBountyDto {
  title: string
  shortDescription: string
  description: string
  reward: string | number // Payload example showed number, response string. Supporting both good practice for DTO.
  rewardCurrency: string
  skills: string[]

  requirements?: string[]
  deliverables?: string[]
  submissionFields?: BountySubmissionField[]
  attachments?: BountyAttachment[]

  distribution: BountyDistribution[]
  submissionDeadline: string // ISO date-time
  judgingDeadline: string // ISO date-time
}

export interface CreateBountyResponseDto {
  message: string
  bounty: Bounty
}

export interface PaginatedBountiesResponseDto {
  data: Bounty[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface GetAllBountiesPayload {
  page?: number
  limit?: number
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'reward'
    | 'submissionDeadline'
    | 'judgingDeadline'
    | 'title'
  sortOrder?: 'asc' | 'desc'
  status?: 'ACTIVE' | 'COMPLETED' | 'CLOSED'
  currency?: string
  skills?: string
  search?: string
  ownerId?: string
  minReward?: string
  maxReward?: string
}

export interface BountySubmissionData {
  githubRepo?: string
  liveDemo?: string
  estimatedHours?: number
  [key: string]: any
}

export interface BountySubmission {
  id: string
  bountyId: string
  userId: string
  submissionLink: string
  submissionData: BountySubmissionData
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  user?: User
}

export interface ApplyToBountyDto {
  submissionLink: string
  submissionData: BountySubmissionData
}

export interface ApplyToBountyResponseDto {
  message: string
  submission: BountySubmission
}

export interface UpdateSubmissionDto extends ApplyToBountyDto {}

export interface UpdateSubmissionResponseDto {
  message: string
  submission: BountySubmission
}

export interface BountyWinner {
  userId: string
  username: string
  firstName: string
  lastName: string
  profilePicture: string
  publicKey: string
  position: number
  amountWon: number
  currency: string
  percentage: number
  awardedAt: string
  rank?: number // Keep optional if used elsewhere
  rewardKey?: string // Keep optional
  // Add other known winner fields if available
  [key: string]: any
}

export interface BountyWinnersResponseDto {
  winners: BountyWinner[]
  totalReward: number
  currency: string
  bountyTitle: string
  bountyId: string
}

export interface SelectWinnersDto {
  winners: string[] // Array of user IDs
}

export interface SelectWinnersResponseDto {
  winners: string[]
}

// Admin DTOs
export interface UpdateAdminDto {
  newAdminAddress: string
}

export interface UpdateFeeAccountDto {
  newFeeAccount: string
}

export interface ContractStatsResponseDto {
  totalBounties: number
  totalRewards: string
  totalSubmissions: number
}

export interface EmergencyWithdrawDto {
  destination: string
  amount: string
}

export interface TransactionHashResponseDto {
  txHash: string
}

export interface UpdateBountyDto extends Partial<CreateBountyDto> {}

export interface UpdateBountyResponseDto {
  message: string
  bounty: Partial<Bounty> // Response often contains a subset or full bounty
}

export interface CloseBountyResponseDto {
  message: string
  bounty: Bounty
}
