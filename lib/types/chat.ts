export interface CreateConversationPayload {
  type: 'GROUP'
  participantIds: string[]
  name: string
  avatar?: string
}

export interface CreateConversationResponse {
  id: string
  name: string
  isGroup: boolean
  createdAt: string
  updatedAt: string
  participants: {
    id: string
    userId: string
    conversationId: string
    joinedAt: string
    user: {
      id: string
      username: string
      firstName: string
      lastName: string
      profilePicture: string
    }
  }[]
}

export interface ConversationSummary {
  id: string
  name: string
  isGroup: boolean
  createdAt: string
  updatedAt: string
  participants: {
    userId: string
    user: {
      username: string
      firstName: string
      lastName: string
      profilePicture: string
    }
  }[]
  lastMessage?: {
    id: string
    content: string
    createdAt: string
    senderId: string
  } | null
  unreadCount: number
}

export interface Message {
  id: string
  content: string
  senderId: string
  conversationId: string
  createdAt: string
  updatedAt: string
  isRead: boolean
  sender: {
    username: string
    firstName: string
    lastName: string
  }
}

export interface Conversation {
  id: string
  name: string
  isGroup: boolean
  createdAt: string
  updatedAt: string
  participants: {
    userId: string
    user: {
      username: string
      firstName: string
      lastName: string
      profilePicture: string
    }
  }[]
  messages: Message[]
  unreadCount?: number
  lastReadAt?: string | null
}

export interface AddParticipantPayload {
  userIds: string[]
}

export interface AddParticipantResponse {
  message: string
  conversation: {
    id: string
    participants: {
      userId: string
      user: {
        username: string
      }
    }[]
  }
}

export interface SendMessagePayload {
  recipientId: string
  content: string
  type?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  identifier?: string
  replyToMessageId?: string
  attachments?: {
    url: string
    type: string
  }[]
}

export interface SendMessageResponse {
  id: string
  content: string
  senderId: string
  conversationId: string
  createdAt: string
  updatedAt: string
  isRead: boolean
}
