"use client";

import { BadgeCheck, DollarSign, FilePen } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className="flex items-center justify-between bg-card text-card-foreground relative overflow-hidden rounded-xl p-7 border border-border shadow-sm min-h-[128px]"
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
  return (
    <div className="grid grid-cols-1 gap-[28.66px] sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Earned"
        value="$3,700"
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Total Submission"
        value="50"
        icon={<FilePen className="h-6 w-6" />}
      />
      <StatCard
        label="Pending Pay"
        value="$4,300"
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Completed"
        value="20"
        icon={<BadgeCheck className="h-6 w-6" />}
      />
    </div>
  );
}
