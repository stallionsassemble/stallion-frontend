'use client';

import { ChatWindow } from '@/components/messages/chat-window';
import { MessagesSidebar } from '@/components/messages/messages-sidebar';
import { EmptyState } from '@/components/ui/empty-state';
import { useConversations } from '@/lib/api/chat/queries';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const { data: conversations = [], isLoading } = useConversations();

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex h-full w-full bg-background p-4 md:p-0 overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground font-inter">
            Messages
          </h1>
          <p className="text-sm text-muted-foreground font-inter">
            Chat with project owners and contributors
          </p>
        </div>

        <div className="flex flex-1 w-full border-[0.68px] border-primary/50 rounded-lg overflow-hidden bg-card/20 shadow-sm">
          <div
            className={`${
              showChat ? 'hidden md:flex' : 'flex'
            } w-full md:w-auto flex-col h-full`}
          >
            {isLoading ? (
              <div className="w-full lg:w-[400px] h-full flex items-center justify-center border-r border-primary/50">
                <span className="text-muted-foreground">
                  Loading conversations...
                </span>
              </div>
            ) : (
              <MessagesSidebar
                conversations={conversations}
                selectedId={selectedId || ''}
                onSelect={(id) => {
                  setSelectedId(id);
                  setShowChat(true);
                }}
              />
            )}
          </div>

          <div
            className={`${
              showChat ? 'flex' : 'hidden md:flex'
            } flex-1 flex-col h-full w-full bg-background/50`}
          >
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
