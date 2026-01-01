"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/lib/api/forum/queries";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ForumPost } from "./forum-post";

interface ForumRepliesProps {
  posts: any[];
  threadId: string;
  currentUserId?: string;
}

export function ForumReplies({ posts, threadId, currentUserId }: ForumRepliesProps) {
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
          <Image src="https://avatar.vercel.sh/user" width={40} height={40} alt="Current User" />
        </div>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Join the discussion"
            className="min-h-[120px] bg-card border-[1.19px] border-foreground focus-visible:ring-0 resize-none p-2 text-sm placeholder:text-muted-foreground"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
