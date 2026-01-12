"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useGetMyActivities } from "@/lib/api/activities/queries";
import { ActivityPayload } from "@/lib/types/activities";
import { formatDistanceToNow } from "date-fns";
import { Clock, History } from "lucide-react";

interface OwnerRecentActivityProps {
  userId?: string;
  publicMode?: boolean;
}

export function OwnerRecentActivity({ userId, publicMode = false }: OwnerRecentActivityProps) {
  const { data: myActivities } = useGetMyActivities();
  const activities = myActivities?.data || [];

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 mb-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-inter">Recent Activity</h3>
        <div className="text-xs text-muted-foreground border border-white/10 rounded px-2 py-1">
          Newest
        </div>
      </div>

      {(!activities || activities.length === 0) ? (
        <EmptyState
          icon={History}
          title="No Recent Activity"
          description={publicMode ? "This project owner hasn't posted any bounties yet." : "Your recent bounty activity will appear here."}
          className="min-h-[200px] border-0"
        />
      ) : (
        <div>
          {activities.map((activity: ActivityPayload) => {
            const reward = activity.metadata && 'reward' in activity.metadata ? activity.metadata.reward : null;
            const currency = activity.metadata && 'currency' in activity.metadata ? activity.metadata.currency : 'USDC';

            return (
              <div key={activity.id} className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3 last:border-0 last:mb-0 transition-colors">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground font-medium text-sm">
                        {activity.message}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground/60">
                        <Clock className="w-3 h-3" />
                        {activity.createdAt && formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </div>
                    </div>

                    {reward && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold font-inter text-foreground text-base">
                          {/* Ensure reward is rendered safely if it's a string or number */}
                          {typeof reward === 'number' ? `$${reward.toLocaleString()}` : `$${reward}`}
                        </span>
                        <Badge className="bg-[#0066FF] text-white hover:bg-[#0066FF]/90 text-[10px] px-2 py-0.5 h-auto rounded-sm font-bold border-0">
                          {currency}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
