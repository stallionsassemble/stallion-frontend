"use client";

import { useTalentStatsQuery } from "@/lib/api/dashboard/queries";
import { BadgeCheck, DollarSign, FilePen } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className="flex items-center justify-between bg-card text-card-foreground relative overflow-hidden rounded-xl p-6 border border-border shadow-sm min-h-[100px]"
    >
      <div className="space-y-1 z-10 font-inter">
        <p className="text-sm text-muted-foreground font-normal">{label}</p>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
      </div>
      <div className="rounded-full bg-primary/10 p-2.5 text-primary z-10">
        {icon}
      </div>
    </div>
  );
}

interface SubmissionStatsProps {
  totalSubmissions?: number;
}

export function SubmissionStats({ totalSubmissions }: SubmissionStatsProps) {
  const { data: talentStats } = useTalentStatsQuery()

  return (
    <div className="grid grid-cols-1 gap-[28.66px] sm:grid-cols-3">
      <StatCard
        label="Total Earned"
        value={`$${talentStats?.totalEarnings?.toLocaleString() || "0"}`}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Total Submission"
        value={totalSubmissions?.toString() || "0"}
        icon={<FilePen className="h-6 w-6" />}
      />
      <StatCard
        label="Completed"
        value={((talentStats?.completedBounties ?? 0) + (talentStats?.completedProjects ?? 0)).toString()}
        icon={<BadgeCheck className="h-6 w-6" />}
      />
    </div>
  );
}
