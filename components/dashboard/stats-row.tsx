import { CheckCircle2, DollarSign, Target, TrendingUp } from "lucide-react";

export function StatsRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Earnings */}
      <div className="rounded-xl border border-white/10 bg-[#09090B] p-5 relative overflow-hidden group hover:border-[#007AFF]/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <DollarSign className="w-12 h-12 text-white" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
          <div className="bg-[#FFFFFF1A] p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-white">$12,450</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs">
            <span className="text-[#007AFF] flex items-center gap-0.5 font-medium">
              +12% <TrendingUp className="w-3 h-3" />
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
      </div>

      {/* Active Bounties */}
      <div className="rounded-xl border border-white/10 bg-[#09090B] p-5 relative overflow-hidden group hover:border-[#007AFF]/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target className="w-12 h-12 text-white" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-gray-400">Active Bounties</h3>
          <div className="bg-[#FFFFFF1A] p-1.5 rounded-lg">
            <Target className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-white">10</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
            In progress
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="rounded-xl border border-white/10 bg-[#09090B] p-5 relative overflow-hidden group hover:border-[#007AFF]/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          <div className="bg-[#FFFFFF1A] p-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-bold text-white">400</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
            All time
          </div>
        </div>
      </div>
    </div>
  );
}
