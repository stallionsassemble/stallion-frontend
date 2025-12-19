"use client";

import { ChatWindow } from "@/components/messages/chat-window";
import { MessagesSidebar } from "@/components/messages/messages-sidebar";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isActive?: boolean;
  isAdmin?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  unreadCount?: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Stallion Foundation",
      handle: "stallardev",
      avatar: "stallion",
      isAdmin: true,
    },
    lastMessage: "Thanks for the update on the smart contract!",
    unreadCount: 2,
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Alex Rivera",
      handle: "arivera",
      avatar: "alex",
      isAdmin: false,
    },
    lastMessage: "When is the next audit round?",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Sarah Chen",
      handle: "sarahc",
      avatar: "sarah",
      isAdmin: false,
    },
    lastMessage: "I pushed the changes to the repo.",
    unreadCount: 1,
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Mike Ross",
      handle: "mross",
      avatar: "mike",
      isAdmin: false,
    },
    lastMessage: "Can we schedule a call?",
  },
  {
    id: "5",
    user: {
      id: "u5",
      name: "Jessica Pearson",
      handle: "jpearson",
      avatar: "jessica",
      isAdmin: true,
    },
    lastMessage: "Approved. Proceed with deployment.",
  },
  {
    id: "6",
    user: {
      id: "u6",
      name: "Harvey Specter",
      handle: "hspecter",
      avatar: "harvey",
      isAdmin: false,
    },
    lastMessage: "Let's close this deal today.",
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const selectedConversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="flex h-full w-full bg-background p-4 md:p-0 overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground font-inter">Messages</h1>
          <p className="text-sm text-muted-foreground font-inter">Chat with project owners and contributors</p>
        </div>

        <div className="flex flex-1 w-full border-[0.68px] border-primary/50 rounded-lg overflow-hidden bg-card/20 shadow-sm">
          <div className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-auto flex-col h-full`}>
            <MessagesSidebar
              conversations={MOCK_CONVERSATIONS}
              selectedId={selectedId || ""}
              onSelect={(id) => {
                setSelectedId(id);
                setShowChat(true);
              }}
            />
          </div>

          <div className={`${showChat ? "flex" : "hidden md:flex"} flex-1 flex-col h-full w-full bg-background/50`}>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onBack={() => setShowChat(false)}
              />
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No conversation selected"
                description="Choose a conversation from the sidebar to start chatting or view previous messages."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
