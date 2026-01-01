"use client";

import { ForumPostContent } from "@/components/forum/forum-post-content";
import { ForumReplies } from "@/components/forum/forum-replies";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteThread, useGetCategories, useGetThread } from "@/lib/api/forum/queries";
import { useAuth } from "@/lib/store/use-auth";
import { Edit, Loader2, MoreHorizontal, Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const ForumDetailPage = () => {
  const params = useParams();
  const slug = params?.id as string;
  const { data: thread, isLoading } = useGetThread(slug);
  const { data: categories = [] } = useGetCategories();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteThread, isPending: isDeleting } = useDeleteThread();
  const router = useRouter();

  const isOwner = user?.id === thread?.authorId;

  const handleDelete = () => {
    if (!thread) return;
    deleteThread(thread.id, {
      onSuccess: () => {
        router.push("/dashboard/forums");
      }
    });
  };

  const categoryName = categories.find(c => c.id === thread?.categoryId)?.name || "General";

  console.log("Thread Response:", thread);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Thread not found.
      </div>
    );
  }

  // Fallback: If thread.content is missing (API variance), use the first post as the OP.
  const mainContent = thread.content || thread.posts?.[0]?.content || "";

  // Filter replies:
  // 1. If we used the first post as mainContent (because thread.content was empty), exclude it from replies.
  // 2. Also exclude any post deeply identical to mainContent (deduplication safety).
  const filteredPosts = thread.posts?.filter((p, index) => {
    if (!thread.content && index === 0) return false;
    if (p.content === mainContent && p.author.username === thread.author.username) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Column */}
        <div className="flex-1 space-y-6 max-w-4xl">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard/forums">
              <Button variant="outline" className="h-8 px-4 border-border bg-card text-foreground gap-2 rounded-lg text-xs font-inter font-medium hover:bg-card/80">
                <Undo2 className="h-3.5 w-3.5" />
                Back to discussion
              </Button>
            </Link>

            {/* Header Actions - Only specific to author */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Thread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete Thread
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <ForumPostContent
            title={thread.title}
            category={categoryName}
            author={thread.author?.username}
            authorId={thread.authorId}
            threadId={thread.id}
            currentUserId={user?.id}
            isAdmin={thread.isAdmin}
            timeAgo={new Date(thread.createdAt).toLocaleDateString()}
            views={thread.viewCount}
            likes={thread.likeCount ?? 0}
            replies={filteredPosts.length}
            content={mainContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          <ForumReplies
            posts={filteredPosts}
            threadId={thread.id}
            currentUserId={user?.id}
          />
        </div>

        {/* Sidebar Column */}
        <ForumSidebar categoryId={thread?.categoryId} currentThreadId={thread?.id} />
      </div>
    </div>
  );
};

export default ForumDetailPage;