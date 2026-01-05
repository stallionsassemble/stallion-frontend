"use client";

import { SubmitBountyModal } from "@/components/bounties/submit-bounty-modal";
import { MfaRequiredDialog } from "@/components/common/mfa-required-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/use-auth";
import { ArrowRight, BadgeDollarSign, Calendar, Gift, InfoIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SidebarOwner {
  id: string
  username: string
  firstName: string
  lastName: string
  companyName: string
  profilePicture: string
  companyLogo?: string
  createdAt: string
  totalPaid: string
  totalBounties: number
  bio: string
  rating: string
}

import { useWithdrawApplication } from "@/lib/api/projects/queries";

import { BountyDistribution } from "@/lib/types/bounties"; // Added import
import { ApplyProjectResponse } from "@/lib/types/project"; // Corrected import

interface BountyDetailsSidebarProps {
  type?: "BOUNTY" | "PROJECT";
  projectId: string;
  projectTitle: string;
  reward: string;
  currency: string;
  totalContributors?: number;
  totalPaid?: string;
  owner?: SidebarOwner;
  createdAt?: string;
  deadline?: string;
  winnerAnnouncement?: string;
  applied?: boolean;
  applicationId?: string;
  distribution?: BountyDistribution[]; // New prop
  submissionFields?: any[]; // New prop passed to modal
  currentApplication?: ApplyProjectResponse; // Corrected type
}

export function BountyDetailsSidebar({
  type = "BOUNTY",
  projectId,
  projectTitle,
  reward,
  currency,
  totalContributors,
  totalPaid,
  owner,
  createdAt,
  deadline,
  winnerAnnouncement,
  applied = false,
  applicationId,
  distribution,
  submissionFields,
  currentApplication,
}: BountyDetailsSidebarProps) {

  // ... existing time calc logic ...
  const getRemainingTime = () => {
    if (!deadline) return "No deadline set";
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return "Applications closed";

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${d}d:${h}h:${m}m`;
  };
  const isProject = type === "PROJECT";
  const { user } = useAuth();
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const { mutate: withdrawApplication, isPending: isWithdrawing } = useWithdrawApplication();

  const handleWithdraw = () => {
    if (applicationId) {
      withdrawApplication(applicationId);
    }
  };

  const isMfaEnabled = user?.mfaEnabled;
  const isExpired = deadline ? new Date(deadline).getTime() < Date.now() : false;

  // Helper to calculate amount from percentage
  const getAmount = (percentage: number) => {
    if (!reward) return 0;
    // Remove all non-numeric characters except dot
    const numericString = reward.toString().replace(/[^0-9.]/g, '');
    const total = parseFloat(numericString);
    if (isNaN(total)) return 0;
    if (isNaN(percentage)) return 0;
    return (total * percentage) / 100;
  };

  // Format ordinal (1st, 2nd, 3rd)
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="space-y-6 w-full">
      <MfaRequiredDialog open={showMfaDialog} onOpenChange={setShowMfaDialog} />

      {/* Prize/Budget Card */}
      <div className="rounded-xl border-[0.69px] border-primary bg-card overflow-hidden font-inter">
        <div className="p-6 text-center border-b border-[1.16px] border-primary/30 bg-primary/10">
          <div className="flex justify-center mb-2">
            <BadgeDollarSign className="h-5 w-5 text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{isProject ? "Project Budget" : "Total Prizes"}</p>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-4xl font-bold text-foreground">{reward}</h2>
            <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 rounded-full px-3 py-1 text-sm font-medium self-center mt-1">
              {currency}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {isProject ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Fixed price project
            </div>
          ) : distribution && distribution.length > 0 ? (
            distribution.map((dist, idx) => {
              // Handle case where percentage is [rank, percentage] tuple
              const actualPercentage = Array.isArray(dist.percentage) ? dist.percentage[1] : dist.percentage;
              const rawRank = Array.isArray(dist.percentage) ? dist.percentage[0] : dist.rank;
              // If rawRank is 0 (some APIs), treat as 1 (winner). If 1, treat as 1. 
              // Based on user data: [1, 60] -> rank 1.
              const actualRank = rawRank;

              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {actualRank === 1 ? "🥇" : actualRank === 2 ? "🥈" : actualRank === 3 ? "🥉" : "🏅"}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {actualRank === 1 ? "Winner" : actualRank === 2 ? "1st Runner up" : actualRank === 3 ? "2nd Runner up" : `${getOrdinal(actualRank)} Place`}
                    </span>
                  </div>
                  <span className="font-bold text-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(getAmount(actualPercentage))} {currency}
                  </span>
                </div>
              );
            })
          ) : (
            // Fallback for bounties without explicit distribution
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-medium text-muted-foreground">Winner Takes All</span>
              </div>
              <span className="font-bold text-foreground">{reward}</span>
            </div>
          )}
        </div>

        <div className="p-4 pt-0">
          {isExpired ? (
            <Button disabled className="w-full bg-muted text-muted-foreground font-bold h-11 cursor-not-allowed">
              Submissions in Review
            </Button>
          ) : applied ? (
            applicationId ? (
              <div className="flex gap-2">
                {isProject && (
                  <SubmitBountyModal
                    type="PROJECT"
                    projectId={projectId}
                    projectTitle={projectTitle}
                    reward={reward}
                    currency={currency}
                    sponsorLogo={owner?.companyLogo || owner?.profilePicture}
                    existingApplication={currentApplication}
                  >
                    <Button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 font-bold h-11 border border-primary/20">
                      Edit
                    </Button>
                  </SubmitBountyModal>
                )}
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive font-bold h-11 border border-destructive/50"
                >
                  {isWithdrawing ? "..." : (isProject ? "Withdraw" : "Withdraw")}
                </Button>
              </div>
            ) : (
              <Button disabled className="w-full bg-green-500/20 text-green-500 font-bold h-11 cursor-not-allowed border border-green-500/50">
                Applied
              </Button>
            )
          ) : isMfaEnabled ? (
            <SubmitBountyModal
              type={type}
              projectId={projectId}
              projectTitle={projectTitle}
              reward={reward}
              currency={currency}
              sponsorLogo={owner?.companyLogo || owner?.profilePicture}
              submissionFields={submissionFields} // Pass fields
            >
              <Button className="w-full bg-primary hover:bg-[#007AFF/95] text-white font-bold h-11">
                {isProject ? "Apply for Project" : "Submit Bounty"}
              </Button>
            </SubmitBountyModal>
          ) : (
            <Button
              onClick={() => setShowMfaDialog(true)}
              className="w-full bg-primary hover:bg-[#007AFF/95] text-white font-bold h-11"
            >
              {isProject ? "Apply for Project" : "Submit Bounty"}
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground py-4 rounded-lg border-[1.16px] border-primary/50">
            <InfoIcon className="h-5 w-5 text-muted-foreground" />
            <span>Applications close in {getRemainingTime()}</span>
          </div>
        </div>
      </div>

      {/* About Organization */}
      <div className="w-full rounded-[13.97px] border-[1.16px] border-primary bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-[53px] w-[53px] rounded-full bg-background p-1 shrink-0 overflow-hidden flex items-center justify-center">
            <Image
              src={owner?.companyLogo || owner?.profilePicture || "/assets/icons/sdollar.png"}
              width={53}
              height={53}
              alt={owner?.companyName || owner?.username || "Stallion"}
              className="object-contain"
            />
          </div>
          <div className="space-y-1 font-inter">
            <h3 className="text-[16px] font-medium text-foreground">{owner?.companyName || owner?.username || "Stallion User"}</h3>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-[14px] text-foreground font-medium">4.8</span>
            </div>
          </div>
        </div>

        <p className="font-light text-[11px] text-gray-400 leading-relaxed">
          {owner?.bio || "No bio available"}
        </p>

        <div className="space-y-3 font-inter">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-normal text-[12px] tracking-[-2%]">Total Bounties</span>
              <span className="font-extralight text-[12px] tracking-[-2%] text-center">:</span>
              <span className="text-white font-bold text-[12px] tracking-[-2%]">{totalContributors}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-normal text-[12px] tracking-[-2%]">Total Paid</span>
              <span className="text-white font-bold text-[12px] tracking-[-2%]">{totalPaid}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-normal text-[12px] tracking-[-2%]">Member Since:</span>
              <span className="text-foreground font-bold text-[12px] tracking-[-2%]">
                {owner?.createdAt ? new Date(owner.createdAt).getFullYear() : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-4">
          <Link href={`/dashboard/bounties?ownerId=${owner?.id}`} className="flex items-center gap-2 text-primary text-[12px] font-semibold transition-all">
            View Bounties <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/dashboard/profile/${owner?.id}`} className="flex items-center gap-2 text-primary text-[12px] font-semibold transition-all">
            View Profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="font-medium font-inter px-2">
        <p className="text-[16px] text-foreground uppercase mb-1">Winner Announcement By</p>

        <p className="text-[14px] text-foreground">
          {winnerAnnouncement ? new Date(winnerAnnouncement).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "Date TBD"} - as scheduled by the project owner
        </p>
      </div>
    </div>
  );
}
