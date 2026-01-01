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
  type: ProjectType
  status: ProjectStatus
  ownerId: string
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
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: User
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
  title: string
  description: string
  amount: string
  dueDate: string
  status: string
  order: number
  submissionNote: string
  submissionUrl: string
  submittedAt: string
  reviewNote: string
  reviewedAt: string
  revisionNote: string
  txHash: string
  paidAt: string
  createdAt: string
  updatedAt: string
  projectId: string
  applicationId: string
  contributorId: string
}

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
  type: string
  message: string
  metadata: Record<string, any>
  createdAt: string
  projectId: string
  userId: string
  user: User
}
