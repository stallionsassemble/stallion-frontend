"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { MessageSquare, Users, MessageSquareText } from "lucide-react";

export function ForumStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Discussions"
        value="1,234"
        icon={MessageSquare}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Active Members"
        value="600"
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Posts Today"
        value="45"
        icon={MessageSquareText}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
      <KpiCard
        label="Online Now"
        value="89"
        icon={Users}
        layout="row"
        iconStyle="standard"
        iconClassName="h-8 w-8 text-foreground"
      />
    </div>
  );
}

