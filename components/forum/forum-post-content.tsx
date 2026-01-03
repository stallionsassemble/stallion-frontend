
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddOrRemoveThreadReaction, useUpdateThread } from "@/lib/api/forum/queries";
import { Clock, Eye, Heart, Loader2, MessageCircle, Share2, ThumbsUp, UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MarkdownEditor } from "../shared/markdown-editor";
import { MarkdownRenderer } from "../shared/markdown-renderer";

interface ForumPostContentProps {
  title: string;
  category: string;
  author: string;
  authorId?: string;
  threadId?: string;
  currentUserId?: string;
  timeAgo: string;
  views: number;
  likes: number;
  replies: number;
  content: string;
  isAdmin?: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function ForumPostContent({
  title,
  category,
  author,
  authorId,
  threadId,
  currentUserId,
  timeAgo,
  views,
  likes,
  replies,
  content,
  isAdmin,
  isEditing,
  setIsEditing,
}: ForumPostContentProps) {
  const [isLiked, setIsLiked] = useState(false);
  // const [isEditing, setIsEditing] = useState(false); // Managed by parent
  const [editContent, setEditContent] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateThread, isPending: isUpdating } = useUpdateThread();
  const { mutate: toggleThreadLike, isPending: isLiking } = useAddOrRemoveThreadReaction();

  const handleUpdate = () => {
    if (!threadId) return;
    updateThread({
      id: threadId,
      payload: { content: editContent }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleThreadLike = () => {
    if (!threadId) return;
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    toggleThreadLike({ threadId, emoji: 'heart' }, {
      onError: () => {
        // Revert on error
        setIsLiked(!newIsLiked);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            {isAdmin && (
              <Badge variant="secondary" className="bg-amber-900 border-[1.19px] text-foreground font-inter text-[10px]">
                <UserCog className="h-3 w-3" />
                Admin
              </Badge>
            )}
            <Badge variant="secondary" className="bg-primary/40 border-[1.19px] text-foreground font-inter text-[10px]">
              {category}
            </Badge>
          </div>

          {/* Internal Actions removed - moved to Page Header */}
        </div>

        <h1 className="text-2xl md:text-[32px] font-bold text-foreground leading-tight -tracking-[4%] font-inter">
          {title}
        </h1>

        <div className="flex items-center gap-3 mt-2">
          {/* Avatar */}
          <Link href={`/dashboard/profile/${authorId}`} className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20 hover:opacity-80 transition-opacity">
            <Image src={`https://avatar.vercel.sh/${author}`} width={40} height={40} alt={author} />
          </Link>

          {/* User Info & Stats Column */}
          <div className="flex flex-col gap-0.5">
            {/* Row 1: Username & Badge */}
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/profile/${authorId}`} className="text-[12px] text-foreground font-bold font-inter hover:underline decoration-primary">
                @{author}
              </Link>
              {isAdmin && (
                <Badge className="h-5 px-2 bg-amber-900 border-none text-foreground hover:bg-[#5A3318]/40 gap-1 rounded-full">
                  <UserCog className="h-3 w-3" />
                  <span className="text-[10px] font-medium font-inter">Admin</span>
                </Badge>
              )}
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

        {isEditing ? (
          <div className="p-4 md:p-8 space-y-4">
            <MarkdownEditor
              value={editContent}
              onChange={(val) => setEditContent(val)}
              className="w-full"
              minHeight="min-h-[200px]"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-8 font-inter text-muted-foreground font-light text-[14px] leading-relaxed">
            <div className={`overflow-hidden transition-all duration-300 ${!isExpanded && content.length > 500 ? 'max-h-[300px] mask-gradient-to-b' : ''}`}>
              <MarkdownRenderer content={content} />
            </div>
            {!isExpanded && content.length > 500 && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="link"
                  className="px-1 h-auto font-normal text-primary"
                  onClick={() => setIsExpanded(true)}
                >
                  Read more
                </Button>
              </div>
            )}
            {isExpanded && content.length > 500 && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="link"
                  className="px-0 h-auto font-normal text-primary"
                  onClick={() => setIsExpanded(false)}
                >
                  Show less
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Top Divider (Not Full Width) */}
        {!isEditing && (
          <>
            <div className="px-4 md:px-8">
              <div className="h-[0.68px] bg-primary/50 w-full" />
            </div>

            {/* Actions */}
            <div className="flex items-center py-3 px-4 md:px-8">
              <Button
                variant="ghost"
                onClick={handleThreadLike}
                disabled={isLiking}
                className={`gap-1 h-9 px-3 transition-colors ${isLiked ? "text-red-500 hover:text-red-600 hover:bg-transparent!" : "text-muted-foreground hover:bg-transparent! hover:text-foreground"}`}
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
          </>
        )}
      </div>
    </div>
  );
}
