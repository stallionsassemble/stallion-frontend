'use client'

import { CreateConversationPayload } from '@/lib/types/chat'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatService } from './index'

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, 'messages', conversationId] as const,
  unreadCount: (conversationId: string) =>
    [...chatKeys.all, 'unreadCount', conversationId] as const,
}

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
  })
}

export function useUnreadCount(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.unreadCount(conversationId),
    queryFn: () => chatService.getUnreadCount(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,
  })
}

export function useSearchMessages(conversationId: string, query: string) {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), 'search', query],
    queryFn: () => chatService.searchMessages(conversationId, query),
    enabled: !!conversationId && !!query,
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateConversationPayload) =>
      chatService.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}
