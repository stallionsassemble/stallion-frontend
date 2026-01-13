"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BadgeDollarSign, MessageSquare } from "lucide-react";

export function ProjectDetailsSidebar(
  {
    totalPrizes,
    currency,
    hiredTalent,
    progress,
    paidAmount,
    totalAmount,
    isHired,
    onMessage
  }: {
    totalPrizes: string;
    currency: string;
    hiredTalent: {
      name: string;
      role: string;
      avatar: string;
      rating?: string | number;
      reviews?: number;
    };
    progress: number;
    paidAmount: string;
    totalAmount: string;
    isHired: boolean;
    onMessage?: () => void;
  }
) {

  return (
    <div className="w-full lg:w-[360px] space-y-6">
      <div className="rounded-xl border-[0.69px] border-primary bg-card overflow-hidden font-inter">

        {/* Total Prizes Header */}
        <div className="p-6 text-center border-b border-[1.16px] border-primary/30 bg-primary/10">
          <div className="flex justify-center mb-2">
            <BadgeDollarSign className="h-5 w-5 text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Prizes</p>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-4xl font-bold text-foreground">{totalPrizes}</h2>
            <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 rounded-full px-3 py-1 text-sm font-medium self-center mt-1">
              {currency}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-6">

          {/* Hired Talent Section */}
          {isHired && (
            <div className={cn(
              "rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-4"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage src={hiredTalent.avatar} alt={hiredTalent.name} />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{hiredTalent.name}</h4>
                    <p className="text-xs text-muted-foreground">{hiredTalent.role}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-3"
                  onClick={onMessage}
                >
                  <MessageSquare className="h-3 w-3 mr-1.5" />
                  Message
                </Button>
              </div>
            </div>
          )}

          {/* Project Progress Section */}
          {isHired && (
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-foreground font-medium">Project Progress</span>
                <span className="text-foreground font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-primary" />
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-2">
                <span>Funds Released</span>
                <span>{progress === 100 ? totalAmount : paidAmount} / {totalAmount} {currency}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
