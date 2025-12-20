"use client";

import { cn } from "@/lib/utils";
import { Bell, Shield, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const tabs = [
  { name: "Profile", href: "?tab=profile", icon: User },
  { name: "Security", href: "?tab=security", icon: Shield },
  { name: "Notification", href: "?tab=notification", icon: Bell },
];

export function SettingsTabs() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="inline-flex items-center bg-muted-foreground/20 border border-white/5 backdrop-blur-sm w-full md:w-[346.44px] h-[44.58px] rounded-[11.76px] p-[4.41px] justify-between">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name.toLowerCase();
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[9px] font-inter text-[14px] md:text-[16px] font-normal transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm border border-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-4 h-4", isActive ? "text-[#3B82F6]" : "text-muted-foreground")} />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
