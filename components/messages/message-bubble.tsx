"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  id: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  isFirstInGroup?: boolean;
  isEdited?: boolean;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export function MessageBubble({
  id,
  content,
  timestamp,
  isSent,
  isFirstInGroup = true,
  isEdited,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-end gap-2 max-w-[80%] md:max-w-[60%]",
        isSent ? "flex-row-reverse ml-auto" : "flex-row"
      )}
    >
      {/* Message Bubble */}
      <div
        className={cn(
          "flex flex-col items-start px-4 py-3 text-sm font-inter leading-relaxed shadow-sm min-w-[120px] relative",
          isSent
            ? "bg-primary/76 text-foreground rounded-[12px] rounded-br-none"
            : "bg-primary/20 text-foreground rounded-[12px] rounded-bl-none",
          !isFirstInGroup && (isSent ? "rounded-tr-md" : "rounded-tl-md")
        )}
      >
        <span>{content}</span>
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

      {/* Actions Dropdown (Only for sent messages) */}
      {isSent && (onEdit || onDelete) && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full focus:opacity-100 outline-none",
                isOpen && "opacity-100"
              )}
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isSent ? "end" : "start"}>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(id, content)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
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
