'use client'

import { SendMessagePayload } from '@/lib/types'
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
    mutationFn: (data: SendMessagePayload) => chatService.sendMessage(data),
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

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

export function useUpdateMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      chatService.updateMessage(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] })
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => chatService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] })
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

// Search
export function useSearchMessages(conversationId: string, query: string) {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), 'search', query],
    queryFn: () => chatService.searchMessages(conversationId, query),
    enabled: !!conversationId && !!query,
  })
}
