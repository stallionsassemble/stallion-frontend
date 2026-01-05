import { useSocket } from '@/components/providers/socket-provider'
import { Message, SendMessagePayload } from '@/lib/types/chat'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useChatSocket = (conversationId?: string) => {
  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()
  const [isPeerTyping, setIsPeerTyping] = useState(false)

  // Helper for emitting with acknowledgement
  const emitWithAck = useCallback(
    (event: string, payload: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'))
          return
        }
        socket.emit(event, payload, (response: any) => {
          if (response?.error) {
            reject(response.error)
          } else {
            resolve(response)
          }
        })
      })
    },
    [socket]
  )

  useEffect(() => {
    if (!socket || !isConnected) return

    // Global events (if any) could go here

    // Conversation-specific events
    if (conversationId) {
      // 1. Listen for events
      socket.on('exception', (error: any) => {
        console.error('Socket exception:', error)
        toast.error(error?.message || ' an error occurred')
      })

      // ... existing listeners ...
      socket.on('newMessage', (newMessage: Message) => {
        queryClient.setQueryData(
          ['chat', 'messages', conversationId],
          (oldMessages: Message[] = []) => {
            if (oldMessages.some((m) => m.id === newMessage.id))
              return oldMessages
            return [newMessage, ...oldMessages] // Prepend for flex-col-reverse
          }
        )
        // Invalidate to update last message in conversation list
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      })

      socket.on('updateMessage', (response: any) => {
        const updatedMessage = response.message || response
        queryClient.setQueryData(
          ['chat', 'messages', conversationId],
          (oldMessages: Message[] = []) => {
            return oldMessages.map((m) =>
              m.id === updatedMessage.id ? updatedMessage : m
            )
          }
        )
      })

      socket.on('deleteMessage', ({ messageId }: { messageId: string }) => {
        queryClient.setQueryData(
          ['chat', 'messages', conversationId],
          (oldMessages: Message[] = []) => {
            return oldMessages.filter((m) => m.id !== messageId)
          }
        )
      })

      socket.on(
        'messageDelivered',
        ({
          messageId,
          deliveredAt,
        }: {
          messageId: string
          deliveredAt: string
        }) => {
          queryClient.setQueryData(
            ['chat', 'messages', conversationId],
            (oldMessages: Message[] = []) => {
              return oldMessages.map((m) =>
                m.id === messageId ? { ...m, deliveredAt } : m
              )
            }
          )
        }
      )

      socket.on(
        'messageRead',
        ({ messageId, userId }: { messageId: string; userId: string }) => {
          queryClient.setQueryData(
            ['chat', 'messages', conversationId],
            (oldMessages: Message[] = []) => {
              return oldMessages.map((m) =>
                m.id === messageId ? { ...m, isRead: true } : m
              )
            }
          )
        }
      )

      socket.on(
        'typing',
        ({
          conversationId: typingConvId,
          isTyping,
        }: {
          conversationId: string
          isTyping: boolean
        }) => {
          if (typingConvId === conversationId) {
            setIsPeerTyping(isTyping)
          }
        }
      )
    }

    return () => {
      if (conversationId) {
        socket.off('exception')
        socket.off('newMessage')
        socket.off('updateMessage')
        socket.off('deleteMessage')
        socket.off('messageDelivered')
        socket.off('messageRead')
        socket.off('typing')
      }
    }
  }, [socket, isConnected, conversationId, queryClient])

  // Event Emitters
  const createConversation = useCallback(
    (payload: any) => emitWithAck('createConversation', payload),
    [emitWithAck]
  )

  const sendMessage = useCallback(
    (payload: SendMessagePayload) => emitWithAck('sendMessage', payload),
    [emitWithAck]
  )

  const updateMessage = useCallback(
    (messageId: string, content: string) =>
      emitWithAck('updateMessage', { messageId, content }),
    [emitWithAck]
  )

  const deleteMessage = useCallback(
    (messageId: string) => emitWithAck('deleteMessage', { messageId }),
    [emitWithAck]
  )

  const markAsRead = useCallback(
    (messageId: string, conversationId: string) => {
      if (!socket) return
      socket.emit('markAsRead', { messageId, conversationId })
    },
    [socket]
  )

  const getOnlineStatus = useCallback(
    (userIds: string[]) => {
      if (!socket) return
      socket.emit('getOnlineStatus', { userIds })
    },
    [socket]
  )

  const sendTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (!socket) return
      socket.emit('typing', { conversationId, isTyping })
    },
    [socket]
  )

  const markMessagesAsRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      if (!socket) return
      socket.emit('markMessagesAsRead', { conversationId, messageIds })
    },
    [socket]
  )

  return {
    createConversation,
    sendMessage,
    updateMessage,
    sendTyping,
    isConnected,
    deleteMessage,
    markAsRead,
    getOnlineStatus,
    markMessagesAsRead,
    isPeerTyping,
  }
}
