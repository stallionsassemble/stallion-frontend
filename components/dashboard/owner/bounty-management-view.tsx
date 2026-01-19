"use client";

import { ConfirmWinnersModal } from "@/components/dashboard/owner/confirm-winners-modal";
import { SubmissionItem } from "@/components/dashboard/owner/submission-item";
import { SubmissionModal } from "@/components/dashboard/owner/submission-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBountyWinners, useGetSubmissions } from "@/lib/api/bounties/queries";
import { useBountyWinners, Winner } from "@/lib/hooks/use-bounty-winners";
import { Bounty } from "@/lib/types/bounties";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BadgeDollarSign, Calendar, FileText, Filter } from "lucide-react";
import { useState } from "react";

interface BountyManagementViewProps {
  bounty: Bounty;
}

export function BountyManagementView({ bounty }: BountyManagementViewProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showConfirmWinnersModal, setShowConfirmWinnersModal] = useState(false);
  const [initialModalView, setInitialModalView] = useState<'details' | 'selectWinner' | 'requestRevision'>('details');

  const { data: submissions = [], isLoading: isLoadingSubmissions } = useGetSubmissions(bounty.id);
  const { data: apiWinnersData } = useGetBountyWinners(bounty.id);

  // Winner management hook
  const { winners: localWinners, addWinner, removeWinner, clearWinners } = useBountyWinners(bounty.id);

  const isCompleted = bounty.status === 'COMPLETED' || bounty.status === 'CLOSED';

  // Determine which winners list to use
  let displayWinners: Winner[] = localWinners;

  if (isCompleted && apiWinnersData?.winners) {
    displayWinners = apiWinnersData.winners.map((w: any) => ({
      submissionId: w.submissionId || "",
      userId: w.userId,
      name: w.firstName ? `${w.firstName} ${w.lastName}` : w.username,
      avatar: w.profilePicture,
      position: w.position,
      amount: w.amountWon,
      currency: w.currency
    }));
  }

  // Get distribution data
  const distList = bounty.distribution || bounty.rewardDistribution || [];
  const totalReward = Number(bounty.reward || 0);
  const requiredPositions = distList.length;
  // const takenPositions = displayWinners.map((w) => w.position);
  // const allPositionsFilled = displayWinners.length >= requiredPositions && requiredPositions > 0;

  // FIX: Calculate taken positions correctly and ensure we don't exceed required positions logic in UI
  const takenPositions = displayWinners.map((w) => w.position);
  const allPositionsFilled = displayWinners.length >= requiredPositions && requiredPositions > 0;


  // Get user IDs of staged/confirmed winners
  const winnerUserIds = new Set(displayWinners.map((w) => w.userId));

  const filteredSubmissions = submissions.filter((sub: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "review") {
      // Exclude staged winners from review tab
      const isPending = sub.status === "PENDING" || sub.status === "UNDER_REVIEW";
      const isStaged = sub.user?.id && winnerUserIds.has(sub.user.id);
      return isPending && !isStaged;
    }
    if (activeTab === "winners") {
      // Include API-confirmed winners OR localStorage-staged winners
      const isApiWinner = sub.status === "ACCEPTED" || sub.status === "WINNER";
      const isStagedWinner = sub.user?.id && winnerUserIds.has(sub.user.id);
      return isApiWinner || isStagedWinner;
    }
    if (activeTab === "rejected") return sub.status === "REJECTED";
    return true;
  });

  // Count staged winners for tab label
  const totalWinnersCount = submissions.filter((s: any) =>
    (s.status === "ACCEPTED" || s.status === "WINNER") ||
    (s.user?.id && winnerUserIds.has(s.user.id))
  ).length;

  const inReviewCount = submissions.filter((s: any) =>
    (s.status === "PENDING" || s.status === "UNDER_REVIEW") &&
    !(s.user?.id && winnerUserIds.has(s.user.id))
  ).length;

  const tabs = [
    { id: "all", label: `All Submission (${submissions.length})` },
    { id: "review", label: `In Review (${inReviewCount})` },
    { id: "winners", label: `Winners (${totalWinnersCount})` },
  ];

  const handleWinnerSelected = (winner: Winner) => {
    addWinner(winner);
  };

  const handleWinnersConfirmed = () => {
    clearWinners();
    setShowConfirmWinnersModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <SubmissionModal
        isOpen={!!selectedSubmission}
        onClose={() => {
          setSelectedSubmission(null);
          setInitialModalView('details');
        }}
        submission={selectedSubmission}
        bountyTitle={bounty.title}
        bountyDistribution={distList}
        totalReward={totalReward}
        currency={bounty.rewardCurrency}
        onWinnerSelected={handleWinnerSelected}
        takenPositions={takenPositions}
        initialView={initialModalView}
        isCompleted={isCompleted}
      />

      <ConfirmWinnersModal
        isOpen={showConfirmWinnersModal}
        onClose={() => setShowConfirmWinnersModal(false)}
        bountyId={bounty.id}
        bountyTitle={bounty.title}
        currency={bounty.rewardCurrency}
        winners={localWinners}
        onConfirmed={handleWinnersConfirmed}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
          <CardContent className="p-4 h-full flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Submissions</p>
              <h3 className="text-2xl font-bold text-white">{submissions.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
          <CardContent className="p-4 h-full flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Deadline</p>
              <h3 className="text-xl font-bold text-white tracking-tight">{bounty.submissionDeadline ? format(new Date(bounty.submissionDeadline), "MMM dd, yyyy") : "N/A"}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
          <CardContent className="p-4 h-full flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Reward</p>
              <h3 className="text-2xl font-bold text-white">{bounty.rewardCurrency === 'XLM' ? '' : '$'}{Number(bounty.reward).toLocaleString()}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
              <BadgeDollarSign className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
          <CardContent className="p-4 h-full flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Currency</p>
              <h3 className="text-2xl font-bold text-white">{bounty.rewardCurrency}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
              <BadgeDollarSign className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center bg-muted-foreground/10 border border-white/5 backdrop-blur-sm h-[44.58px] rounded-[11.76px] p-[4.41px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-[9px] font-inter text-sm font-medium transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-white/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background border-border text-foreground hover:text-white gap-2">
              <Filter className="h-4 w-4" /> {activeTab === 'rejected' ? 'Rejected' : 'More Filter'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem onClick={() => setActiveTab('rejected')} className="cursor-pointer">
              Rejected ({submissions.filter((s: any) => s.status === "REJECTED").length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isLoadingSubmissions ? (
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission: any) => {
              // Check if this submission's user is a staged winner
              const stagedWinner = displayWinners.find((w) => w.userId === submission.user?.id);

              return (
                <SubmissionItem
                  key={submission.id}
                  id={submission.id}
                  candidateName={submission.user ? `${submission.user.firstName} ${submission.user.lastName}` : "Unknown"}
                  candidateAvatar={submission.user?.profilePicture}
                  submittedDate={format(new Date(submission.createdAt), "MM/dd/yyyy")}
                  status={submission.status}
                  onView={() => setSelectedSubmission(submission)}
                  onSelectWinner={() => {
                    setSelectedSubmission(submission);
                    setInitialModalView('selectWinner');
                  }}
                  winnerPosition={stagedWinner?.position}
                  winnerAmount={stagedWinner?.amount}
                  currency={bounty.rewardCurrency}
                  onRemoveWinner={stagedWinner ? () => removeWinner(stagedWinner.position) : undefined}
                  isCompleted={isCompleted}
                />
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-500">No submissions found for this tab.</div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full bg-slate-800" />)}
        </div>
      )}
    </div>
  );
}
