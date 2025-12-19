"use client";

import { cn } from "@/lib/utils";
import { Briefcase, LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const tabs = [
  { name: "Overview", href: "?tab=overview", icon: LayoutDashboard },
  { name: "Portfolio", href: "?tab=portfolio", icon: Briefcase },
  { name: "Reviews", href: "?tab=reviews", icon: Star },
];

export function ProfileTabs() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  return (
    <div className="mb-4 overflow-x-auto">
      <div className="inline-flex items-center bg-muted-foreground/20 border border-white/5 backdrop-blur-sm w-[346.44px] h-[44.58px] rounded-[11.76px] p-[4.41px] justify-between">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name.toLowerCase();
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[9px] font-inter  text-[16px] font-normal",
                isActive
                  ? "bg-background text-foreground shadow-sm border border-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-[15px] h-[15px] text-[#3B82F6]" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
