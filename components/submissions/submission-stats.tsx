"use client";

import { CheckCircle2, DollarSign, FileText } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#09090B] p-6">
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="rounded-full bg-white/5 p-3 text-white">
        {icon}
      </div>
    </div>
  );
}

export function SubmissionStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Earned"
        value="$3,700"
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Total Submission"
        value="50"
        icon={<FileText className="h-6 w-6" />}
      />
      <StatCard
        label="Pending Pay"
        value="$4,300"
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        label="Completed"
        value="20"
        icon={<CheckCircle2 className="h-6 w-6" />}
      />
    </div>
  );
}
