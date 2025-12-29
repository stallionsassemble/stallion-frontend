'use client'

import { CreateMessagePayload } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatService } from './index'

// Keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, 'messages', conversationId] as const,
}

// Queries
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
    // Refetch more frequently for chat
    refetchInterval: 5000,
  })
}

// Mutations
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMessagePayload) => chatService.sendMessage(data),
    onSuccess: (newMessage, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.conversationId),
      })
      // Invalidate conversation list (to update last message/timestamp)
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      })
    },
  })
}
