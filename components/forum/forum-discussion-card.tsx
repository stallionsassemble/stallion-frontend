"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Eye, MessageCircle, Pin, ThumbsUp, User } from "lucide-react";
import Image from "next/image";
import { MouseEvent } from "react";

interface DiscussionCardProps {
  id: string | number;
  title: string;
  description: string;
  author: string;
  timeAgo: string;
  replies: number;
  views: number;
  likes: number;
  category: string;
  isPinned?: boolean;
  onPin?: (id: string | number) => void;
}

export function ForumDiscussionCard({
  id,
  title,
  description,
  author,
  timeAgo,
  replies,
  views,
  likes,
  category,
  isPinned,
  onPin
}: DiscussionCardProps) {

  const handlePin = (e: MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    onPin?.(id);
  };

  return (
    <div className="group relative border-b border-[0.68px] border-primary/50 bg-card p-4 md:p-5 transition-all hover:border-primary/50 hover:bg-primary/10">

      {/* Pin Action - Absolute positioned for easy access */}
      {onPin && (
        <button
          onClick={handlePin}
          className={cn(
            "absolute top-5 right-5 p-2 rounded-full transition-colors hover:bg-primary/20",
            isPinned ? "text-primary bg-primary/10" : "text-muted-foreground/30 hover:text-primary"
          )}
          title={isPinned ? "Unpin thread" : "Pin thread"}
        >
          <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
        </button>
      )}

      <div className="flex gap-3 md:gap-4 pr-8">
        {/* Avatar Placeholder/User Icon */}
        <div className="h-[50px] w-[50px] md:h-[91px] md:w-[91px] shrink-0 overflow-hidden rounded-[8000.41px] bg-primary/20 flex items-center justify-center mt-2 md:mt-6.5">
          <Image
            src={`https://avatar.vercel.sh/${author}`}
            width={91}
            height={91}
            alt={author}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 font-inter">
            {isPinned && (
              <Badge variant="outline" className="text-foreground border-primary text-[10px] h-5 px-2 font-medium">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            <Badge variant="secondary" className="bg-primary/40 text-foreground border-border border-[0.54px] text-[10px] h-5 px-2 font-medium">
              {category}
            </Badge>
          </div>

          {/* Title & Description */}
          <div className="space-y-1 font-inter">
            <h3 className="text-lg md:text-[24px] -tracking-[4%] font-bold text-foreground/90 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm font-light text-foreground/50 line-clamp-2 text-clip text-balance leading-relaxed">
              {description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground font-inter font-light text-[10px]">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-primary" />
              <span className="text-foreground font-medium">@{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-primary" />
              <span>{replies} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-primary" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3 text-primary" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
