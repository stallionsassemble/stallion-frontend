"use client";

import { SubmitBountyModal } from "@/components/bounties/submit-bounty-modal";
import { MfaRequiredDialog } from "@/components/common/mfa-required-dialog";
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

// ... imports
import { useWithdrawApplication } from "@/lib/api/projects/queries";

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
  applicationId?: string; // New prop
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
  applicationId, // New prop
}: BountyDetailsSidebarProps) {

  // Calculate remaining time
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

  // Check if deadline has passed
  const isExpired = deadline ? new Date(deadline).getTime() < Date.now() : false;

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
          <h2 className="text-4xl font-bold text-foreground">{reward} <span className="text-lg text-primary">{currency}</span></h2>
        </div>

        <div className="p-4 space-y-3">
          {isProject ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Fixed price project
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥇</span>
                  <span className="text-sm font-medium text-muted-foreground">Winner</span>
                </div>
                <span className="font-bold text-foreground">$5,000</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥈</span>
                  <span className="text-sm font-medium text-muted-foreground">1st Runner up</span>
                </div>
                <span className="font-bold text-foreground">$3,000</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥉</span>
                  <span className="text-sm font-medium text-muted-foreground">Second Runner up</span>
                </div>
                <span className="font-bold text-foreground">$1,000</span>
              </div>
            </>
          )}
        </div>

        <div className="p-4 pt-0">
          {isExpired ? (
            <Button disabled className="w-full bg-muted text-muted-foreground font-bold h-11 cursor-not-allowed">
              Submissions in Review
            </Button>
          ) : applied ? (
            applicationId ? (
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive font-bold h-11 border border-destructive/50"
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
              </Button>
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

        <div className="pt-2 flex justify-center">
          <Link href="#" className="flex items-center gap-2 text-primary text-[12px] font-semibold transition-all">
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
