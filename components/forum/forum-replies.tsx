"use client";

import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/lib/api/forum/queries";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MarkdownEditor } from "../shared/markdown-editor";
import { ForumPost } from "./forum-post";

interface ForumRepliesProps {
  posts: any[];
  threadId: string;
  currentUser?: {
    id?: string
    profilePicture?: string | null
  };
}

export function ForumReplies({ posts, threadId, currentUser }: ForumRepliesProps) {
  const [content, setContent] = useState("");
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = () => {
    if (!content.trim()) return;
    createPost(
      { threadId, content },
      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  };

  return (
    <div className="space-y-6 pt-8">
      <h3 className="text-xl font-bold text-foreground">Replies ({posts.length})</h3>

      {/* Input Box */}
      <div className="flex gap-3 md:gap-4 bg-card rounded-[12px]">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/20">
          <Image src={currentUser?.profilePicture || 'https://avatar.vercel.sh/user'} width={40} height={40} alt="User" />
        </div>
        <div className="flex-1 space-y-3">
          <MarkdownEditor
            placeholder="Join the discussion"
            className="w-full"
            value={content}
            onChange={(val) => setContent(val)}
            minHeight="min-h-[120px]"
          />
          <div className="flex justify-start">
            <Button
              variant="stallion"
              size="sm"
              className="h-[42px] w-[63px] px-6 rounded-lg font-medium font-inter"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* Replies List (Now Posts) */}
      <div className="space-y-6">
        {posts.map(post => (
          <ForumPost
            key={post.id}
            post={post}
            currentUserId={currentUser?.id}
          />
        ))}
      </div>
    </div>
  );
}
