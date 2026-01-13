export interface User {
  id: string
  email: string
  username?: string
  firstName?: string
  lastName?: string
  location?: string
  skills?: string[]
  profilePicture?: string
  socials?: {
    github?: string
    discord?: string
    twitter?: string
    website?: string
    linkedin?: string
    instagram?: string
  }
  role?: 'CONTRIBUTOR' | 'PROJECT_OWNER' | 'OWNER'
  companyName?: string | null
  entityName?: string | null
  phoneNumber?: string | null
  industry?: string | null
  bio?: string | null
  companyBio?: string | null
  companyLogo?: string | null
  emailNotifications?: boolean
  profileCompleted?: boolean
  mfaEnabled?: boolean
  emailVerified?: boolean
  createdAt?: string
  updatedAt?: string
  walletId?: string
  wallet?: {
    id: string
    publicKey: string
    isActivated: boolean
    createdAt: string
  }
  totalEarned?: string
  totalSubmissions?: number
  totalWon?: number
  totalPendingPay?: number
  rating?: number
  totalReviews?: number
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  mfaEnabled?: boolean
  mfaVerified?: boolean
}

export interface LoginResponse {
  message: string
  mfaEnabled: boolean
}

export interface MFAResponse {
  totpSecret: string
  qrCode: string
  message: string
}

export interface MFAVerifyResponse {
  message: string
  backupCodes: string[]
}

export interface CheckUsernameResponse {
  available: boolean
}

// --- Pagination ---
export interface PagedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// --- Forum Types ---
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  threadCount: number
  createdAt: string
}

export interface ForumTag {
  id: string
  name: string
  slug: string
  count: number
}

export interface Thread {
  id: string
  title: string
  slug: string
  content: string
  author: User
  category: Category
  tags: ForumTag[]
  viewCount: number
  replyCount: number
  createdAt: string
  updatedAt: string
  isPinned?: boolean
  isLocked?: boolean
}

export interface Post {
  id: string
  threadId: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  reactions?: { [key: string]: number }
}

export interface CreateCategoryPayload {
  name: string
  description?: string
  icon?: string
}

export interface CreateThreadPayload {
  title: string
  content: string
  categoryId: string
  tags?: string[]
}

export interface UpdateThreadPayload {
  title?: string
  content?: string
  tags?: string[]
  isPinned?: boolean
  isLocked?: boolean
}

export interface CreatePostPayload {
  threadId: string
  content: string
  parentId?: string // For nested replies
}

export interface UpdatePostPayload {
  content: string
}

export interface SubmissionProject {
  id: string
  title: string
  shortDescription: string
  reward: string
  currency: string
  status: string
  deadline: string
  type: 'GIG' | 'JOB'
  skills?: string[]
}

export interface SubmissionBounty {
  id: string
  title: string
  shortDescription: string
  reward: string
  rewardCurrency: string
  status: string
  submissionDeadline: string
  skills?: string[]
  submissionFields?: {
    name: string
    label: string
    type: 'url' | 'text' | 'number'
    required: boolean
  }[]
}

export interface UserProjectSubmission {
  type: 'project'
  id: string
  coverLetter: string
  estimatedCompletionTime: number
  portfolioLinks: string[]
  attachments: {
    url: string
    size: number
    filename: string
  }[]
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  projectId: string
  userId: string
  project: SubmissionProject
}

export interface UserBountySubmission {
  type: 'bounty'
  id: string
  submission: {
    description: string
    estimatedHours?: number
    [key: string]: any
  }
  submissionLink: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
  userId: string
  bountyId: string
  bounty: SubmissionBounty
}

export type UserSubmission = UserProjectSubmission | UserBountySubmission

export interface UserSubmissionsResponse {
  data: UserSubmission[]
  total: number
  page: number
  limit: number
  totalPages: number
}
export * from './chat'
