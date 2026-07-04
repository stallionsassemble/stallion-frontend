'use client';

import { useState } from 'react';
import { MessageCircle, X, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatWindow } from '@/components/messages/chat-window';
import { useConversations } from '@/lib/api/chat/queries';
import { useGetUserByUsername } from '@/lib/api/users/queries';
import { useChatSocket } from '@/lib/hooks/use-chat-socket';
import { useAuth } from '@/lib/store/use-auth';
import { toast } from 'sonner';

export function FloatingAdminChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Hardcoded admin username
  const adminUsername = 'stallion';
  const { data: adminUser, isLoading: isLoadingAdmin } = useGetUserByUsername(adminUsername);
  const adminId = adminUser?.id || '';
  
  const { data: conversations = [], refetch } = useConversations();
  const { sendMessage } = useChatSocket();

  // Find existing conversation with admin
  const adminConversation = conversations.find((c) =>
    c.participants.some((p) => p.userId === adminId)
  );

  // If the user is not authenticated or is the admin themselves, don't show the button
  if (!user || user.id === adminId) {
    return null;
  }

  const handleStartChat = async () => {
    if (!adminId) {
      toast.error('Could not find the support user (stallion).');
      return;
    }
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const response = await sendMessage({
        recipientId: adminId,
        content: message.trim(),
        type: 'TEXT',
      });

      if (response?.success) {
        setMessage('');
        await refetch();
      } else {
        toast.error(response?.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error starting chat with admin:', error);
      toast.error('An error occurred while sending the message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] bg-background border border-primary/20 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-300">
          <div className="flex-1 flex flex-col min-h-0 bg-background w-full">
            {adminConversation ? (
              // Use existing ChatWindow if a conversation exists
              <ChatWindow
                conversation={adminConversation}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              // Start screen
              <div className="flex-1 flex flex-col h-full w-full">
                {/* Header */}
                <div className="h-[76px] px-6 flex items-center justify-between border-b border-[0.68px] border-primary/50 shrink-0 bg-background">
                  <h3 className="font-bold text-foreground text-[16px] font-inter">Support Chat</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Body */}
                <div className="flex-1 flex flex-col p-6 justify-center">
                  <div className="text-center mb-8">
                    <MessageCircle className="h-14 w-14 text-primary mx-auto mb-4 opacity-80" />
                    <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Send us a message and our support team will get back to you as soon as possible.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] bg-muted/30 border-primary/20 resize-none text-sm focus:border-primary/50"
                    />
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium h-11"
                      onClick={handleStartChat}
                      disabled={!message.trim() || isSending || isLoadingAdmin}
                    >
                      {isSending || isLoadingAdmin ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
