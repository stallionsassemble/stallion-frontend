'use client'

import { SubmissionItem } from "@/components/dashboard/owner/submission-item";
import { SubmissionModal } from "@/components/dashboard/owner/submission-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBounty, useGetSubmissions } from "@/lib/api/bounties/queries";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, BadgeDollarSign, Briefcase, Calendar, Clock, Edit, FileText, Filter, Gift, MessageSquare, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BountyDetailsPage() {
  const params = useParams<{ id: string }>();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: bounty, isLoading: isLoadingBounty } = useGetBounty(params.id);
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useGetSubmissions(params.id);

  if (isLoadingBounty) {
    return <div className="p-10 text-white">Loading Bounty...</div>;
  }

  if (!bounty) {
    return <div className="p-10 text-white">Bounty not found</div>;
  }

  const filteredSubmissions = submissions.filter((sub: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "review") return sub.status === "PENDING" || sub.status === "UNDER_REVIEW"; // Adjust based on actual API enum
    if (activeTab === "winners") return sub.status === "ACCEPTED" || sub.status === "WINNER";
    return true;
  });

  const tabs = [
    { id: "all", label: `All Submission (${submissions.length})` },
    { id: "review", label: `In Review (${submissions.filter((s: any) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length})` },
    { id: "winners", label: `Winners (${submissions.filter((s: any) => s.status === "ACCEPTED" || s.status === "WINNER").length})` }
  ];

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1600px] mx-auto pb-20 relative">
      <SubmissionModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
        bountyTitle={bounty.title}
      />

      {/* Back Nav */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/project-owner/bounties">
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Bounties
          </Button>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Actions can be dynamic based on owner status */}
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <Badge className="bg-[#FFE500] hover:bg-[#FFE500] text-black font-bold mb-4 rounded-full px-3">{bounty.status}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{bounty.title}</h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-foreground/70 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <Briefcase className="h-3 w-3 text-primary" />
                </div>
                <span className="text-foreground/70">{bounty.owner?.firstName || "Stallion"} {bounty.owner?.lastName || "Foundation"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">{bounty.applicationCount || 0} Applicants</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Due {bounty.submissionDeadline ? format(new Date(bounty.submissionDeadline), "MMM dd") : "TBD"}</span>
              </div>
              {/* 
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Submission Open</span>
              </div> 
              */}
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">{submissions.length} Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Bounty</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {bounty.skills?.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground hover:bg-primary/20 border-0 px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
            {/* Escrowed logic if available in Bounty type, else hide or duplicate reward */}
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

            <Button variant="outline" size="sm" className="bg-background border-border text-foreground hover:text-white gap-2">
              <Filter className="h-4 w-4" /> More Filter
            </Button>
          </div>

          {!isLoadingSubmissions ? (
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission: any) => (
                  <SubmissionItem
                    key={submission.id}
                    id={submission.id}
                    candidateName={submission.user ? `${submission.user.firstName} ${submission.user.lastName}` : "Unknown"}
                    candidateAvatar={submission.user?.profilePicture}
                    submittedDate={format(new Date(submission.createdAt), "MM/dd/yyyy")}
                    status={submission.status}
                    onView={() => setSelectedSubmission(submission)}
                  />
                ))
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

        {/* Right Sidebar - Prize Info */}
        <div className="w-full lg:w-[360px] space-y-6">
          <div className="rounded-xl border-[0.69px] border-primary bg-card overflow-hidden font-inter">
            <div className="p-6 text-center border-b border-[1.16px] border-primary/30 bg-primary/10">
              <div className="flex justify-center mb-2">
                <BadgeDollarSign className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Prizes</p>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-4xl font-bold text-foreground">{bounty.rewardCurrency === 'XLM' ? '' : '$'}{Number(bounty.reward).toLocaleString()}</h2>
                <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 rounded-full px-3 py-1 text-sm font-medium self-center mt-1">
                  {bounty.rewardCurrency}
                </Badge>
              </div>
            </div>

            {/* If distribution exists, render dynamically, else fallback or hide */}
            {/* Distribution Logic */}
            {(() => {
              const distList = bounty.distribution || bounty.rewardDistribution;
              const totalReward = Number(bounty.reward || 0);

              if (distList && distList.length > 0) {
                return (
                  <div className="p-4 space-y-3">
                    {distList.map((dist, idx) => {
                      // Handle both single number and array (though type says number | number[], usually number for rank)
                      const percentage = typeof dist.percentage === 'number' ? dist.percentage : 0;
                      const amount = (percentage / 100) * totalReward;
                      const currencySymbol = bounty.rewardCurrency === 'XLM' ? '' : '$';

                      return (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}</span>
                            <span className="text-sm font-medium text-muted-foreground">{idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} Place</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-foreground">
                              {currencySymbol}{amount.toLocaleString()} {bounty.rewardCurrency}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return (
                <div className="p-4 space-y-3">
                  <p className="text-center text-sm text-muted-foreground">Distribution details available in description.</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
