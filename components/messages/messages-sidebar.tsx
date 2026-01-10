'use client';

import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { useGetUser } from '@/lib/api/users/queries';
import { useAuth } from '@/lib/store/use-auth';
import { Conversation, ConversationSummary } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, SearchX, UserCog } from 'lucide-react';

interface MessagesSidebarProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}
interface ConversationListItemProps {
  conversation: Conversation;
  selectedId: string;
  onSelect: (id: string) => void;
  currentUser: any;
}

function ConversationListItem({ conversation, selectedId, onSelect, currentUser }: ConversationListItemProps) {
  // Logic to find partner
  const getPartner = (participants: ConversationSummary['participants']) => {
    if (!currentUser) return participants[0]?.user;
    const partner = participants.find((p) => p.userId !== currentUser.id);
    return partner ? partner.user : participants[0]?.user;
  };

  const partner = getPartner(conversation.participants);

  // Fetch full details
  const { data: fullPartner } = useGetUser(partner?.id || '');
  const displayPartner = fullPartner || partner;

  if (!displayPartner) return null;

  const isSelected = selectedId === conversation.id;
  const lastMessage =
    conversation.messages[conversation.messages.length - 1]?.content ||
    'No messages yet';
  const isAdmin = displayPartner.role === 'ADMIN';

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[0.68px] border-primary/50',
        isSelected ? 'bg-primary/10' : 'hover:bg-primary/5'
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="h-12 w-12 rounded-full overflow-hidden border border-primary/20 bg-muted">
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={displayPartner.companyLogo || displayPartner.profilePicture}
              alt={displayPartner.companyName || displayPartner.firstName}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 font-inter">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-foreground truncate font-inter">
              {displayPartner.companyName || (displayPartner.firstName
                ? `${displayPartner.firstName} ${displayPartner.lastName || ''}`
                : displayPartner.username)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-muted-foreground font-light font-inter">
            @{displayPartner.username}
          </span>
          {isAdmin && (
            <Badge className="bg-amber-900/80 hover:bg-amber-900 border-none text-foreground text-[8px] h-4 px-1.5 gap-0.5 rounded-full">
              <UserCog className="h-2 w-2" />
              Admin
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] text-muted-foreground truncate font-light">
            {lastMessage}
          </p>
          {conversation.unreadCount ? (
            <div className="bg-[#3B82F6] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shrink-0">
              {conversation.unreadCount}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export function MessagesSidebar({
  conversations,
  selectedId,
  onSelect,
}: MessagesSidebarProps) {
  const { user: currentUser } = useAuth();



  return (
    <div className="w-full lg:w-[400px] border-r border-[0.68px] border-primary/50 flex flex-col bg-background h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-[0.68px] border-primary/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conservations...."
            className="pl-9 bg-transparent border-[0.68px] border-primary/50 h-10 text-sm font-inter placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No conversations found"
            description="Try searching for a different user or check back later."
            className="h-full"
          />
        ) : (
          conversations.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              selectedId={selectedId}
              onSelect={onSelect}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
