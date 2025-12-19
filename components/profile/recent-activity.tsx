"use client";

import { Badge } from "@/components/ui/badge";

const activities = [
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    // No amount for 2nd row in image example? Or maybe just placeholder replication.
    // Image shows some rows with amount, some without? Actually all have it in recent activity usually.
    // I'll leave one empty to match "Completed bounty Smart Contract Audit..." layout.
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    // placeholder
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    action: "Completed bounty",
    date: "2 days ago",
    // placeholder
  },
];

export function RecentActivity() {
  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 mb-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Recent Activity</h3>
      <div>
        {activities.map((item, i) => (
          <div key={i} className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal font-inter text-muted-foreground/80">
                {item.action} <span className="text-foreground font-normal ml-1">{item.title}</span>
              </p>
              <p className="text-[10px] text-muted-foreground/60">{item.date}</p>
            </div>
            {item.amount && (
              <div className="flex items-center gap-2">
                <span className="font-bold font-inter text-foreground text-base">{item.amount}</span>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] px-2 py-0.5 h-auto rounded-full font-bold border-0">
                  {item.token}
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
