"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@/lib/types";
import { format } from "date-fns";
import { CheckCircle2, Clock, Eye, Gift, LayoutGrid, UserCircle } from "lucide-react";
import Link from "next/link";

interface ProjectApplicantCardProps {
  user: User;
  appliedAt: string;
  coverLetter?: string;
  onHire: () => void;
  onViewSubmission?: () => void;
  isHired?: boolean;
}

export function ProjectApplicantCard({
  user,
  appliedAt,
  coverLetter,
  onHire,
  onViewSubmission,
  isHired
}: ProjectApplicantCardProps) {

  return (
    <Card className="bg-background border-primary p-6 font-inter">
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Avatar */}
        <Avatar className="h-14 w-14 border border-border shrink-0">
          <AvatarImage src={user.profilePicture} alt={user.firstName} />
          <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 w-full">

          {/* Header Info */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Placeholder Badge - assuming logic for 'Fair Payer' or similar rating */}
              {/* <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full">
                Fair Payer
              </Badge> */}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {coverLetter}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-blue-500" />
              <span>{user.totalSubmissions || 0} Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              <span>{user.totalWon || 0} Bounties</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{appliedAt ? format(new Date(appliedAt), "M/d/yyyy") : "N/A"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/dashboard/profile/${user.id}`} target="_blank">
              <Button variant="stallion-outline" size="sm" className="bg-transparent border-primary text-foreground h-9">
                <UserCircle className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </Link>

            {/* Need a way to view submission details - could be a modal or expansion */}
            <Button variant="stallion" size="sm" className="text-foreground h-9" onClick={onViewSubmission}>
              <Eye className="w-4 h-4 mr-2" />
              View Submissions
            </Button>

            {!isHired && (
              <Button
                size="sm"
                className="bg-primary/20 hover:bg-primary/25 text-white border border-border h-9"
                onClick={onHire}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Hire
              </Button>
            )}

            {isHired && (
              <Button size="sm" disabled className="bg-primary/20 text-primary border border-primary/30 h-9">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Hired
              </Button>
            )}
          </div>

        </div>
      </div>
    </Card>
  );
}
