"use client";

import { Flag } from "lucide-react";

export interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  amount: string;
  status: "completed" | "pending" | "locked";
}

interface PaymentMilestonesProps {
  milestones: Milestone[];
}

export function PaymentMilestones({ milestones }: PaymentMilestonesProps) {
  return (
    <section className="space-y-4 rounded-xl border-[0.69px] border-primary bg-transparent p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Flag className="h-4 w-4" color="#007AFF" /> Payment Milestones
      </h3>
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="flex items-center justify-between p-4 rounded-lg bg-[#0C62C024] "
          >
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full border-[1.79px] border-primary text-primary flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-inter font-medium text-white">{milestone.title}</p>
                <p className="text-[12px] font-medium text-[#A1A1AA]">Due: {milestone.dueDate}</p>
              </div>
            </div>
            <span className="text-lg font-bold font-space-grotesk text-white">{milestone.amount}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
