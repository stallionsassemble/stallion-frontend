import { api } from '@/lib/api';
import {
  AddParticipantPayload,
  AddParticipantResponse,
  Conversation,
  CreateConversationPayload,
  Message,
  UnreadCountResponse,
} from '@/lib/types/chat';

class ChatService {
  async getConversations() {
    const response = await api.get<Conversation[]>('/chat/conversations');
    return response.data;
  }

  async getConversation(id: string) {
    const response = await api.get<Conversation>(`/chat/conversations/${id}`);
    return response.data;
  }

  async getMessages(conversationId: string) {
    const conversation = await this.getConversation(conversationId);
    return conversation.messages;
  }

  async getUnreadCount(id: string) {
    const response = await api.get<UnreadCountResponse>(
      `/chat/conversations/${id}/unread-count`
    );
    return response.data;
  }

  async searchMessages(id: string, q: string) {
    const response = await api.get<Message[]>(
      `/chat/conversations/${id}/search`,
      {
        params: { q },
      }
    );
    return response.data;
  }

  async createConversation(payload: CreateConversationPayload) {
    const response = await api.post<Conversation>(
      '/chat/conversations',
      payload
    );
    return response.data;
  }

  /*
  async addParticipants(id: string, payload: AddParticipantPayload) {
    const response = await api.post<AddParticipantResponse>(
      `/chat/conversations/${id}/participants`,
      payload
    );
    return response.data;
  }

  async leaveConversation(id: string) {
    const response = await api.post<{ message: string }>(
      `/chat/conversations/${id}/leave`
    );
    return response.data;
  }
}

export const chatService = new ChatService();
