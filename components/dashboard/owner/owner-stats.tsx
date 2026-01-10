import { KpiCard } from "@/components/ui/kpi-card";
import { useProjectOwnerStatsQuery } from "@/lib/api/dashboard/queries";
import { DollarSign, FileText, Timer, Users } from "lucide-react";

export function OwnerStats() {
  const { data: ownerStats } = useProjectOwnerStatsQuery()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <KpiCard
        layout="column"
        iconAlignment="top"
        label="Total Bounties"
        value={ownerStats?.totalBountiesCreated}
        icon={FileText}
        status="Total Bounties Posted"
        statusColor="text-blue-400"
        borderColor="hover:border-blue-500/50"
        className="bg-background border-[1.17px] border-border h-full"
        iconClassName="text-white"
        iconContainerClassName="bg-white/5 border-white/5"
      />
      <KpiCard
        layout="column"
        iconAlignment="top"
        label="Total Paid Out"
        value={ownerStats?.totalPaidOut}
        valuePrefix="$"
        icon={DollarSign}
        status={`${ownerStats?.paidOutPercentageChange || 0}% from last month ↗`}
        statusColor="text-blue-400"
        borderColor="hover:border-blue-500/50"
        className="bg-background border-[1.17px] border-border h-full"
        iconClassName="text-white"
        iconContainerClassName="bg-white/5 border-white/5"
      />
      <KpiCard
        layout="column"
        iconAlignment="top"
        label="Pending Payments"
        value={ownerStats?.pendingPayments}
        valuePrefix="$"
        icon={Timer}
        status="Awaiting approval"
        statusColor="text-muted-foreground"
        borderColor="hover:border-blue-500/50"
        className="bg-background border-[1.17px] border-border h-full"
        iconClassName="text-white"
        iconContainerClassName="bg-white/5 border-white/5"
      />
      <KpiCard
        layout="column"
        iconAlignment="top"
        label="Contributors"
        value={ownerStats?.totalContributors || 0}
        icon={Users}
        // status="Avg. 3.2 weeks"
        statusColor="text-muted-foreground"
        borderColor="hover:border-blue-500/50"
        className="bg-background border-[1.17px] border-border h-full"
        iconClassName="text-white"
        iconContainerClassName="bg-white/5 border-white/5"
      />
    </div>
  );
}
