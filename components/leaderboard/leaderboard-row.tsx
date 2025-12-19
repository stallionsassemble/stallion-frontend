"use client";

import { LeaderboardUser } from "@/app/dashboard/leaderboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Crown, DollarSign, Star, UserStar } from "lucide-react";
import Image from "next/image";

interface LeaderboardRowProps {
  user: LeaderboardUser;
}

export function LeaderboardRow({ user }: LeaderboardRowProps) {
  return (
    <div className="group relative flex items-center gap-2 p-4 bg-primary/14 border-b border-primary">
      {/* Rank */}
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm border font-inter",
        "bg-primary/48 text-foreground"
      )}>
        {user.rank === 1 ? <Crown className="w-5 h-5" /> : `#${user.rank}`}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 min-w-[200px] flex-1">
        <div className="h-10 w-10 relative rounded-full overflow-hidden border border-primary/20 shrink-0">
          <Image
            src={`https://avatar.vercel.sh/${user.avatar}`}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground font-inter">{user.name}</span>
            {user.isVerified && (
              <Badge className="bg-yellow-300 text-background hover:bg-amber-400/20 border-amber-500/20 px-1.5 py-0 h-4 text-[10px] gap-0.5">
                <UserStar className="w-4 h-4" />
                Verified Builder
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-light font-inter">@{user.handle}</span>
          <Badge variant="secondary" className="mt-1 w-[32px] h-[14px] flex items-center justify-center gap-[4px] px-[5px] py-[2px] rounded-[7195.94px] border-[0.72px] border-primary/20 text-[8px] font-normal bg-primary/20 text-foreground hover:bg-primary/30">
            {user.category || "React"}
          </Badge>
        </div>
      </div>

      {/* Stats - Grid for alignment on desktop */}
      <div className="hidden md:grid grid-cols-4 gap-8 flex-1 items-center justify-items-center">
        {/* Rating */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Star className="fill-current w-4 h-4" />
            <span className="font-bold text-foreground font-inter">{user.rating.toFixed(2)}</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-light font-inter">Rating</span>
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-blue-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold text-foreground font-inter">{user.completedTasks}</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-light font-inter">Completed</span>
        </div>

        {/* Earned */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-blue-300">
            <DollarSign className="w-4 h-4" />
            <span className="font-bold text-foreground font-inter">${user.earnedAmount.toLocaleString()}</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-light font-inter">Earned</span>
        </div>

        {/* Success Rate */}
        <Badge variant="outline" className={cn(
          "border-green-500/30 text-foreground text-[10px] bg-green-500/30 hover:bg-green-500/20",
          "font-inter font-medium"
        )}>
          {user.successRate}% success
        </Badge>
      </div>

      {/* Action */}
      <Button variant="ghost" size="sm" className="hidden sm:flex text-primary text-[14px] font-semibold hover:text-primary  gap-1 font-inter leading-[44.4px] hover:bg-transparent">
        View Profile <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
