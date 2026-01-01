import { api } from '@/lib/api'
import { CreateCategoryPayload } from '@/lib/types'
import {
  AddReaction,
  Categories,
  CategoryDetails,
  Comments,
  CreateCategoryResponse,
  CreateComment,
  CreateCommentResponse,
  CreatePost,
  CreateThreadPayload,
  CreateThreadResponse,
  ForumStatistics,
  GetThread,
  PinnedThreads,
  PostReactionResponse,
  PostResponse,
  ReactionResponse,
  SearchThreadsResponse,
  Tags,
  Threads,
  UpdateThread,
  UpdateThreadResponse,
} from '@/lib/types/forum'

class ForumService {
  // Categories
  async createCategory(payload: CreateCategoryPayload) {
    const response = await api.post<CreateCategoryResponse>(
      '/forum/categories',
      payload
    )
    return response.data
  }

  async getCategories() {
    const response = await api.get<Categories>('/forum/categories')
    return response.data
  }

  async getCategory(slug: string) {
    const response = await api.get<CategoryDetails>(`/forum/categories/${slug}`)
    return response.data
  }

  async getStats() {
    const response = await api.get<ForumStatistics>('/forum/stats')
    return response.data
  }

  // Threads
  async createThread(payload: CreateThreadPayload) {
    const response = await api.post<CreateThreadResponse>(
      '/forum/threads',
      payload
    )
    return response.data
  }

  async searchThreads(
    q: string,
    categoryId?: string,
    orderBy?: string,
    from?: string,
    to?: string
  ) {
    const response = await api.get<SearchThreadsResponse>(
      '/forum/threads/search',
      {
        params: { q, categoryId, orderBy, from, to },
      }
    )
    return response.data
  }

  async getMyPinnedThreads() {
    const response = await api.get<PinnedThreads>('/forum/threads/pinned')
    return response.data
  }

  async getThread(slug: string) {
    const response = await api.get<GetThread>(`/forum/threads/${slug}`)
    return response.data
  }

  async updateThread(id: string, payload: UpdateThread) {
    const response = await api.patch<UpdateThreadResponse>(
      `/forum/threads/${id}`,
      payload
    )
    return response.data
  }

  async deleteThread(id: string) {
    const response = await api.delete<{ message: string }>(
      `/forum/threads/${id}`
    )
    return response.data
  }

  /**
   * Toggles the pin status of a thread for current user
   * @param id The ID of the thread
   * @returns The updated thread
   */
  async togglePinThread(id: string) {
    const response = await api.patch<{ message: string }>(
      `/forum/threads/${id}/pin`
    )
    return response.data
  }

  // Posts
  async createPost(payload: CreatePost) {
    const response = await api.post<PostResponse>('/forum/posts', payload)
    return response.data
  }

  async updatePost(id: string, content: string) {
    const response = await api.patch<PostResponse>(`/forum/posts/${id}`, {
      content,
    })
    return response.data
  }

  async deletePost(id: string) {
    const response = await api.delete<{ message: string }>(`/forum/posts/${id}`)
    return response.data
  }

  // Reactions
  async getPostReactions(postId: string) {
    const response = await api.get<PostReactionResponse>(
      `/forum/posts/${postId}/reactions`
    )
    return response.data
  }

  async addOrRemoveReaction(payload: AddReaction) {
    const response = await api.post<ReactionResponse>(
      `/forum/posts/${payload.postId}/reactions`,
      { emoji: payload.emoji }
    )
    return response.data
  }

  // Tags
  async getTags() {
    const response = await api.get<Tags>('/forum/tags')
    return response.data
  }

  async getThreadsByTag(slug: string) {
    const response = await api.get<Threads>(`/forum/tags/${slug}`)
    return response.data
  }

  // Comment
  async createComment(payload: CreateComment) {
    const response = await api.post<CreateCommentResponse>(
      '/forum/comments',
      payload
    )
    return response.data
  }

  async getPostComments(postId: string) {
    const response = await api.get<Comments>(`/forum/posts/${postId}/comments`)
    return response.data
  }

  async updateComment(commentId: string, content: string) {
    const response = await api.patch<{
      id: string
      content: string
      isEdited: boolean
      updatedAt: string
    }>(`/forum/comments/${commentId}`, { content })
    return response.data
  }

  async deleteComment(commentId: string) {
    const response = await api.delete<{ message: string }>(
      `/forum/comments/${commentId}`
    )
    return response.data
  }
}

export const forumService = new ForumService()
