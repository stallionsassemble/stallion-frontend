"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGetTags, useSearchThreads } from "@/lib/api/forum/queries";
import { useAuth } from "@/lib/store/use-auth";
import { Loader2, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ForumSidebarProps {
  categoryId?: string;
  currentThreadId?: string;
  author?: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
    role?: string;
    postCount: number | 0;
    reactionCount: number | 0;
    replyCount: number | 0;
  };
}

export function ForumSidebar({ categoryId, currentThreadId, author }: ForumSidebarProps) {
  const { user: currentUser } = useAuth();
  const { data: tags = [] } = useGetTags();

  // Use passed author if available (for thread view), otherwise fallback to current user (for list view)
  const displayUser = author || currentUser;

  // Fetch related threads if categoryId is provided, otherwise fetch recent threads (empty search)
  const { data: relatedThreadsResponse, isLoading: isRelatedLoading } = useSearchThreads("", categoryId);

  // Handle different response structures if searchThreads returns { data: [], meta: ... } or just []
  // Assuming standard PagedResponse or array. Based on queries.ts it's likely just array or object with data.
  // We'll treat it safely.
  const rawRelatedThreads = Array.isArray(relatedThreadsResponse)
    ? relatedThreadsResponse
    : (relatedThreadsResponse as any)?.data || [];

  const relatedThreads = rawRelatedThreads.filter((t: any) => t.id !== currentThreadId);

  return (
    <div className="space-y-6 w-full lg:w-[471px] shrink-0 font-inter">
      {/* User Card */}
      {displayUser && (
        <Card className="bg-card border-primary/50 py-[12.85px] border-[0.68px] px-[19.77px] rounded-[10px] w-full h-[177.81px] flex flex-col justify-between shadow-sm">
          <div className="flex flex-col items-start space-y-2">
            <div className="h-[52px] w-[52px] rounded-full overflow-hidden border-2 border-primary/20 bg-primary/20">
              <Image
                src={displayUser.profilePicture || `https://avatar.vercel.sh/${displayUser.username || 'user'}`}
                width={52}
                height={52}
                alt={displayUser.username || "User"}
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[16px] font-bold text-foreground leading-tight">
                {displayUser.firstName} {displayUser.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">@{displayUser.username}</span>
                {/* Only show Admin badge if we have role info (usually only available for current user or if added to author type) */}
                {(displayUser as any).role === 'OWNER' && (
                  <Badge variant="outline" className="text-[6px] h-4 px-2 bg-orange-700/30 text-foreground border-none flex items-center gap-1 rounded-full capitalize">
                    <Users className="h-2.5 w-2.5" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 -mt-[15px]">
            <div className="bg-primary/20 p-[10px] rounded-[10px] text-center space-y-0.5 w-full h-[50px]">
              <p className="text-[16px] font-extrabold text-foreground font-inter">{author?.postCount || 0}</p>
              <p className="text-[8px] text-muted-foreground font-light tracking-tight">Posts</p>
            </div>
            <div className="bg-primary/20 p-[10px] rounded-[10px] text-center w-full h-[50px]">
              <p className="text-[16px] font-extrabold text-foreground font-inter">{author?.replyCount || 0}</p>
              <p className="text-[8px] text-muted-foreground font-light tracking-tight -mt-1">Replies</p>
            </div>
            <div className="bg-primary/20 p-[10px] rounded-[10px] text-center space-y-0.5 w-full h-[50px]">
              <p className="text-[16px] font-extrabold text-foreground font-inter">{author?.reactionCount || 0}</p>
              <p className="text-[8px] text-muted-foreground font-light tracking-tight -mt-1">Likes</p>
            </div>
          </div>
        </Card>
      )}

      {/* Related Discussions */}
      <Card className="bg-card border-primary/50 border-[0.68px] py-[12.85px] px-[10px] rounded-[12px] space-y-0">
        <h4 className="text-[16px] font-medium text-foreground font-inter leading-none">
          {categoryId ? "Related Discussions" : "Recent Discussions"}
        </h4>
        <div className="space-y-[3px] -mt-2">
          {isRelatedLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
            </div>
          ) : relatedThreads.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">
              No discussions found.
            </div>
          ) : (
            relatedThreads.slice(0, 5).map((discussion: any) => (
              <Link key={discussion.id} href={`/dashboard/forums/${discussion.slug || discussion.id}`} className="block group">
                <div className="bg-transparent border-primary/25 border p-3 group-hover:bg-primary/5 transition-all rounded-[12px] space-y-1.5 w-full">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[6px] h-3 px-2 font-medium">
                    {discussion.category?.name || "General"}
                  </Badge>
                  <h5 className="text-[14px] font-medium font-inter text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                    {discussion.title}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] font-inter text-muted-foreground font-light">
                    <MessageSquare className="h-2 w-2 text-primary" />
                    <span className="text-muted-foreground">{discussion.postCount || discussion.replyCount || 0} replies</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Popular Tags */}
      <Card className="bg-card border-primary/50 border-[0.68px] py-[12.85px] px-[10px] rounded-[10px]">
        <h4 className="text-[16px] font-medium text-foreground font-inter">Popular Tags</h4>
        <div className="flex flex-wrap gap-[4px] -mt-3">
          {tags.length > 0 ? tags.slice(0, 10).map((tag: any, idx: number) => (
            <Link key={idx} href={`/dashboard/forums?tag=${tag.slug || tag.name}`}>
              <Badge variant="secondary" className="bg-primary/20 border-none text-foreground font-inter text-[10px] h-6 px-4 font-medium rounded-full cursor-pointer hover:bg-primary/30 transition-colors">
                {tag.name}
              </Badge>
            </Link>
          )) : (
            <span className="text-xs text-muted-foreground px-2">No tags available</span>
          )}
        </div>
      </Card>
    </div>
  );
}
