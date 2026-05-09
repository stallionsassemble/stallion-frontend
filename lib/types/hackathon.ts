import { User } from './index'

export interface Hackathon {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  heroImage?: string
  logo?: string
  status: 'DRAFT' | 'PUBLISHED' | 'JUDGING' | 'COMPLETED' | 'CANCELLED'
  type: 'OPEN_SOURCE' | 'CLOSED_SOURCE'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  
  // Dates
  startDate: string
  endDate: string
  registrationDeadline: string
  submissionDeadline: string
  
  // Prize Info
  totalPrizePool: number
  currency: string
  asset?: string
  prizeDistribution?: PrizeDistribution[]
  prizePool?: PrizeDistribution[]
  
  tracks?: string[]
  requirements?: string[]
  deliverables?: string[]
  // Numbers
  participantCount: number
  submissionCount: number
  viewCount: number
  
  totalReward?: number
  ownerId?: string
  tracks?: string[]
  deliverables?: string[]
  tags?: string[]
  partners?: Partner[]
  
  createdAt: string
  updatedAt: string
}

export interface PrizeDistribution {
  rank?: number
  position?: number
  amount: number
  label?: string
}

export interface Partner {
  name: string
  logo: string
  website?: string
}

export interface HackathonSubmission {
  id: string
  hackathonId: string
  userId: string
  teamName: string
  description: string
  projectUrl: string
  videoUrl?: string
  githubUrl?: string
  members: string[]
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WINNER'
  feedback?: string
  rank?: number
  prizeAmount?: number
  createdAt: string
  updatedAt: string
}
