"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessages, useSendMessage } from "@/lib/api/chat/queries";
import { useAuth } from "@/lib/store/use-auth";
import { Conversation, Message } from "@/lib/types";
import { ChevronLeft, Loader2, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { MessageBubble } from "./message-bubble";

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const { data: messages = [], isLoading } = useMessages(conversation.id);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const [inputValue, setInputValue] = useState("");

  const getPartner = (participants: Conversation['participants']) => {
    if (!currentUser) return participants[0]?.user;
    const partner = participants.find((p) => p.user.id !== currentUser.id);
    return partner ? partner.user : participants[0]?.user;
  };

  const partner = getPartner(conversation.participants);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    sendMessage(
      { conversationId: conversation.id, content: inputValue },
      {
        onSuccess: () => {
          setInputValue("");
        },
      }
    );
  };

  if (!partner) return null;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-80px)] bg-background">
      {/* Chat Header */}
      <div className="h-[76px] px-6 flex items-center gap-3 border-b border-[0.68px] border-primary/50 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2 -ml-2 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onBack}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20 bg-muted">
          {partner.profilePicture ? (
            <img
              src={partner.profilePicture}
              className="w-full h-full object-cover"
              alt={partner.username}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary font-bold">
              {partner.firstName?.[0] || partner.username?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-foreground font-inter">
              {partner.firstName ? `${partner.firstName} ${partner.lastName || ''}` : partner.username}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* <span className="h-2 w-2 rounded-full bg-green-500 block" /> */}
            <span className="text-[12px] text-green-500 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          messages.map((msg: Message) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              isSent={msg.sender.id === currentUser?.id}
            />
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-transparent p-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Paperclip className="h-[25px] w-[25px]" />
          </Button>

          <Input
            placeholder="Type Message"
            className="flex-1 bg-transparent border-none focus-visible:ring-0 px-2 h-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending}
          />

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Smile className="h-[25px] w-[25px]" />
          </Button>

          <Button
            size="icon"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={isSending || !inputValue.trim()}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-[25px] w-[25px]" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
