import { CheckCircle2, DollarSign, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/store/use-auth";
import { useGetUser } from "@/lib/api/users/queries";

export function StatsRow() {
  const { user } = useAuth()
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Earnings */}
      <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-foreground">{user?.totalWon || 0}</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="text-primary flex items-center gap-0.5 font-medium">
              +12% <TrendingUp className="w-3 h-3" />
            </span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </div>
      </div>

      {/* Active Bounties */}
      <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          {/* <Target className="w-12 h-12 text-white" /> */}
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Active Bounties</h3>
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Target className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-foreground">10</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            In progress
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          {/* <CheckCircle2 className="w-12 h-12 text-white" /> */}
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-foreground">{user?.totalSubmissions || 0}</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            All time
          </div>
        </div>
      </div>
    </div>
  );
}
