"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAddOrRemoveReaction, useDeletePost, useGetPostComments, useUpdatePost } from "@/lib/api/forum/queries";
import { Post } from "@/lib/types/forum";
import { formatDistanceToNow } from "date-fns";
import { Edit, Heart, Loader2, MessageCircle, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ForumCommentSection } from "./forum-comment-section";

interface ForumPostProps {
  post: Post; // Ensure we use the API type which should include reactions/comments count ideally
  currentUserId?: string;
}

export function ForumPost({ post, currentUserId }: ForumPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: toggleReaction, isPending: isReacting } = useAddOrRemoveReaction();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  const handleUpdatePost = () => {
    updatePost({ id: post.id, content: editContent }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleDeletePost = () => {
    deletePost(post.id);
  };

  // We need to fetch comments for this post if expanded
  const { data: comments = [], isLoading: isLoadingComments } = useGetPostComments(post.id);

  const handleReaction = () => {
    toggleReaction({ postId: post.id, emoji: 'heart' }); // Default to heart for now
  };

  // Simplified reaction check for UI (assuming data structure supports it)
  // const isLiked = post.reactions?.some(r => r.users.some(u => u.id === currentUserId));
  // For now simple toggle state if we don't have full auth/reaction data sync perfectly yet
  const [localLiked, setLocalLiked] = useState(false);

  return (
    <div className="w-full border border-primary/40 bg-card rounded-[12px] p-5 space-y-4 transition-all hover:border-primary/60">
      <div className="flex gap-3 md:gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20 mt-1">
          <Image
            src={post.author.profilePicture || `https://avatar.vercel.sh/${post.author.username}`}
            width={40}
            height={40}
            alt={post.author.username}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between font-inter">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-foreground">{post.author.username}</span>
              {/* Admin Badge */}
              {post.isAdmin && <Badge variant="default" className="ml-2 h-5 text-[10px] px-1.5">Admin</Badge>}
              <span className="text-[12px] text-muted-foreground font-light">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Post Actions (Edit/Delete) - Only if current user is owner */}
            {currentUserId === post.authorId && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setEditContent(post.content);
                    setIsEditing(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeletePost} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-muted/50"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdatePost} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[14px] text-muted-foreground leading-relaxed font-inter font-light">
                {isExpanded || post.content.length <= 180 ? post.content : `${post.content.substring(0, 180)}...`}
              </p>
              {!isExpanded && post.content.length > 180 && (
                <Button variant="link" onClick={() => setIsExpanded(true)} className="p-0 h-auto font-normal text-xs text-primary">
                  Read more
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-14">
        <Button
          variant="ghost"
          onClick={() => {
            setLocalLiked(!localLiked);
            handleReaction();
          }}
          disabled={isReacting}
          className={`hover:bg-transparent! gap-2 h-8 px-0 transition-colors ${localLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${localLiked ? "fill-current" : ""}`} />
          <span className="text-xs font-semibold">{post.reactions?.reduce((acc, r) => acc + r.count, 0) || 0}</span>
        </Button>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-transparent! hover:text-foreground gap-2 h-8 px-0"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-semibold">{comments.length} Comments</span>
        </Button>

        <Button variant="ghost" className="text-muted-foreground hover:bg-transparent! hover:text-foreground gap-2 h-8 px-0">
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-semibold">Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pl-14">
          {isLoadingComments ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ForumCommentSection
              postId={post.id}
              comments={comments}
              currentUserId={currentUserId}
            />
          )}
        </div>
      )}
    </div>
  );
}
