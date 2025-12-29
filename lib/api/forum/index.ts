import { api } from '@/lib/api'

class ForumService {
  // Categories
  async createCategory(payload: any) {
    const response = await api.post('/forum/categories', payload)
    return response.data
  }

  async getCategories() {
    const response = await api.get('/forum/categories')
    return response.data
  }

  async getCategory(slug: string) {
    const response = await api.get(`/forum/categories/${slug}`)
    return response.data
  }

  // Threads
  async createThread(payload: any) {
    const response = await api.post('/forum/threads', payload)
    return response.data
  }

  async searchThreads(params?: any) {
    const response = await api.get('/forum/threads/search', { params })
    return response.data
  }

  async getThread(slug: string) {
    const response = await api.get(`/forum/threads/${slug}`)
    return response.data
  }

  async updateThread(id: string, payload: any) {
    const response = await api.patch(`/forum/threads/${id}`, payload)
    return response.data
  }

  async deleteThread(id: string) {
    const response = await api.delete(`/forum/threads/${id}`)
    return response.data
  }

  // Posts
  async createPost(payload: any) {
    const response = await api.post('/forum/posts', payload)
    return response.data
  }

  async updatePost(id: string, payload: any) {
    const response = await api.patch(`/forum/posts/${id}`, payload)
    return response.data
  }

  async deletePost(id: string) {
    const response = await api.delete(`/forum/posts/${id}`)
    return response.data
  }

  // Reactions
  async addReaction(payload: any) {
    const response = await api.post('/forum/reactions', payload)
    return response.data
  }

  // Tags
  async getTags() {
    const response = await api.get('/forum/tags')
    return response.data
  }

  async getThreadsByTag(slug: string) {
    const response = await api.get(`/forum/tags/${slug}`)
    return response.data
  }
}

export const forumService = new ForumService()
