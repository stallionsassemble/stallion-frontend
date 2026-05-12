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
  submissionDeadline?: string
  deadline?: string
  announcementDate?: string
  location?: string
  token?: string
  
  // Prize Info
  totalPrizePool: number
  totalBudget?: number
  totalReward?: number
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
  
  ownerId?: string
  tags?: string[]
  partners?: Partner[]
  teamBased?: boolean
  maxTeamSize?: number
  
  createdAt: string
  updatedAt: string
  isParticipant?: boolean
  userTeam?: {
    id: string
    name: string
  }
  myTeam?: {
    id: string
    name: string
  }
  participation?: {
    id: string
    status: string
    teamId?: string
    team?: {
      id: string
      name: string
    }
    submission?: HackathonSubmission
  }
  team?: {
    id: string
    name: string
  }
  _count?: {
    submissions: number
    participants: number
    teams: number
  }
  userSubmission?: HackathonSubmission
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
