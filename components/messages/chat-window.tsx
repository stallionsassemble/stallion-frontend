"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useMessages,
  useSearchMessages,
} from "@/lib/api/chat/queries";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { useAuth } from "@/lib/store/use-auth";
import { ConversationSummary, Message } from "@/lib/types";
import {
  ChevronLeft,
  Loader2,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./message-bubble";

interface ChatWindowProps {
  conversation: ConversationSummary;
  onBack?: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const {
    sendTyping,
    isPeerTyping,
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
    markMessagesAsRead
  } = useChatSocket(conversation.id);

  // Data Hooks
  const { data: messages = [], isLoading } = useMessages(conversation.id);

  // Local Loading States
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State
  const [inputValue, setInputValue] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search Query Hook
  const { data: searchResults } = useSearchMessages(conversation.id, searchQuery);

  // Mark as Read on Mount/Change
  // Mark as Read on Mount/Change
  useEffect(() => {
    if (messages.length > 0) {
      const unreadIds = messages
        .filter((m: Message) => !m.isRead && m.senderId !== currentUser?.id)
        .map((m: Message) => m.id);

      if (unreadIds.length > 0) {
        markMessagesAsRead(conversation.id, unreadIds);
      }
    }
  }, [conversation.id, messages, markMessagesAsRead, currentUser?.id]);

  // Partner Logic
  const getPartnerParticipant = (participants: ConversationSummary['participants']) => {
    if (!currentUser) return participants[0];
    const partner = participants.find((p) => p.userId !== currentUser.id);
    return partner || participants[0];
  };

  const partnerParticipant = getPartnerParticipant(conversation.participants);
  const partner = partnerParticipant?.user;

  // Handlers
  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (editingMessageId) {
      setIsUpdating(true);
      updateMessage(editingMessageId, inputValue)
        .then(() => {
          setInputValue("");
          setEditingMessageId(null);
        })
        .catch((err) => {
          console.error("Failed to update message", err);
          // toast.error("Failed to update message"); // need to import toast
        })
        .finally(() => setIsUpdating(false));
    } else {
      setIsSending(true);
      sendMessage({
        conversationId: conversation.id,
        recipientId: partnerParticipant?.userId || "",
        content: inputValue,
        type: "TEXT",
        attachments: [], // TODO: Handle real attachments
      })
        .then(() => {
          setInputValue("");
        })
        .catch((err) => {
          console.error("Failed to send message", err);
        })
        .finally(() => setIsSending(false));
    }
  };

  const handleEditInit = (id: string, content: string) => {
    setEditingMessageId(id);
    setInputValue(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputValue("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock attachment logic for now as we don't have file upload API ready in this snippet
      alert(`Selected file: ${file.name}. Attachment upload to be implemented.`);
      // Reset input
      e.target.value = "";
    }
  };

  // Determine which messages to show
  const displayMessages = showSearch && searchQuery ? (searchResults || []) : messages;

  if (!partner) return null;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-80px)] bg-background">
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
            <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary font-bold">
              {partner.firstName?.[0] || partner.username?.[0] || "?"}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-foreground font-inter">
              {partner.firstName ? `${partner.firstName} ${partner.lastName || ''}` : partner.username}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-green-500 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className={showSearch ? "bg-primary/10 text-primary" : "text-muted-foreground"}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          displayMessages.length === 0 && showSearch && searchQuery ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <>
              {isPeerTyping && (
                <div className="flex items-center gap-2 p-2 px-4 self-start">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Typing...</span>
                </div>
              )}
              {displayMessages.map((msg: Message) => (
                <MessageBubble
                  key={msg.id}
                  id={msg.id}
                  content={msg.content}
                  timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  isSent={msg.senderId === currentUser?.id}
                  isEdited={msg.updatedAt !== msg.createdAt}
                  onEdit={handleEditInit}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 relative">
        {editingMessageId && (
          <div className="absolute top-0 left-4 right-4 -translate-y-full bg-background border border-primary/20 border-b-0 rounded-t-md p-2 flex items-center justify-between shadow-sm z-10">
            <span className="text-xs font-medium text-primary">Editing message...</span>
            <button onClick={handleCancelEdit} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

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

          <Input
            placeholder={editingMessageId ? "Edit your message..." : "Type Message"}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 px-2 h-10"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              sendTyping(conversation.id, true);
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                sendTyping(conversation.id, false);
              }, 2000);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending || isUpdating}
          />

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Smile className="h-[25px] w-[25px]" />
          </Button>

          <Button
            size="icon"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={(isSending || isUpdating) || !inputValue.trim()}
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
