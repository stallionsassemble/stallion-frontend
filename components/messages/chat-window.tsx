'use client';

import { Button } from '@/components/ui/button';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages, useSearchMessages } from '@/lib/api/chat/queries';
import { uploadService } from '@/lib/api/upload';
import { useGetUser } from '@/lib/api/users/queries';
import { useChatSocket } from '@/lib/hooks/use-chat-socket';
import { useAuth } from '@/lib/store/use-auth';
import { Conversation, ConversationSummary, Message, MessageAttachment } from '@/lib/types';
import { ChevronLeft, CornerUpLeft, File, Loader2, Paperclip, Search, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './message-bubble';

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();

  const { data: messages = [], isLoading } = useMessages(conversation.id);
  const {
    sendMessage: socketSendMessage,
    updateMessage: socketUpdateMessage,
    deleteMessage: socketDeleteMessage,
    markAsRead: socketMarkAsRead,
    sendTyping,
    getOnlineStatus,
    isConnected,
    typingUsers,
    userStatuses,
  } = useChatSocket(conversation.id);

  const [inputValue, setInputValue] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string; senderName: string } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults } = useSearchMessages(
    conversation.id,
    searchQuery
  );

  useEffect(() => {
    if (
      conversation.id &&
      conversation.unreadCount &&
      conversation.unreadCount > 0
    ) {
      socketMarkAsRead({ conversationId: conversation.id });
    }
  }, [conversation.id, conversation.unreadCount, socketMarkAsRead]);

  useEffect(() => {
    if (!currentUser || !isConnected) return;

    const recipientParticipant = conversation.participants.find(
      (p) => p.userId !== currentUser.id
    );

    if (recipientParticipant) {
      getOnlineStatus({ userIds: [recipientParticipant.userId] });
    }
  }, [conversation.participants, currentUser, isConnected, getOnlineStatus]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, pendingAttachments]);

  useEffect(() => {
    // Immediate scroll on mount without smooth behavior for instant load feel?
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation.id]);

  // Partner Logic
  const getPartner = (participants: ConversationSummary['participants']) => {
    if (!currentUser) return participants[0]?.user;
    const partner = participants.find((p) => p.userId !== currentUser.id);
    return partner ? partner.user : participants[0]?.user;
  };

  const partner = getPartner(conversation.participants);

  // Fetch full user details to ensure we have company info
  const { data: fullPartner } = useGetUser(partner?.id || '');

  // Use fetched data if available, otherwise fallback to conversation participant data
  const displayPartner = fullPartner || partner;

  const partnerParticipant = conversation.participants.find(
    (p) => p.userId !== currentUser?.id
  );
  const partnerStatus = partnerParticipant
    ? userStatuses[partnerParticipant.userId]
    : undefined;

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Last seen recently';

    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    if (diffDays === 1) return 'Last seen yesterday';
    if (diffDays < 7) return `Last seen ${diffDays}d ago`;
    return `Last seen ${lastSeenDate.toLocaleDateString()}`;
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && pendingAttachments.length === 0) || !isConnected) return;

    if (editingMessageId) {
      setIsUpdating(true);
      try {
        const response = await socketUpdateMessage({
          messageId: editingMessageId,
          content: inputValue,
        });

        if (response.success) {
          setInputValue('');
          setEditingMessageId(null);
        }
      } catch (error) {
        console.error('Failed to update message:', error);
      } finally {
        setIsUpdating(false);
      }
    } else {
      const recipientParticipant = conversation.participants.find(
        (p) => p.userId !== currentUser?.id
      );
      if (!recipientParticipant) return;

      setIsSending(true);
      try {
        const response = await socketSendMessage({
          recipientId: recipientParticipant.userId,
          conversationId: conversation.id,
          content: inputValue.trim() || (pendingAttachments.length > 0 ? (pendingAttachments[0].type.startsWith('image') ? 'Sent an image' : 'Sent a file') : ''),
          type: pendingAttachments.length > 0 ? (pendingAttachments[0].type.startsWith('image') ? 'IMAGE' : 'FILE') : 'TEXT',
          attachments: pendingAttachments,
          replyToMessageId: replyingTo?.id,
        });

        if (response.success) {
          setInputValue('');
          setPendingAttachments([]);
          setReplyingTo(null);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleEditInit = (id: string, content: string) => {
    setEditingMessageId(id);
    setInputValue(content);
    setReplyingTo(null); // Cancel reply if editing
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputValue('');
  };

  const handleReply = (id: string, content: string) => {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    // Get sender name
    const sender = message.senderId === currentUser?.id ? 'You' : (message.sender.firstName || message.sender.username);

    setReplyingTo({
      id,
      content: message.content || (message.attachments?.length ? 'Attachment' : ''),
      senderName: sender
    });
    setEditingMessageId(null); // Cancel edit if replying
    inputRef.current?.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      socketDeleteMessage({ messageId: id });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTyping({ conversationId: conversation.id, isTyping: true });

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping({ conversationId: conversation.id, isTyping: false });
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Assume uploadService is available and working
        // Determine upload method based on file type
        let response;
        if (file.type.startsWith('image/')) {
          response = await uploadService.uploadImage(file);
        } else if (file.type.startsWith('video/')) {
          response = await uploadService.uploadVideo(file);
        } else if (file.type.startsWith('audio/')) {
          response = await uploadService.uploadAudio(file);
        } else {
          response = await uploadService.uploadDocument(file);
        }

        // Assume response has url
        if (response && response.url) {
          setPendingAttachments(prev => [...prev, {
            url: response.url,
            type: file.type,
            name: file.name,
            size: file.size
          }]);
        }
      } catch (error) {
        console.error("File upload failed", error);
        alert("Failed to upload file");
      } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
      }
    }
  };

  // Determine which messages to show
  const rawMessages =
    showSearch && searchQuery ? searchResults || [] : messages;
  const displayMessages = [...rawMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!partner) return null;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-background">
      {/* Chat Header */}
      <div className="h-[76px] px-6 flex items-center gap-3 border-b border-[0.68px] border-primary/50 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 -ml-2 text-muted-foreground hover:text-foreground shrink-0"
            onClick={onBack}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20 bg-muted">
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={displayPartner.companyLogo || displayPartner.profilePicture}
                alt={displayPartner.companyName || displayPartner.firstName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-foreground font-inter">
              {displayPartner.companyName || (displayPartner.firstName
                ? `${displayPartner.firstName} ${displayPartner.lastName || ''}`
                : displayPartner.username)}
            </span>
            <div className="flex items-center gap-1.5">
              {Object.values(typingUsers).some(Boolean) ? (
                <span className="text-[12px] text-primary font-medium">
                  Typing...
                </span>
              ) : partnerStatus?.isOnline ? (
                <span className="text-[12px] text-green-500 font-medium">
                  Online
                </span>
              ) : (
                <span className="text-[12px] text-muted-foreground">
                  {formatLastSeen(partnerStatus?.lastSeen ?? null)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className={
            showSearch ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar (Conditional) */}
      {showSearch && (
        <div className="p-2 border-b border-primary/20 bg-muted/30">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Messages Area */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayMessages.length === 0 && showSearch && searchQuery ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No results found for &quot;{searchQuery}&quot;
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0 p-6">
          <div className="flex flex-col-reverse space-y-4 space-y-reverse min-h-full">
            <div ref={messagesEndRef} />
            {displayMessages.map((msg: Message) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                content={msg.isDeleted ? '[Message deleted]' : msg.content}
                timestamp={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                isSent={msg.senderId === currentUser?.id}
                isEdited={msg.isEdited}
                attachments={msg.attachments}
                replyToMessage={msg.replyToMessage}
                onEdit={msg.isDeleted ? undefined : handleEditInit}
                onDelete={msg.isDeleted ? undefined : handleDelete}
                onReply={handleReply}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="p-4 relative">
        {editingMessageId && (
          <div className="absolute top-0 left-4 right-4 -translate-y-full bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center justify-between shadow-sm z-10">
            <span className="text-xs font-medium text-primary">
              Editing message...
            </span>
            <button
              onClick={handleCancelEdit}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {replyingTo && (
          <div className="absolute top-0 left-4 right-4 -translate-y-full bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center justify-between shadow-sm z-10">
            <div className="flex-1 flex flex-col overflow-hidden mr-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <CornerUpLeft className="h-3 w-3" />
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {replyingTo.content}
              </span>
            </div>
            <button
              onClick={handleCancelReply}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Pending Attachments Preview */}
        {pendingAttachments.length > 0 && (
          <div className="absolute top-0 left-4 right-4 -translate-y-full bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center gap-2 shadow-sm z-10 overflow-x-auto" style={{ top: replyingTo || editingMessageId ? '-56px' : '0' }}>
            {/* Adjust top or translate based on stacked notifications if needed, for simplicity let's just stack them naturally or ensure only one is prominent, but user might want to reply AND attach. The current absolute positioning might overlap if both are present. Let's adjust logic: if replying/editing is present, attachments should sit above IT. */}
            {/* For now, let's just let them overlap in Z or use a flex container above. Actually, current CSS `absolute top-0 -translate-y-full` puts it exactly above the input container. If we have multiple, we need to stack them. */}
            {/* Simplified approach: If replying, attachments go above reply banner? Or just let them replace/stack. Let's try to stack them by adding a dynamic style or container. */}
            {/* Better approach: Create a container ABOVE input that holds all 'context' bars (reply, edit, attachments) in a flex-col-reverse stack. */}
          </div>
        )}

        {/* Improved Context Stack Container */}
        <div className="absolute top-0 left-4 right-4 -translate-y-full flex flex-col-reverse z-10">
          {/* Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center gap-2 shadow-sm overflow-x-auto mb-[-1px]">
              {pendingAttachments.map((att, i) => (
                <div key={i} className="relative group shrink-0">
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center border border-border">
                    {att.type.startsWith('image/') ? (
                      <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <File className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {isUploading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />}
            </div>
          )}

          {/* Reply or Edit Banner */}
          {(editingMessageId || replyingTo) && (
            <div className="bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center justify-between shadow-sm mb-[-1px]">
              {editingMessageId ? (
                <>
                  <span className="text-xs font-medium text-primary">Editing message...</span>
                  <button onClick={handleCancelEdit} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col overflow-hidden mr-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <CornerUpLeft className="h-3 w-3" />
                      Replying to {replyingTo?.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {replyingTo?.content}
                    </span>
                  </div>
                  <button onClick={handleCancelReply} className="text-muted-foreground hover:text-foreground shrink-0"><X className="h-4 w-4" /></button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-transparent p-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-[25px] w-[25px]" />
          </Button>

          <textarea
            ref={inputRef as any}
            placeholder={
              editingMessageId ? 'Edit your message...' : (replyingTo ? 'Type your reply...' : 'Type Message')
            }
            className="flex-1 bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 px-2 min-h-[40px] max-h-[120px] resize-none py-2 text-sm"
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending || isUpdating || !isConnected}
          />

          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            disabled={isSending || isUpdating || !isConnected}
          />

          <Button
            size="icon"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={isSending || isUpdating || !inputValue.trim()}
          >
            {isSending || isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-[25px] w-[25px]" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
