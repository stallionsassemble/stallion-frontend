'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message, MessageAttachment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CornerUpLeft, FileIcon, MoreVertical, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  id: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  isFirstInGroup?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachments?: MessageAttachment[] | null;
  replyToMessage?: Message | null;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (id: string, content: string, senderName?: string) => void;
}

export function MessageBubble({
  id,
  content,
  timestamp,
  isSent,
  isFirstInGroup = true,
  isEdited,
  isDeleted,
  attachments,
  replyToMessage,
  onEdit,
  onDelete,
  onReply,
}: MessageBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-end gap-2 max-w-[80%] md:max-w-[60%]',
        isSent ? 'flex-row-reverse ml-auto' : 'flex-row'
      )}
    >
      {/* Message Bubble */}
      <div
        className={cn(
          'flex flex-col items-start px-4 py-3 text-sm font-inter leading-relaxed shadow-sm min-w-[120px] relative transition-all',
          isSent
            ? 'bg-primary/76 text-foreground rounded-[12px] rounded-br-none'
            : 'bg-primary/20 text-foreground rounded-[12px] rounded-bl-none',
          !isFirstInGroup && (isSent ? 'rounded-tr-md' : 'rounded-tl-md'),
          isDeleted && 'opacity-60'
        )}
      >
        {/* Reply Context */}
        {replyToMessage && !isDeleted && (
          <div className="mb-2 pl-2 border-l-2 border-primary/50 text-xs text-muted-foreground bg-background/20 rounded-r p-1 w-full opacity-80">
            <span className="font-bold block mb-0.5">
              {replyToMessage.sender?.firstName || replyToMessage.sender?.username || 'User'}
            </span>
            <span className="line-clamp-1 truncate block">
              {replyToMessage.content || (replyToMessage.attachments?.length ? 'Attachment' : 'Message')}
            </span>
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mb-2 flex flex-col gap-2 w-full">
            {attachments.map((attachment, index) => (
              <div key={index} className="rounded-md overflow-hidden bg-background/50">
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name || 'Attachment'}
                    className="max-w-full h-auto object-cover rounded-md"
                    loading="lazy"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-black/5 rounded"
                  >
                    <FileIcon className="h-4 w-4" />
                    <span className="truncate max-w-[200px] underline">
                      {attachment.name || 'View File'}
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <span className={cn(isDeleted && 'italic text-muted-foreground')}>
          {content.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
            if (part.match(/https?:\/\/[^\s]+/)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </span>
        <div className="flex items-center gap-1 mt-1 self-start">
          <span className="text-[10px] text-muted-foreground/80">
            {timestamp}
          </span>
          {isEdited && (
            <span className="text-[10px] text-muted-foreground/60 italic">
              (edited)
            </span>
          )}
        </div>
      </div>

      {/* Actions Dropdown */}
      {(onReply || (isSent && (onEdit || onDelete))) && !isDeleted && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full focus:opacity-100 outline-none',
                isOpen && 'opacity-100'
              )}
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isSent ? 'end' : 'start'}>
            {onReply && (
              <DropdownMenuItem onClick={() => onReply(id, content)}>
                <CornerUpLeft className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
            )}
            {isSent && onEdit && (
              <DropdownMenuItem onClick={() => onEdit(id, content)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {isSent && onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
