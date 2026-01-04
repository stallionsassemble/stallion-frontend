"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { useGetForumStats } from "@/lib/api/forum/queries";
import { MessageSquare, MessageSquareText, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ForumStats() {
  const { data: stats, isLoading } = useGetForumStats();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Discussions"
        value={isLoading ? <Skeleton className="h-8 w-24" /> : (stats?.totalDiscussions || 0).toLocaleString()}
        icon={MessageSquare}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Active Members"
        value={isLoading ? <Skeleton className="h-8 w-24" /> : (stats?.activeMembers || 0).toLocaleString()}
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Posts Today"
        value={isLoading ? <Skeleton className="h-8 w-24" /> : (stats?.postsToday || 0).toLocaleString()}
        icon={MessageSquareText}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Online Now"
        value={isLoading ? <Skeleton className="h-8 w-24" /> : (stats?.onlineUsers || 0).toLocaleString()}
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
    </div>
  );
}
