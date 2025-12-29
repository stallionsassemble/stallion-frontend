import { api } from '@/lib/api'

class ChatService {
  async createConversation(payload: any) {
    const response = await api.post('/chat/conversations', payload)
    return response.data
  }

  async getConversations() {
    const response = await api.get('/chat/conversations')
    return response.data
  }

  async getConversation(id: string) {
    const response = await api.get(`/chat/conversations/${id}`)
    return response.data
  }

  async getMessages(id: string) {
    const response = await api.get(`/chat/conversations/${id}/messages`)
    return response.data
  }

  async addParticipants(id: string, payload: any) {
    const response = await api.post(
      `/chat/conversations/${id}/participants`,
      payload
    )
    return response.data
  }

  async leaveConversation(id: string) {
    const response = await api.post(`/chat/conversations/${id}/leave`)
    return response.data
  }

  async sendMessage(payload: any) {
    const response = await api.post('/chat/messages', payload)
    return response.data
  }

  async updateMessage(id: string, payload: any) {
    const response = await api.patch(`/chat/messages/${id}`, payload)
    return response.data
  }

  async deleteMessage(id: string) {
    const response = await api.delete(`/chat/messages/${id}`)
    return response.data
  }

  async markAsRead(id: string) {
    const response = await api.post(`/chat/conversations/${id}/read`)
    return response.data
  }

  async getUnreadCount(id: string) {
    const response = await api.get(`/chat/conversations/${id}/unread-count`)
    return response.data
  }

  async searchMessages(id: string, params: any) {
    const response = await api.get(`/chat/conversations/${id}/search`, {
      params,
    })
    return response.data
  }
}

export const chatService = new ChatService()
