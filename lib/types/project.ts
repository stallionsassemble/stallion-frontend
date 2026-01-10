import { User } from '@/lib/types'

export type ProjectStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'CLOSED'
export type ProjectType = 'GIG' | 'JOB'
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface Attachment {
  filename: string
  url: string
  size: number
  mimetype?: string
}

export interface MilestoneDraft {
  title: string
  description: string
  amount: string
  dueDate: string
}

/**
 * Payload for creating a new project
 */
export interface CreateProjectPayload {
  title: string
  shortDescription: string
  description: string
  requirements: string[]
  deliverables: string[]
  skills: string[]
  attachments: Attachment[]
  reward: string
  currency: string
  deadline: string
  type: ProjectType
  peopleNeeded: number
  milestones: MilestoneDraft[]
}

/**
 * Payload for getting projects with filters
 */
export interface GetProjectsPayload {
  type?: ProjectType
  status?: ProjectStatus
  ownerId?: string
}

/**
 * Project interface representing a project entity
 */
export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  requirements: string[]
  deliverables: string[]
  skills: string[]
  attachments: Attachment[]
  reward: string
  currency: string
  deadline: string
  status: ProjectStatus
  type: ProjectType
  peopleNeeded: number
  acceptedCount: number
  contractProjectId: number
  txHash: string
  escrowContractId: number | null
  createdAt: string
  updatedAt: string
  ownerId: string
  winnerAnnouncement?: string
  milestones?: (MilestoneDraft & { id?: string; order?: number })[]
  applied: boolean
  applications?: ApplyProjectResponse[]
  released?: string
  escrowed?: string
  winner?: any
  owner: {
    id: string
    username: string
    firstName: string
    lastName: string
    companyName: string
    profilePicture: string
    companyLogo?: string
    createdAt?: string
    totalPaid: string
    totalBounties: number
    totalProjects: number
    bio?: string
    rating?: string
  }
}

/**
 * Array of projects
 */
export type Projects = Project[]

/**
 * Detailed project interface
 */
export type ProjectDetails = Project

/**
 * Payload for applying to a project
 */
export interface ApplyProjectPayload {
  coverLetter: string
  estimatedCompletionTime: number
  portfolioLinks: string[]
  attachments: Attachment[]
}

/**
 * Response for project application
 */
export interface ApplyProjectResponse {
  id: string
  coverLetter: string
  estimatedCompletionTime: number
  portfolioLinks: string[]
  attachments: Attachment[]
  status: ApplicationStatus
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  projectId: string
  userId: string
  user: User
  project: ProjectDetails
}

/**
 * Array of project applications
 */
export type ProjectApplications = ApplyProjectResponse[]

/**
 * Payload for reviewing a project application
 */
export interface ProjectReviewPayload {
  status: 'ACCEPTED' | 'REJECTED'
  rejectReason: string
}

/**
 * Response for project review
 */
export type ProjectReviewResponse = ApplyProjectResponse

/**
 * Project milestone interface
 */
export interface ProjectMilestone {
  id: string
  status: string
  submissionNote: string | null
  submissionUrl: string | null
  submittedAt: string | null
  reviewNote: string | null
  reviewedAt: string | null
  revisionNote: string | null
  txHash: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  milestoneId: string
  applicationId: string
  contributorId: string
  milestone: {
    id: string
    title: string
    description: string
    amount: string
    dueDate: string
    order: number
    createdAt: string
    updatedAt: string
    projectId: string
    project: {
      id: string
      title: string
      currency: string
    }
  }
}

export interface GetProjectMilestonesResponse {
  id: string
  title: string
  description: string
  amount: string
  dueDate: string
  order: number
  createdAt: string
  updatedAt: string
  projectId: string
}

export type GetProjectMilestonesResponses = GetProjectMilestonesResponse[]

/**
 * Array of project milestones
 */
export type ProjectMilestones = ProjectMilestone[]

/**
 * Array of my milestones
 */
export type MyMilestones = ProjectMilestone[]

/**
 * Payload for submitting a milestone
 */
export interface SubmitMilestonePayload {
  submissionNote: string
  submissionUrl: string
  attachments?: Attachment[]
}

/**
 * Payload for reviewing a milestone
 */
export interface ReviewMilestonePayload {
  approve: boolean
  reviewNote: string
  revisionNote: string
}

/**
 * Response for reviewing a milestone
 */
export interface ReviewMilestoneResponse extends ProjectMilestone {}

/**
 * Project activity interface
 */
export interface ProjectActivity {
  id: string
  type:
    | 'PROJECT_COMPLETED'
    | 'PROJECT_MILESTONE_PAID'
    | 'PROJECT_MILESTONE_APPROVED'
    | 'PROJECT_MILESTONE_SUBMITTED'
    | 'PROJECT_APPLICATION_ACCEPTED'
    | 'PROJECT_APPLICATION_SUBMITTED'
    | 'PROJECT_UPDATED'
    | 'PROJECT_CREATED'
  message: string
  metadata: Record<string, any>
  createdAt: string
  userId: string
  bountyId: string | null
  projectId: string
  hackathonId: string | null
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string
  }
  bounty: any | null
  project: {
    id: string
    title: string
    currency: string
  }
  hackathon: any | null
}

/**
 * Response for project activities
 */
export interface ProjectActivitiesResponse {
  data: ProjectActivity[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
