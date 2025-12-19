"use client";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  isFirstInGroup?: boolean;
}

export function MessageBubble({ content, timestamp, isSent, isFirstInGroup = true }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] md:max-w-[60%]",
        isSent ? "items-end ml-auto" : "items-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start px-4 py-3 text-sm font-inter leading-relaxed shadow-sm min-w-[120px]",
          isSent
            ? "bg-primary/76 text-foreground rounded-[12px] rounded-br-none"
            : "bg-primary/20 text-foreground rounded-[12px] rounded-bl-none",
          !isFirstInGroup && (isSent ? "rounded-tr-md" : "rounded-tl-md")
        )}
      >
        <span>{content}</span>
        <span className="text-[10px] text-muted-foreground/80 mt-1 self-start">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
