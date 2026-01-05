'use client'

import { useQuery } from '@tanstack/react-query';
import { chatService } from './index'

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, 'messages', conversationId] as const,
  unreadCount: (conversationId: string) =>
    [...chatKeys.all, 'unreadCount', conversationId] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatService.getConversations(),
  })
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 0,
  });
}

export function useUnreadCount(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.unreadCount(conversationId),
    queryFn: () => chatService.getUnreadCount(conversationId),
    enabled: !!conversationId,
  });
}

export function useSearchMessages(conversationId: string, query: string) {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), 'search', query],
    queryFn: () => chatService.searchMessages(conversationId, query),
    enabled: !!conversationId && !!query,
  })
}
