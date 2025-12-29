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
  role?: 'CONTRIBUTOR' | 'OWNER'
  companyName?: string | null
  entityName?: string | null
  phoneNumber?: string | null
  industry?: string | null
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

// --- Chat Types ---
export interface Conversation {
  id: string
  createdAt: string
  updatedAt: string
  participants: {
    user: {
      id: string
      username: string
      firstName: string | null
      lastName: string | null
      profilePicture: string | null
    }
  }[]
  messages: Message[]
  unreadCount?: number
  lastReadAt?: string | null
}

export interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
  }
}

export interface CreateConversationPayload {
  participantIds: string[]
  initialMessage?: string
}

export interface CreateMessagePayload {
  conversationId: string
  content: string
}

export interface UpdateMessagePayload {
  content: string
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
