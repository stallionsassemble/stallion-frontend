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
      className="flex items-center justify-between bg-background relative overflow-hidden"
      style={{
        borderRadius: "14.33px",
        padding: "28.66px",
        border: "1.19px solid #404040",
        boxShadow: "0px 1.19px 3.58px 0px #0000001A",
        minHeight: "127.49px",
      }}
    >
      <div className="space-y-1 z-10 font-inter">
        <p className="text-[16px] text-muted-foreground font-normal">{label}</p>
        <p className="text-3xl font-extrabold text-[#FAFAFA]">{value}</p>
      </div>
      <div className="rounded-full bg-[#09090B] p-3 text-white z-10"
        style={{ boxShadow: "0px 4.82px 4.82px 0px #00000040" }}>
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
