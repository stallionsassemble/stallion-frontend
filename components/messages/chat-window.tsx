"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Paperclip, Send, Smile } from "lucide-react";
import Image from "next/image";
import { MessageBubble } from "./message-bubble";

import { Conversation } from "@/app/dashboard/messages/page";

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
}

const MOCK_MESSAGES: Record<string, { id: string; content: string; timestamp: string; isSent: boolean }[]> = {
  "1": [
    {
      id: "1",
      content: "Hi! I saw your application for the smart contract audit.",
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: "2",
      content: "Yes! I'm very interested in the project. I have experience with similar audits.",
      timestamp: "10:32 AM",
      isSent: true,
    },
    {
      id: "3",
      content: "When is the deadline for this?",
      timestamp: "10:33 AM",
      isSent: false,
    },
  ],
  "2": [
    {
      id: "1",
      content: "Hey Alex, are we still on for the meeting?",
      timestamp: "09:00 AM",
      isSent: true,
    },
    {
      id: "2",
      content: "Yes, seeing you in 10 mins.",
      timestamp: "09:05 AM",
      isSent: false,
    },
    {
      id: "3",
      content: "When is the next audit round?",
      timestamp: "09:00 AM",
      isSent: false,
    },
  ],
  "3": [
    {
      id: "1",
      content: "Check out the latest commit.",
      timestamp: "1:00 PM",
      isSent: false,
    },
    {
      id: "2",
      content: "I pushed the changes to the repo.",
      timestamp: "1:02 PM",
      isSent: false,
    },
    {
      id: "3",
      content: "Great, I will review it shortly.",
      timestamp: "1:05 PM",
      isSent: true,
    },
  ],
  "4": [
    {
      id: "1",
      content: "Can we schedule a call to discuss the new feature?",
      timestamp: "2:30 PM",
      isSent: false,
    },
    {
      id: "2",
      content: "Sure, how about tomorrow at 10 AM?",
      timestamp: "2:35 PM",
      isSent: true,
    },
  ],
  "5": [
    {
      id: "1",
      content: "The deployment plan looks solid.",
      timestamp: "4:00 PM",
      isSent: false,
    },
    {
      id: "2",
      content: "Approved. Proceed with deployment.",
      timestamp: "4:05 PM",
      isSent: false,
    },
    {
      id: "3",
      content: "Understood, starting the process now.",
      timestamp: "4:10 PM",
      isSent: true,
    },
  ],
  "6": [
    {
      id: "1",
      content: "We need to finalize the contract details.",
      timestamp: "5:00 PM",
      isSent: false,
    },
    {
      id: "2",
      content: "Let's close this deal today.",
      timestamp: "5:15 PM",
      isSent: false,
    },
    {
      id: "3",
      content: "I'll send over the updated draft.",
      timestamp: "5:20 PM",
      isSent: true,
    },
  ],
};

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const messages = MOCK_MESSAGES[conversation.id] || [];

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
        <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20">
          <Image
            src={`https://avatar.vercel.sh/${conversation.user.avatar}`}
            width={40}
            height={40}
            alt={conversation.user.name}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-foreground font-inter">
              {conversation.user.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* <span className="h-2 w-2 rounded-full bg-green-500 block" /> */}
            <span className="text-[12px] text-green-500 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
            isSent={msg.isSent}
          />
        ))}
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
          />

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Smile className="h-[25px] w-[25px]" />
          </Button>

          <Button size="icon" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md h-9 w-9 shrink-0">
            <Send className="h-[25px] w-[25px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
