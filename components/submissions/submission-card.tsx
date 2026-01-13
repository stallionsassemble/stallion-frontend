"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetBounty } from "@/lib/api/bounties/queries";
import { useGetProject } from "@/lib/api/projects/queries";
import { useGetUser } from "@/lib/api/users/queries";
import { BriefcaseBusiness, CircleCheckBig, Eye, Timer } from "lucide-react";
import Image from "next/image";

export type SubmissionStatus = "Approved" | "Pending Review" | "Revision Requested" | "Rejected" | "Draft" | "Completed";

export interface SubmissionCardProps {
  id: string | number;
  projectId?: string;
  bountyId?: string;
  project: string;
  source: string
  title: string;
  description: string;
  logo: string;
  amount: string;
  type: string
  status: SubmissionStatus;
  projectStatus?: string; // Status of the parent project/bounty
  submittedAt: string;
  lastUpdated: string;
  ownerId?: string;
}

const getStatusColor = (status: SubmissionStatus) => {
  switch (status) {
    case "Approved":
      return "text-green-500 border-green-500/20 bg-green-500/10";
    case "Completed":
      return "text-blue-500 border-blue-500/20 bg-blue-500/10";
    case "Pending Review":
      return "text-orange-500 border-orange-500/20 bg-orange-500/10";
    case "Revision Requested":
      return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    case "Rejected":
      return "text-destructive border-destructive/20 bg-destructive/10";
    default:
      return "text-muted-foreground border-border bg-muted";
  }
};

export function SubmissionCard({
  id,
  projectId,
  bountyId,
  project,
  source,
  title,
  description,
  logo,
  amount,
  type,
  status,
  projectStatus,
  submittedAt,
  lastUpdated,
  ownerId, // Still accept it, but might not be used if empty
}: SubmissionCardProps) {
  // Fetch details if ownerId is missing
  const { data: projectDetails } = useGetProject(projectId || "", !!projectId && !ownerId);
  const { data: bountyDetails } = useGetBounty(bountyId || "", !!bountyId && !ownerId);

  // Determine owner to display
  // Prioritize direct Owner ID -> Project Owner -> Bounty Owner
  const effectiveOwnerId = ownerId || projectDetails?.owner?.id || bountyDetails?.owner?.id || "";

  // Use user hook if we have an ID (either passed or fetched)
  const { data: userOwner } = useGetUser(effectiveOwnerId, !!effectiveOwnerId);

  // Consolidated Owner Object
  // Use fetched project/bounty owner object directly if available, or user fetch result
  const owner = userOwner || projectDetails?.owner || bountyDetails?.owner;

  const companyName = owner?.companyName || owner?.firstName || project || "Stallion";
  const companyLogo = owner?.companyLogo || owner?.profilePicture || logo;

  // Logic to hide actions if completed
  const isCompleted = projectStatus === "COMPLETED" || projectStatus === "CLOSED";

  return (
    <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Logo */}
          <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full bg-white/5 p-2 border border-white/5">
            <Image
              src={companyLogo}
              width={64}
              height={64}
              alt={companyName}
              className="h-full w-full object-contain rounded-full"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="h-5 px-2 font-inter font-medium text-[10px] border-primary/50 text-white bg-primary/10 rounded-full">
                {source.charAt(0).toUpperCase() + source.slice(1).toLowerCase()}
              </Badge>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-inter text-foreground transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="line-clamp-2 break-all font-inter font-light text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[10px] sm:text-xs text-muted-foreground font-inter font-light">
              <div className="flex items-center text-gray-300">
                <BriefcaseBusiness className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary mr-1.5" />
                <span className="truncate max-w-[120px] sm:max-w-none">{companyName}</span>
              </div>
              <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center">
                <Timer className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary mr-1.5" />
                <span>Submitted {submittedAt}</span>
              </div>
              <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center">
                <span className="text-muted-foreground/60">Updated {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex flex-row items-center justify-between border-t border-border pt-3 mt-1 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:mt-0 gap-2 sm:gap-4 self-stretch sm:self-auto sm:w-auto min-w-[140px]">
          <Badge variant="outline" className={`h-6 px-2.5 text-[10px] font-inter font-medium border-[0.54px] w-fit ${getStatusColor(status)}`}>
            <CircleCheckBig className="w-3 h-3 mr-1.5" />
            {status}
          </Badge>

          <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0">
            <div className="flex items-center justify-end gap-1.5 sm:mb-2">
              <span className="text-lg sm:text-xl font-inter font-bold text-foreground">{amount}</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-1.5 py-0 text-[9px] rounded-sm h-4 sm:h-5">
                {type}
              </Badge>
            </div>

            <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-full gap-2 font-inter text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 p-0 sm:px-3 justify-end">
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
          </div>
        </div>

        {/* Mobile View Details Button (Full Width) */}
        <Button variant="outline" size="sm" className="flex sm:hidden w-full gap-2 font-inter text-xs font-medium border-border bg-card hover:bg-accent text-foreground h-9">
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Button>
      </div>
    </div >
  );
}
