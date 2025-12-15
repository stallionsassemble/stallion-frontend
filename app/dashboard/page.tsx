"use client";

import { ActivityFeed, OpportunityList } from "@/components/dashboard/main-sections";
import { DashboardRightSidebar } from "@/components/dashboard/right-sidebar";
import { StatsRow } from "@/components/dashboard/stats-row";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8">
      {/* Main Column */}
      <div className="space-y-8 min-w-0">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-10 text-white">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white/20">
              <Image
                src="https://avatar.vercel.sh/john"
                width={80}
                height={80}
                alt="John"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-blue-100/90 text-sm md:text-base font-medium">Ready to build something amazing today?</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <StatsRow />

        {/* Browse Opportunities */}
        <OpportunityList title="Browse Opportunities" type="bounties" />

        {/* Grants */}
        <OpportunityList title="Grants" type="grants" />

        {/* Recent Activities */}
        <ActivityFeed />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block space-y-8">
        <DashboardRightSidebar />
      </div>

      {/* Mobile Right Sidebar Fallback (shown below on mobile if needed, or hidden) */}
      {/* Currently hidden by layout, or can be stacked. The grid puts it below on mobile which is standard. */}
      <div className="lg:hidden space-y-8">
        <div className="w-full h-px bg-white/10 my-4"></div>
        <DashboardRightSidebar />
      </div>
    </div>
  );
}
