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
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/lib/api/forum/queries";
import { useAuth } from "@/lib/store/use-auth";
import { Comment } from "@/lib/types/forum";
import { formatDistanceToNow } from "date-fns";
import { Edit, Loader2, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth?: number;
  currentUserId?: string; // To check if user can delete
}

function CommentItem({ comment, postId, depth = 0, currentUserId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

  // Basic permission check (replace with robust auth check)
  const isOwner = currentUserId === comment.author.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    deleteComment(comment.id);
  };

  const handleUpdate = () => {
    updateComment({ id: comment.id, content: editContent }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <div className={`flex gap-3 pt-4 ${depth > 0 ? "ml-8 md:ml-12 border-l pl-4 border-muted" : ""}`}>
      <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-muted">
        <Image
          src={comment.author.profilePicture || `https://avatar.vercel.sh/${comment.author.username}`}
          width={32}
          height={32}
          alt={comment.author.username}
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{comment.author.username}</span>
            {comment.isAdmin && <Badge variant="default" className="ml-2 h-5 text-[10px] px-1.5">Admin</Badge>}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-muted/50 min-h-[60px]"
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
          <div className="space-y-1">
            <p className="text-sm text-foreground/90 leading-relaxed font-inter">
              {isExpanded || comment.content.length <= 180 ? comment.content : `${comment.content.substring(0, 180)}...`}
            </p>
            {!isExpanded && comment.content.length > 180 && (
              <Button variant="link" onClick={() => setIsExpanded(true)} className="p-0 h-auto font-normal text-xs text-primary">
                Read more
              </Button>
            )}
          </div>
        )}

        {/* Nested Replies (If any) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pt-2">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ForumCommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
}

export function ForumCommentSection({ postId, comments, currentUserId }: ForumCommentSectionProps) {
  const [content, setContent] = useState("");
  const { user: currentUser } = useAuth();
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSubmit = () => {
    if (!content.trim()) return;
    createComment(
      { postId, content },
      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border/50">

      {/* Comment Input */}
      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-muted overflow-hidden">
          <Image
            src={currentUser?.profilePicture || `https://avatar.vercel.sh/${currentUser?.username || 'guest'}`}
            width={32}
            height={32}
            alt="Current user"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 gap-2 flex flex-col">
          <Textarea
            placeholder="Write a comment..."
            className="min-h-[60px] resize-none bg-muted/30 focus-visible:ring-1 text-sm p-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!content.trim() || isPending}
              onClick={handleSubmit}
            >
              {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <MessageCircle className="w-3 h-3 mr-2" />}
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
