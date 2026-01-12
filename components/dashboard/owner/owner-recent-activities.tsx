"use client";

import { useGetMyActivities } from "@/lib/api/activities/queries";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export function OwnerRecentActivities() {
  const { data: activitiesData, isLoading } = useGetMyActivities(1, 10);
  const activities = activitiesData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
        <div className="text-slate-500 text-sm">No recent activities found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recent Activities</h2>

      <div className="relative flex flex-col gap-8 pl-2">
        {/* Vertical linking line */}
        <div className="absolute left-[7px] top-4 bottom-4 w-px bg-white/10" />

        {activities.map((item) => (
          <div key={item.id} className="relative flex items-center gap-4 z-10 pl-6">
            {/* Timeline Dot */}
            <div className="absolute left-[2px] w-2.5 h-2.5 rounded-full bg-slate-600 ring-4 ring-background z-20" />


            {/* Content & Time */}
            <div className="flex flex-1 items-start justify-between min-w-0">
              <div className="text-[15px] leading-relaxed text-slate-300">
                <span className="text-slate-300">{item.message}</span>
                {/* 
                   Note: The backend 'message' is usually a complete sentence.
                   If we need rich bolding of User/Target, we'd need to parse the message 
                   or construct it from metadata. For now, displaying the message is safest.
                   If specific metadata is available (e.g. reward), we can append it.
                */}
                {item.metadata?.reward && (
                  <span className="block text-xs font-bold text-primary mt-1">
                    Reward: {item.metadata.reward} {item.metadata.currency}
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-500 whitespace-nowrap ml-4 pt-1">
                {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
