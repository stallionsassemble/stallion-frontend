import { useSocket } from '@/components/providers/socket-provider';
import {
  ConversationUpdatedEvent,
  DeleteMessagePayload,
  DeleteMessageResponse,
  GetOnlineStatusPayload,
  GetOnlineStatusResponse,
  MarkAsReadPayload,
  MarkAsReadResponse,
  Message,
  MessageDeletedEvent,
  MessageDeliveredEvent,
  MessageReadEvent,
  MessageUpdatedEvent,
  NewConversationEvent,
  SendMessagePayload,
  SendMessageResponse,
  TypingPayload,
  TypingResponse,
  UpdateMessagePayload,
  UpdateMessageResponse,
  UserStatus,
  UserStatusChangedEvent,
  UserTypingEvent,
} from '@/lib/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { chatKeys } from '../api/chat/queries';

export const useChatSocket = (conversationId?: string) => {
  const { socket, isConnected, isAuthenticated } = useSocket();
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>(
    {}
  );

  useEffect(() => {
    if (!socket || !isConnected || !isAuthenticated) return;

    const handleNewMessage = (message: Message) => {
      console.log('[Chat] New message received:', message);

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(message.conversationId),
        (oldMessages = []) => {
          if (oldMessages.some((m) => m.id === message.id)) {
            return oldMessages;
          }
          return [...oldMessages, message];
        }
      );

      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    };

    const handleMessageUpdated = (data: MessageUpdatedEvent) => {
      console.log('[Chat] Message updated:', data);

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(data.conversationId),
        (oldMessages = []) => {
          return oldMessages.map((msg) =>
            msg.id === data.id
              ? {
                  ...msg,
                  content: data.content,
                  isEdited: data.isEdited,
                  updatedAt: data.updatedAt,
                }
              : msg
          );
        }
      );
    };

    const handleMessageDeleted = (data: MessageDeletedEvent) => {
      console.log('[Chat] Message deleted:', data);

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(data.conversationId),
        (oldMessages = []) => {
          return oldMessages.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, isDeleted: true, content: '[Message deleted]' }
              : msg
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    };

    const handleMessageDelivered = (data: MessageDeliveredEvent) => {
      console.log('[Chat] Message delivered:', data);

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(data.conversationId),
        (oldMessages = []) => {
          return oldMessages.map((msg) =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  delivered: true,
                  deliveredAt: data.deliveredAt,
                }
              : msg
          );
        }
      );
    };

    const handleMessageRead = (data: MessageReadEvent) => {
      console.log('[Chat] Message read:', data);

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(data.conversationId),
        (oldMessages = []) => {
          return oldMessages.map((msg) =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  read: true,
                  readBy: [...(msg.readBy || []), data.userId],
                }
              : msg
          );
        }
      );
    };

    const handleNewConversation = (conversation: NewConversationEvent) => {
      console.log('[Chat] New conversation:', conversation);
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    };

    const handleConversationUpdated = (data: ConversationUpdatedEvent) => {
      console.log('[Chat] Conversation updated:', data);
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    };

    const handleUserStatusChanged = (data: UserStatusChangedEvent) => {
      console.log('[Chat] User status changed:', data);
      setUserStatuses((prev) => ({
        ...prev,
        [data.userId]: {
          userId: data.userId,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen,
        },
      }));
    };

    const handleUserTyping = (data: UserTypingEvent) => {
      if (conversationId && data.conversationId === conversationId) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));

        if (data.isTyping) {
          setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [data.userId]: false,
            }));
          }, 3000);
        }
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messageRead', handleMessageRead);
    socket.on('newConversation', handleNewConversation);
    socket.on('conversationUpdated', handleConversationUpdated);
    socket.on('userStatusChanged', handleUserStatusChanged);
    socket.on('userTyping', handleUserTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messageRead', handleMessageRead);
      socket.off('newConversation', handleNewConversation);
      socket.off('conversationUpdated', handleConversationUpdated);
      socket.off('userStatusChanged', handleUserStatusChanged);
      socket.off('userTyping', handleUserTyping);
    };
  }, [socket, isConnected, isAuthenticated, conversationId, queryClient]);

  const sendMessage = useCallback(
    (
      payload: SendMessagePayload,
      callback?: (response: SendMessageResponse) => void
    ) => {
      if (!socket || !isConnected) {
        console.error('[Chat] Cannot send message: socket not connected');
        return;
      }

      socket.emit('sendMessage', payload, (response: SendMessageResponse) => {
        if (response.success) {
          console.log('[Chat] Message sent successfully:', response.message);
        } else {
          console.error('[Chat] Failed to send message:', response.error);
        }
        callback?.(response);
      });
    },
    [socket, isConnected]
  );

  const updateMessage = useCallback(
    (
      payload: UpdateMessagePayload,
      callback?: (response: UpdateMessageResponse) => void
    ) => {
      if (!socket || !isConnected) {
        console.error('[Chat] Cannot update message: socket not connected');
        return;
      }

      socket.emit(
        'updateMessage',
        payload,
        (response: UpdateMessageResponse) => {
          if (response.success) {
            console.log('[Chat] Message updated successfully');
          } else {
            console.error('[Chat] Failed to update message:', response.error);
          }
          callback?.(response);
        }
      );
    },
    [socket, isConnected]
  );

  const deleteMessage = useCallback(
    (
      payload: DeleteMessagePayload,
      callback?: (response: DeleteMessageResponse) => void
    ) => {
      if (!socket || !isConnected) {
        console.error('[Chat] Cannot delete message: socket not connected');
        return;
      }

      socket.emit(
        'deleteMessage',
        payload,
        (response: DeleteMessageResponse) => {
          if (response.success) {
            console.log('[Chat] Message deleted successfully');
          } else {
            console.error('[Chat] Failed to delete message:', response.error);
          }
          callback?.(response);
        }
      );
    },
    [socket, isConnected]
  );

  const markAsRead = useCallback(
    (
      payload: MarkAsReadPayload,
      callback?: (response: MarkAsReadResponse) => void
    ) => {
      if (!socket || !isConnected) {
        console.error('[Chat] Cannot mark as read: socket not connected');
        return;
      }

      socket.emit('markAsRead', payload, (response: MarkAsReadResponse) => {
        if (response.success) {
          console.log('[Chat] Messages marked as read');
        } else {
          console.error('[Chat] Failed to mark as read:', response.error);
        }
        callback?.(response);
      });
    },
    [socket, isConnected]
  );

  const sendTyping = useCallback(
    (payload: TypingPayload, callback?: (response: TypingResponse) => void) => {
      if (!socket || !isConnected) return;

      socket.emit('typing', payload, (response: TypingResponse) => {
        callback?.(response);
      });
    },
    [socket, isConnected]
  );

  const getOnlineStatus = useCallback(
    (
      payload: GetOnlineStatusPayload,
      callback?: (response: GetOnlineStatusResponse) => void
    ) => {
      if (!socket || !isConnected) {
        console.error('[Chat] Cannot get online status: socket not connected');
        return;
      }

      socket.emit(
        'getOnlineStatus',
        payload,
        (response: GetOnlineStatusResponse) => {
          if (response.success) {
            console.log('[Chat] Online status received:', response.statuses);
            const statusMap: Record<string, UserStatus> = {};
            response.statuses.forEach((status) => {
              statusMap[status.userId] = status;
            });
            setUserStatuses((prev) => ({ ...prev, ...statusMap }));
          } else {
            console.error(
              '[Chat] Failed to get online status:',
              response.error
            );
          }
          callback?.(response);
        }
      );
    },
    [socket, isConnected]
  );

  return {
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
    sendTyping,
    getOnlineStatus,
    isConnected,
    isAuthenticated,
    typingUsers,
    userStatuses,
  };
};
