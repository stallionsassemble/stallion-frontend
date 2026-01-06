"use client";

import { BadgeCheck, DollarSign, FilePen } from "lucide-react";
import { useGetUser } from "@/lib/api/users/queries";
import { useAuth } from "@/lib/store/use-auth";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className="flex items-center justify-between bg-card text-card-foreground relative overflow-hidden rounded-xl p-10 border border-border shadow-sm min-h-[128px]"
    >
      <div className="space-y-1 z-10 font-inter">
        <p className="text-[16px] text-muted-foreground font-normal">{label}</p>
        <p className="text-3xl font-extrabold text-foreground">{value}</p>
      </div>
      <div className="rounded-full bg-primary p-3 text-primary-foreground z-10 shadow-md">
        {icon}
      </div>
    </div>
  );
}

export function SubmissionStats() {
  const { user } = useAuth()
  const { data: profileStats } = useGetUser(user?.id || '')
  return (
    <div className="grid grid-cols-1 gap-[28.66px] sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Earned"
        value={profileStats?.totalEarned?.toString() || "0"}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Total Submission"
        value={profileStats?.totalSubmissions?.toString() || "0"}
        icon={<FilePen className="h-6 w-6" />}
      />
      <StatCard
        label="Pending Pay"
        value={profileStats?.totalPendingPay?.toString() || "0"}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Completed"
        value={profileStats?.totalWon?.toString() || "0"}
        icon={<BadgeCheck className="h-6 w-6" />}
      />
    </div>
  );
}
