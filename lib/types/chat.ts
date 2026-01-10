export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
export type ConversationType = 'DIRECT' | 'GROUP'
export type ParticipantRole = 'MEMBER' | 'ADMIN'

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
  role?: string
  companyName?: string | null
  companyLogo?: string | null
}

export interface MessageAttachment {
  url: string
  type: string
  name?: string
  size?: number
}

export interface Message {
  id: string
  content: string
  senderId: string
  conversationId: string
  type: MessageType
  isEdited: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  identifier?: string
  attachments?: MessageAttachment[] | null
  replyToMessageId?: string | null
  sender: User
  replyToMessage?: Message | null
  delivered?: boolean
  deliveredAt?: string
  read?: boolean
  readBy?: string[]
}

export interface ConversationParticipant {
  id?: string
  userId: string
  role?: ParticipantRole
  user: User
}

export interface ConversationSummary {
  id: string
  name: string | null
  isGroup: boolean
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  lastMessage?: {
    id: string
    content: string
    createdAt: string
    senderId: string
  } | null
  unreadCount: number
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string | null
  avatar?: string | null
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  messages: Message[]
  unreadCount?: number
}

export interface SendMessagePayload {
  recipientId: string
  conversationId?: string
  content: string
  type?: MessageType
  identifier?: string
  attachments?: MessageAttachment[]
  replyToMessageId?: string
}

export interface SendMessageResponse {
  success: boolean
  delivered: boolean
  message: Message
  error?: string
}

export interface UpdateMessagePayload {
  messageId: string
  content: string
}

export interface UpdateMessageResponse {
  success: boolean
  message: {
    id: string
    content: string
    isEdited: boolean
    updatedAt: string
  }
  error?: string
}

export interface DeleteMessagePayload {
  messageId: string
}

export interface DeleteMessageResponse {
  success: boolean
  messageId: string
  error?: string
}

export interface MarkAsReadPayload {
  conversationId: string
  messageId?: string
}

export interface MarkAsReadResponse {
  success: boolean
  conversationId: string
  messageId?: string
  error?: string
}

export interface MarkMessagesAsReadPayload {
  conversationId: string
  messageIds: string[]
}

export interface MarkMessagesAsReadResponse {
  success: boolean
  conversationId: string
  count: number
  error?: string
}

export interface TypingPayload {
  conversationId: string
  isTyping: boolean
}

export interface TypingResponse {
  success: boolean
  conversationId: string
  isTyping: boolean
  error?: string
}

export interface GetOnlineStatusPayload {
  userIds: string[]
}

export interface UserStatus {
  userId: string
  isOnline: boolean
  lastSeen: string | null
}

export interface GetOnlineStatusResponse {
  success: boolean
  statuses: UserStatus[]
  error?: string
}

export interface MessageUpdatedEvent {
  id: string
  content: string
  isEdited: boolean
  updatedAt: string
  conversationId: string
}

export interface MessageDeletedEvent {
  messageId: string
  conversationId: string
}

export interface MessageReadEvent {
  conversationId: string
  userId: string
  messageId: string
}

export interface MessageDeliveredEvent {
  messageId: string
  conversationId: string
  deliveredAt: string
}

export interface NewConversationEvent {
  id: string
  type: ConversationType
  name: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
}

export interface ConversationUpdatedEvent {
  conversationId: string
  lastMessage: {
    id: string
    content: string
    senderId: string
    createdAt: string
  }
}

export interface UserStatusChangedEvent {
  userId: string
  isOnline: boolean
  lastSeen: string | null
}

export interface UserTypingEvent {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface AuthenticatedEvent {
  success: boolean
  message: string
  pendingMessages: number
}

export interface ExceptionEvent {
  status: string
  message: string
}

export interface UnreadCountResponse {
  conversationId: string
  unreadCount: number
}

export interface CreateConversationPayload {
  type: 'GROUP'
  participantIds: string[]
  name: string
  avatar?: string
}

export interface AddParticipantPayload {
  userIds: string[]
}

export interface AddParticipantResponse {
  message: string
  conversation: {
    id: string
    participants: ConversationParticipant[]
  }
}
