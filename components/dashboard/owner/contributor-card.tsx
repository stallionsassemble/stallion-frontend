"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Gift, MessageSquare, UserPlus, UserStar } from "lucide-react";

export interface Contributor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  bio: string;
  stats: {
    bounties: number;
    projects: number;
    totalEarned: number;
    currency: string;
  };
}

interface ContributorCardProps {
  contributor: Contributor;
  onInvite: (contributor: Contributor) => void;
  onMessage: (contributor: Contributor) => void;
}

export function ContributorCard({ contributor, onInvite, onMessage }: ContributorCardProps) {
  return (
    <Card className="bg-background border-primary overflow-hidden flex flex-col h-full">
      <CardContent className="p-4 flex-1">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12 border border-white/10">
            <AvatarImage src={contributor.avatar} alt={contributor.name} />
            <AvatarFallback>{contributor.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-orange-500 text-foreground hover:bg-orange-500/90 border-0 text-[10px] px-2 py-0.5 h-5">
                <UserStar className="w-3.5 h-3.5 text-foreground mr-1" />
                {contributor.role}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-white truncate">{contributor.name}</h3>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-blue-500" />
                <span>{contributor.stats.bounties} Bounties</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span>{contributor.stats.projects} Projects</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-3 mb-6 leading-relaxed">
          {contributor.bio}
        </p>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${contributor.stats.totalEarned.toLocaleString()}
            </span>
            {/* <Badge variant="secondary" className="bg-primary/90 text-foreground hover:bg-blue-600/30 border-0 text-[10px]">
              {contributor.stats.currency}
            </Badge> */}
          </div>
        </div>
      </CardContent>

      <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-3">
        <Button
          variant="stallion-outline"
          className="w-full bg-background border-primary border hover:bg-background/90 text-foreground"
          onClick={() => onMessage(contributor)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button
          className="w-full bg-primary/90 hover:bg-primary/85 text-white"
          onClick={() => onInvite(contributor)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>
    </Card >
  );
}
