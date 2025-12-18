"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Users, UserStar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ReplyProps {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
  isAdmin?: boolean;
  isVerified?: boolean;
  replies_list?: ReplyProps[];
}


function ReplyItem({ item, isRoot = true }: { item: ReplyProps; isRoot?: boolean }) {
  const [isLiked, setIsLiked] = useState(false);

  // The actual reply content block
  const contentNode = (
    <div className="space-y-3">
      <div className="flex gap-3 md:gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20 mt-1">
          <Image src={`https://avatar.vercel.sh/${item.author}`} width={40} height={40} alt={item.author} />
        </div>
        <div className="flex-1 space-y-2">
          {/* ... keeping content unchanged ... */}
          <div className="flex items-center gap-2 font-inter">
            <span className="text-[16px] font-bold text-foreground">{item.author}</span>
            <span className="text-[12px] text-muted-foreground font-light">{item.timeAgo}</span>
            {item.isAdmin && (
              <Badge variant="outline" className="text-[10px] h-5 px-2 bg-orange-700/30 text-foreground border-none flex items-center gap-1 rounded-full capitalize">
                <Users className="h-2.5 w-2.5" />
                Admin
              </Badge>
            )}
            {item.isVerified && (
              <Badge variant="outline" className="text-[10px] h-5 px-2 bg-[#FFDC00] text-black border-none flex items-center gap-1 rounded-full capitalize">
                <UserStar className="h-2.5 w-2.5" />
                Verified Builder
              </Badge>
            )}
          </div>

          <p className="text-[14px] text-muted-foreground leading-relaxed font-inter font-light">
            {item.content}
          </p>
        </div>
      </div>

      {/* Actions (Aligned with Avatar) */}
      <div className="flex items-center gap-0 left-[14px]">
        {/* ... keeping actions unchanged ... */}
        <Button
          variant="ghost"
          onClick={() => setIsLiked(!isLiked)}
          className={`hover:bg-transparent! gap-2 h-9 px-0 transition-colors ${isLiked ? "text-red-500 hover:text-red-500" : "text-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-5 w-5 transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-red-500"}`} />
          <span className="text-[14px] font-semibold">{item.likes + (isLiked ? 1 : 0)}</span>
        </Button>
        <Button variant="ghost" className="text-foreground hover:bg-transparent! hover:text-foreground gap-2 h-9 px-0">
          <MessageCircle className="h-5 w-5" />
          <span className="text-[14px] font-semibold">{item.replies}</span>
        </Button>
        <Button variant="ghost" className="text-foreground hover:bg-transparent! hover:text-foreground gap-2 h-9 px-0">
          <Share2 className="h-5 w-5" />
          <span className="text-[14px] font-semibold">Share</span>
        </Button>
      </div>
    </div>
  );

  if (isRoot) {
    return (
      <div className="w-full max-w-[862px] border border-primary/40 bg-card rounded-[12px] p-5 space-y-2 transition-all hover:border-primary/60">
        {contentNode}
        {item.replies_list && item.replies_list.length > 0 && (
          <div className="space-y-3 ml-4 md:ml-12">
            {item.replies_list.map((reply) => (
              <ReplyItem key={reply.id} item={reply} isRoot={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Nested replies render without their own outer card border
  return (
    <div className="space-y-6">
      {contentNode}
      {item.replies_list && item.replies_list.length > 0 && (
        <div className="space-y-6 ml-4 md:ml-12">
          {item.replies_list.map((reply) => (
            <ReplyItem key={reply.id} item={reply} isRoot={false} />
          ))}
        </div>
      )}
    </div>
  );
}

// Separate Badge component if needed, or use the UI one

export function ForumReplies() {
  const mockReplies: ReplyProps[] = [
    // ... items ...
    {
      id: "1",
      author: "Alex Rivera",
      timeAgo: "1h ago",
      content: "I've been working with Soroban for a few months now and wanted to share some security practices I've learned. I've been working with Soroban for a few months now and wanted to share some security practices I've learned. i've been working with Soroban for a few months now and wanted to share some security practices I've learned.........",
      likes: 42,
      replies: 20,
      isAdmin: true,
    },
    {
      id: "2",
      author: "Alex Rivera",
      timeAgo: "2h ago",
      content: "I've been working with Soroban for a few months now and wanted to share some security practices I've learned. I've been working with Soroban for a few months now and wanted to share some security practices I've learned. i've been working with Soroban for a few months now and wanted to share some security practices I've learned.........",
      likes: 42,
      replies: 20,
      isAdmin: true,
      replies_list: [
        {
          id: "2-1",
          author: "Alex Rivera",
          timeAgo: "1h ago",
          content: "I've been working with Soroban for a few months now and wanted to share some security practices I've learned. I've been working with Soroban for a few months now and wanted to share some security practices I've learned. i've been working with Soroban for a few months now and wanted to share some security practices I've learned.........",
          likes: 42,
          replies: 20,
          isVerified: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pt-8">
      <h3 className="text-xl font-bold text-foreground">Replies (20)</h3>

      {/* Input Box */}
      <div className="flex gap-3 md:gap-4 bg-card rounded-[12px]">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20">
          <Image src="https://avatar.vercel.sh/user" width={40} height={40} alt="Current User" />
        </div>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Join the discussion"
            className="min-h-[120px] bg-card border-[1.19px] border-foreground focus-visible:ring-0 resize-none p-2 text-sm placeholder:text-muted-foreground"
          />
          <div className="flex justify-start">
            <Button variant="stallion" size="sm" className="h-[42px] w-[63px] px-6 rounded-lg font-medium font-inter">
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Replies List */}
      <div className="space-y-6">
        {mockReplies.map(reply => (
          <ReplyItem key={reply.id} item={reply} />
        ))}
      </div>
    </div>
  );
}
