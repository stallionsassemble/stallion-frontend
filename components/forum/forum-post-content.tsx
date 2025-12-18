"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Heart, MessageCircle, Share2, ThumbsUp, UserCog } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ForumPostContentProps {
  title: string;
  category: string;
  author: string;
  timeAgo: string;
  views: number;
  likes: number;
  replies: number;
  content: React.ReactNode;
}

export function ForumPostContent({
  title,
  category,
  author,
  timeAgo,
  views,
  likes,
  replies,
  content,
}: ForumPostContentProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-amber-900 border-[1.19px] text-foreground font-inter text-[10px]">
            <UserCog className="h-3 w-3" />
            Admin
          </Badge>
          <Badge variant="secondary" className="bg-primary/40 border-[1.19px] text-foreground font-inter text-[10px]">
            {category}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-[32px] font-bold text-foreground leading-tight -tracking-[4%] font-inter">
          {title}
        </h1>

        <div className="flex items-center gap-3 mt-2">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20">
            <Image src={`https://avatar.vercel.sh/${author}`} width={40} height={40} alt={author} />
          </div>

          {/* User Info & Stats Column */}
          <div className="flex flex-col gap-0.5">
            {/* Row 1: Username & Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-foreground font-bold font-inter">@{author}</span>
              <Badge className="h-5 px-2 bg-amber-900 border-none text-foreground hover:bg-[#5A3318]/40 gap-1 rounded-full">
                <UserCog className="h-3 w-3" />
                <span className="text-[10px] font-medium font-inter">Admin</span>
              </Badge>
            </div>

            {/* Row 2: Stats */}
            <div className="flex items-center flex-wrap gap-y-2 gap-x-4 text-xs text-muted-foreground font-light text-[10px] font-inter">
              <div className="flex items-center gap-1.5">
                <Clock className="h-[10px] w-[10px] text-primary" />
                <span className="text-muted">{timeAgo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-[10px] w-[10px] text-primary" />
                <span className="text-muted">{views}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-[10px] w-[10px] text-primary" />
                <span className="text-muted">{likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-[10px] w-[10px] text-primary" />
                <span className="text-muted">{replies} replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content & Actions Container */}
      <div className="border-[0.68px] border-primary/50 rounded-[10px] overflow-hidden bg-card/30">
        <div className="prose prose-invert max-w-none p-4 md:p-8 font-inter text-muted-foreground font-light text-[14px] leading-relaxed">
          {content}
        </div>

        {/* Top Divider (Not Full Width) */}
        <div className="px-4 md:px-8">
          <div className="h-[0.68px] bg-primary/50 w-full" />
        </div>

        {/* Actions */}
        <div className="flex items-center py-3 px-4 md:px-8">
          <Button
            variant="ghost"
            onClick={() => setIsLiked(!isLiked)}
            className={`hover:bg-transparent! gap-1 h-9 px-3 transition-colors ${isLiked ? "text-red-500 hover:text-red-500" : "text-muted-foreground hover:text-muted-foreground"}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes + (isLiked ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:bg-transparent! hover:text-muted-foreground gap-1 h-9 px-3">
            <MessageCircle className="h-4 w-4" />
            <span>{replies}</span>
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:bg-transparent! hover:text-muted-foreground gap-1 h-9 px-3">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
