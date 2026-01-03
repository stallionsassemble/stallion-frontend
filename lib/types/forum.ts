export interface CreateCategoryPayload {
  name: string
  slug: string
  description: string
  icon: string
  isActive: boolean
}

export interface CreateCategoryResponse {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  isActive: boolean
  threadCount: number
  postCount: number
  createdAt: string
  updatedAt: string
  creatorId: string
  _count: {
    threads: number
  }
}

export interface ForumStatistics {
  totalDiscussions: number
  activeMembers: number
  postsToday: number
  onlineUsers: number
}

export type Categories = Category[]

export interface Thread {
  id: string
  title: string
  slug: string
  isPinned: true
  isLocked: false
  viewCount: number
  postCount: number
  likeCount?: number
  replyCount?: number
  isAdmin?: boolean
  author: {
    username: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

export interface CategoryDetails {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  threads: Thread[]
  createdAt: string
}

export interface CreateThreadPayload {
  title: string
  slug: string
  categoryId: string
  content: string
  tags: string[]
}

export interface CreateThreadResponse {
  id: string
  title: string
  slug: string
  content: string
  categoryId: string
  authorId: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface SearchThread {
  id: string
  title: string
  slug: string
  content: string
  description?: string
  categoryId: string
  category: {
    name: string
    slug: string
  }
  author: {
    username: string
    firstName: string
    lastName: string
  }
  postCount: number
  viewCount: number
  likeCount?: number
  replyCount?: number
  isAdmin?: boolean
  createdAt: string
}

export type SearchThreadsResponse = SearchThread[]

export interface PinnedThread {
  id: string
  title: string
  slug: string
  author: {
    username: string
    firstName: string
    lastName: string
  }
  category: {
    name: string
    slug: string
  }
  postCount: number
  viewCount: number
  likeCount?: number
  pinnedAt: string
  createdAt: string
  isAdmin?: boolean
}

export type PinnedThreads = PinnedThread[]

export interface Post {
  id: string
  content: string
  authorId: string
  threadId: string
  createdAt: string
  author: {
    username: string
    firstName: string
    lastName: string
    profilePicture?: string
  }
  reactions: {
    id: string
    emoji: string
    userId: string
    user: {
      id: string
      username: string
    }
    createdAt: string
  }[]
  isAdmin?: boolean
}

export interface GetThread {
  id: string
  title: string
  slug: string
  content: string
  categoryId: string
  authorId: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  likeCount?: number
  isAdmin?: boolean
  createdAt: string
  author: {
    username: string
    firstName: string
    lastName: string
    profilePicture?: string
    role: string
    postCount: number
    reactionCount: number
    replyCount: number
  }
  posts: Post[]
  tags: {
    id: string
    name: string
    slug: string
  }[]
}

export interface UpdateThread {
  title?: string
  content?: string
  isLocked?: boolean
  tags?: string[]
}

export interface UpdateThreadResponse {
  id: string
  title: string
  slug: string
  content: string
  updatedAt: string
}

export interface CreatePost {
  threadId: string
  content: string
}

export interface PostResponse extends CreatePost {
  authorId: string
  id: string
  createdAt: string
  updatedAt: string
}

export interface PostReactionResponse {
  postId: string
  reactions: {
    emoji: string
    count: number
    users: {
      id: string
      username: string
      firstName: string
      lastName: string
      profilePicture: string | null
    }[]
  }[]
  totalReactions: number
}

export interface AddReaction {
  postId: string
  emoji: string
}

export interface ReactionResponse {
  id: string
  type: string
  postId: string
  userId: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  threadCount: number
}

export type Tags = Tag[]

export type Threads = {
  id: string
  title: string
  slug: string
  content: string
  author: {
    username: string
    firstName: string
    lastName: string
  }
  postCount: number
  viewCount: number
  createdAt: string
}[]

export interface CreateComment {
  content: string
  postId: string
  parentId?: string
}

export interface CreateCommentResponse {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isEdited: boolean
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string | null
  }
  replies: Comment[]
  isAdmin?: boolean
  createdAt: string
}

export type Comments = Comment[]
