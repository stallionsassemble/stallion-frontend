"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { useGetForumStats } from "@/lib/api/forum/queries";
import { MessageSquare, MessageSquareText, Users } from "lucide-react";

export function ForumStats() {
  const { data: stats, isLoading } = useGetForumStats();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Discussions"
        value={isLoading ? "..." : (stats?.totalDiscussions || 0).toLocaleString()}
        icon={MessageSquare}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Active Members"
        value={isLoading ? "..." : (stats?.activeMembers || 0).toLocaleString()}
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Posts Today"
        value={isLoading ? "..." : (stats?.postsToday || 0).toLocaleString()}
        icon={MessageSquareText}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Online Now"
        value={isLoading ? "..." : (stats?.onlineUsers || 0).toLocaleString()}
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
    </div>
  );
}
