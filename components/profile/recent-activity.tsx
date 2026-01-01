"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useMyHistory, useUserHistory } from "@/lib/api/reputation/queries";
import { ReputationHistoryEntry } from "@/lib/types/reputation";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";

export function RecentActivity({ userId }: { userId?: string }) {
  const { data: myHistory } = useMyHistory();
  const { data: userHistory } = useUserHistory(userId || "");

  const rawHistory = userId ? userHistory : myHistory;

  let history: ReputationHistoryEntry[] = [];

  if (Array.isArray(rawHistory)) {
    history = rawHistory;
  } else if (rawHistory && Array.isArray((rawHistory as any).data)) {
    history = (rawHistory as any).data;
  } else if (rawHistory && Array.isArray((rawHistory as any).history)) {
    history = (rawHistory as any).history;
  }

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 mb-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Recent Activity</h3>

      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Recent Activity"
          description="Your reputation history will appear here once you start contributing."
          className="min-h-[200px] border-0"
        />
      ) : (
        <div>
          {history.map((item) => (
            <div key={item.id} className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3 last:border-0 last:mb-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal font-inter text-muted-foreground/80">
                  <span className="capitalize">{item.category}</span>
                  <span className="text-foreground font-normal ml-1"> - {item.reason}</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-inter text-foreground text-base">
                  {item.change > 0 ? "+" : ""}{item.change}
                </span>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] px-2 py-0.5 h-auto rounded-full font-bold border-0">
                  PTS
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
