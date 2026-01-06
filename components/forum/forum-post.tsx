"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAddOrRemoveReaction, useDeletePost, useGetPostComments, useUpdatePost } from "@/lib/api/forum/queries";
import { Post } from "@/lib/types/forum";
import { formatDistanceToNow } from "date-fns";
import { Edit, Heart, Loader2, MessageCircle, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MarkdownEditor } from "../shared/markdown-editor";
import { MarkdownRenderer } from "../shared/markdown-renderer";
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

  // Determine if the user has already liked the post from server data
  // The API returns a flat list of reactions where each entry represents a user's reaction
  const isLiked = post.reactions?.some(r => r.userId === currentUserId);

  // Count is simply the length of the reactions array
  const likeCount = post.reactions?.length || 0;

  return (
    <div className="w-full border border-primary/40 bg-card rounded-[12px] p-5 space-y-4 transition-all hover:border-primary/60">
      <div className="flex gap-3 md:gap-4">
        {/* ... (Author Avatar Link) ... */}
        <Link href={`/dashboard/profile/${post.authorId}`} className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20 mt-1 hover:opacity-80 transition-opacity">
          <Image
            src={post.author.profilePicture || `https://avatar.vercel.sh/${post.author.username}`}
            width={40}
            height={40}
            alt={post.author.username}
          />
        </Link>
        <div className="flex-1 space-y-2">
          {/* ... (Header content) ... */}
          <div className="flex items-center justify-between font-inter">
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/profile/${post.authorId}`} className="text-[16px] font-bold text-foreground hover:underline decoration-primary">
                {post.author.username}
              </Link>
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
              <MarkdownEditor
                value={editContent}
                onChange={(val) => setEditContent(val)}
                className="w-full"
                minHeight="min-h-[100px]"
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
            <div className="space-y-1 font-inter text-sm text-[14px]">
              <div className={`overflow-hidden transition-all duration-300 ${!isExpanded && post.content.length > 300 ? 'max-h-[150px] mask-gradient-to-b' : ''}`}>
                <MarkdownRenderer content={post.content} />
              </div>
              {!isExpanded && post.content.length > 300 && (
                <Button variant="link" onClick={() => setIsExpanded(true)} className="p-0 h-auto font-normal text-xs text-primary">
                  Read more
                </Button>
              )}
              {isExpanded && post.content.length > 300 && (
                <Button variant="link" onClick={() => setIsExpanded(false)} className="p-0 h-auto font-normal text-xs text-primary">
                  Show less
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4 md:ml-14 mt-2 md:mt-0">
        <Button
          variant="ghost"
          onClick={handleReaction}
          disabled={isReacting}
          className={`hover:bg-transparent! gap-2 h-8 px-0 transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-xs font-semibold">
            {likeCount}
          </span>
        </Button>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-transparent! hover:text-foreground gap-2 h-8 px-0"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-semibold">{comments.length}</span>
        </Button>

        <Button variant="ghost" className="text-muted-foreground hover:bg-transparent! hover:text-foreground gap-2 h-8 px-0">
          <Share2 className="h-4 w-4" />
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
