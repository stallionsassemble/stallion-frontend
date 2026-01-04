import { useSocket } from '@/components/providers/socket-provider'
import { Message, SendMessagePayload } from '@/lib/types/chat'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
export const useChatSocket = (conversationId: string) => {
  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return
    // 1. Join the conversation room
    socket.emit('join_conversation', { conversationId })

    // 2. Listen for incoming messages
    socket.on('receive_message', (newMessage: Message) => {
      // Update React Query cache instantly
      queryClient.setQueryData(
        ['messages', conversationId],
        (oldMessages: Message[] = []) => {
          // Prevent duplicates
          if (oldMessages.some((m) => m.id === newMessage.id))
            return oldMessages
          return [...oldMessages, newMessage]
        }
      )
    })

    // 3. Listen for typing indicators
    socket.on('user_typing', ({ user }: { user: string }) => {
      console.log(`${user} is typing...`)
      // You can expose a state like 'isTyping' here
    })

    return () => {
      // Cleanup: Leave room and remove listeners
      socket.emit('leave_conversation', { conversationId })
      socket.off('receive_message')
      socket.off('user_typing')
    }
  }, [socket, isConnected, conversationId, queryClient])

  // 4. Send Message Helper
  const sendMessage = useCallback(
    (payload: SendMessagePayload) => {
      if (!socket) return

      socket.emit('sendMessage', payload)
    },
    [socket]
  )

  // 5. Send Typing Indicator Helper
  const sendTyping = useCallback(() => {
    if (!socket) return
    socket.emit('typing', { conversationId })
  }, [socket, conversationId])
  return { sendMessage, sendTyping, isConnected }
}
