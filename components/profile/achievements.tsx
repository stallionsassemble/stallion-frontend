"use client";

import { cn } from "@/lib/utils";
import { Crown, Award, UserStar } from "lucide-react";

const achievements = [
  {
    icon: Crown,
    color: "text-white",
    bg: "bg-primary",
    title: "Second Bounty",
  },
  {
    icon: Award,
    color: "text-white",
    bg: "bg-orange-500",
    title: "10 Completed",
  },
  {
    icon: UserStar,
    color: "text-black",
    bg: "bg-yellow-500",
    title: "Top Contributor",
  },
];

export function Achievements() {
  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Achievements</h3>
      <div className="flex gap-3">
        {achievements.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-3 text-center group cursor-default">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110",
              item.bg,
              item.color
            )}>
              <item.icon className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
