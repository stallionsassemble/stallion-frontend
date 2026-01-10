"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDistanceToNow } from "date-fns";
import { Clock, History } from "lucide-react";

interface OwnerRecentActivityProps {
  userId?: string;
  publicMode?: boolean;
}

const MOCK_ACTIVITIES = [
  {
    id: "1",
    title: "Smart Contract Audit for DeFi Protocol",
    status: "COMPLETED",
    rewardAmount: 3500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "Frontend Integration for DEX Aggregator",
    status: "COMPLETED",
    rewardAmount: 2800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
  },
  {
    id: "3",
    title: "Solana Program Optimization",
    status: "COMPLETED",
    rewardAmount: 4200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
  },
  {
    id: "4",
    title: "UI/UX Design for Lending Platform",
    status: "COMPLETED",
    rewardAmount: 1500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
  },
  {
    id: "5",
    title: "Rust Smart Contract Review",
    status: "COMPLETED",
    rewardAmount: 3500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  },
  {
    id: "6",
    title: "Full Stack Implementation of Yield Farm",
    status: "COMPLETED",
    rewardAmount: 3500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
  }
];

export function OwnerRecentActivity({ userId, publicMode = false }: OwnerRecentActivityProps) {
  // Use mock data directly
  const sortedBounties = MOCK_ACTIVITIES;

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 mb-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-inter">Recent Activity</h3>
        <div className="text-xs text-muted-foreground border border-white/10 rounded px-2 py-1">
          Newest
        </div>
      </div>

      {sortedBounties.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Recent Activity"
          description={publicMode ? "This project owner hasn't posted any bounties yet." : "Your recent bounty activity will appear here."}
          className="min-h-[200px] border-0"
        />
      ) : (
        <div>
          {sortedBounties.map((bounty: any) => (
            <div key={bounty.id} className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3 last:border-0 last:mb-0 transition-colors">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-medium text-sm">
                      {bounty.status === 'COMPLETED' ? 'Completed bounty' : 'Posted bounty'}
                      <span className="text-muted-foreground font-normal ml-1">
                        {bounty.title}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs block">
                      Conducted comprehensive security audit for a lending protocol with $5M TVL.
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground/60">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(bounty.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold font-inter text-foreground text-base">
                      ${bounty.rewardAmount.toLocaleString()}
                    </span>
                    <Badge className="bg-[#0066FF] text-white hover:bg-[#0066FF]/90 text-[10px] px-2 py-0.5 h-auto rounded-sm font-bold border-0">
                      USDC
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
