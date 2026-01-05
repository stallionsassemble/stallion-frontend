import { User } from './index'

export interface DiscussionReaction {
  id: string
  emoji: string
  count: number
  hasReacted: boolean
}

export interface DiscussionReply {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  reactions: DiscussionReaction[]
  replyCount: number
  replies?: DiscussionReply[] // Nested replies
  parentId?: string
}

export interface Discussion {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  reactions: DiscussionReaction[]
  replyCount: number
  replies?: DiscussionReply[]
  bountyId?: string
  projectId?: string
}

export interface CreateDiscussionPayload {
  content: string
  bountyId?: string
  projectId?: string
}

export interface CreateReplyPayload {
  content: string
  parentId?: string
}

export interface ToggleReactionPayload {
  emoji: string
}
