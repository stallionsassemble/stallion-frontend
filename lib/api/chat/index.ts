import { api } from '@/lib/api'
import { Conversation, ConversationSummary, Message } from '@/lib/types/chat'

class ChatService {
  /*
  async createConversation(payload: CreateConversationPayload) {
    const response = await api.post<Conversation>(
      '/chat/conversations',
      payload
    )
    return response.data
  }
*/

  async getConversations() {
    const response = await api.get<ConversationSummary[]>('/chat/conversations')
    return response.data
  }

  async getConversation(id: string) {
    const response = await api.get<Conversation>(`/chat/conversations/${id}`)
    return response.data
  }

  async getMessages(id: string) {
    const response = await api.get<Message[]>(
      `/chat/conversations/${id}/messages`
    )
    return response.data
  }

  /*
  async addParticipants(id: string, payload: AddParticipantPayload) {
    const response = await api.post<AddParticipantResponse>(
      `/chat/conversations/${id}/participants`,
      payload
    )
    return response.data
  }

  async leaveConversation(id: string) {
    const response = await api.post<{ message: string }>(
      `/chat/conversations/${id}/leave`
    )
    return response.data
  }

  async sendMessage(payload: SendMessagePayload) {
    const response = await api.post<SendMessageResponse>(
      '/chat/messages',
      payload
    )
    return response.data
  }

  async updateMessage(id: string, payload: { content: string }) {
    const response = await api.patch<{ message: string }>(
      `/chat/messages/${id}`,
      payload
    )
    return response.data
  }

  async deleteMessage(id: string) {
    const response = await api.delete<{ message: string }>(
      `/chat/messages/${id}`
    )
    return response.data
  }

  async markAsRead(id: string) {
    const response = await api.post<{ message: string; updatedCount: number }>(
      `/chat/conversations/${id}/read`
    )
    return response.data
  }
*/

  async getUnreadCount(id: string) {
    const response = await api.get<{ message: string; updatedCount: number }>(
      `/chat/conversations/${id}/unread-count`
    )
    return response.data
  }

  async searchMessages(id: string, q: string) {
    const response = await api.get(`/chat/conversations/${id}/search`, {
      params: { q },
    })
    return response.data
  }
}

export const chatService = new ChatService()
