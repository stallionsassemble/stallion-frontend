'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { BountyDistribution, BountySubmission } from "@/lib/types/bounties";
import { format } from "date-fns";
import { ArrowLeft, Check, Download, MessageSquare, RefreshCw, Star, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReadOnlyField } from "./bounty-read-only-field";

type ModalView = 'details' | 'selectWinner' | 'requestRevision';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission?: BountySubmission;
  bountyTitle: string;
  bountyDistribution?: BountyDistribution[];
  totalReward?: number;
  currency?: string;
  onWinnerSelected?: (winner: {
    submissionId: string;
    userId: string;
    name: string;
    avatar?: string;
    position: number;
    amount: number;
    feedback?: string;
    rating?: number;
  }) => void;
  takenPositions?: number[];
  initialView?: ModalView;
}

export function SubmissionModal({
  isOpen,
  onClose,
  submission,
  bountyTitle,
  bountyDistribution = [],
  totalReward = 0,
  currency = "USDC",
  onWinnerSelected,
  takenPositions = [],
  initialView = 'details'
}: SubmissionModalProps) {
  const [modalView, setModalView] = useState<ModalView>(initialView);

  // Sync modalView with initialView when modal opens
  useEffect(() => {
    if (isOpen) {
      setModalView(initialView);
    }
  }, [isOpen, initialView]);

  // Select Winner state
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  // Request Revision state
  const [revisionMessage, setRevisionMessage] = useState("");

  const { sendMessage } = useChatSocket();

  if (!submission) return null;

  const { user, submissionData, createdAt, status } = submission;
  const candidateName = user ? `${user.firstName} ${user.lastName}` : "Unknown Candidate";
  const candidateInitials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "??";
  const submittedDate = createdAt ? format(new Date(createdAt), "MM/dd/yyyy") : "N/A";

  const handleClose = () => {
    setModalView('details');
    setSelectedPosition("");
    setFeedback("");
    setRating(0);
    setRevisionMessage("");
    onClose();
  };

  const handleBack = () => {
    setModalView('details');
  };

  const getPositionAmount = (position: number): number => {
    if (!bountyDistribution || bountyDistribution.length === 0) return 0;
    const dist = bountyDistribution[position - 1];
    if (!dist) return 0;
    const percentage = Array.isArray(dist.percentage) ? dist.percentage[1] : dist.percentage;
    return (percentage / 100) * totalReward;
  };

  const availablePositions = bountyDistribution
    .map((_, idx) => idx + 1)
    .filter((pos) => !takenPositions.includes(pos));

  const handleConfirmWinner = () => {
    if (!selectedPosition || !user) {
      toast.error("Please select a position");
      return;
    }

    const position = parseInt(selectedPosition);
    const amount = getPositionAmount(position);

    onWinnerSelected?.({
      submissionId: submission.id,
      userId: user.id,
      name: candidateName,
      avatar: user.profilePicture,
      position,
      amount,
      feedback: feedback || undefined,
      rating: rating || undefined,
    });

    toast.success(`${candidateName} selected as ${position === 1 ? '1st' : position === 2 ? '2nd' : position === 3 ? '3rd' : `${position}th`} place winner!`);
    handleClose();
  };

  const handleSendRevision = async () => {
    if (!revisionMessage.trim() || !user) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const link = submission?.submissionLink ? `\n\nLink: ${submission.submissionLink}` : '';
      const formattedMessage = `**Revision Requested for ${bountyTitle}**${link}\n\n${revisionMessage}`;
      await sendMessage({ recipientId: user.id, content: formattedMessage });
      toast.success("Revision request sent!");
      handleClose();
    } catch (error) {
      toast.error("Failed to send revision request");
    }
  };

  // ===== RENDER SELECT WINNER VIEW =====
  const renderSelectWinnerView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative p-6 px-8 border-b border-white/5 bg-background">
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-white mb-1">Select Winner</h1>
          <p className="text-sm text-slate-500">Choose a prize for {candidateName}'s submission.</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6 flex-1 overflow-y-auto bg-[#09090b]/50">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-white/10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-slate-800 text-slate-400">{candidateInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FB923C] text-white hover:bg-[#FB923C] border-0 rounded h-5 px-2 text-[10px] font-bold uppercase tracking-wider">
                ⭐ Fair Payer
              </Badge>
            </div>
            <span className="text-base font-bold text-white mt-0.5">{candidateName}</span>
          </div>
        </div>

        {/* Position Select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-200">Select Position</Label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-full h-12 bg-[#0B0E14] border border-white/10 text-slate-300">
              <SelectValue placeholder="Choose a position" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0E14] border border-white/10">
              {availablePositions.map((pos) => {
                const currencySymbol = currency === 'XLM' ? '' : '$';
                return (
                  <SelectItem key={pos} value={pos.toString()} className="text-slate-300">
                    {pos === 1 ? '🥇 1st Place' : pos === 2 ? '🥈 2nd Place' : pos === 3 ? '🥉 3rd Place' : `${pos}th Place`}
                    {' - '}
                    {currencySymbol}{getPositionAmount(pos).toLocaleString()} {currency}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-200">Feedback</Label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore"
            className="min-h-[100px] bg-[#0B0E14] border border-white/10 text-slate-300 placeholder:text-slate-600 resize-none"
          />
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-slate-600"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-background grid grid-cols-2 gap-4">
        <Button
          variant="stallion-outline"
          className="h-12 border-primary hover:bg-background/60 w-full rounded-lg font-medium flex items-center justify-center gap-2"
          onClick={handleBack}
        >
          <X className="h-4 w-4" /> Cancel Selection
        </Button>
        <Button
          variant="stallion"
          className="h-12 w-full rounded-lg font-bold flex items-center justify-center gap-2"
          onClick={handleConfirmWinner}
          disabled={!selectedPosition}
        >
          <Trophy className="h-4 w-4" /> Confirm Winner
        </Button>
      </div>
    </div>
  );

  // ===== RENDER REQUEST REVISION VIEW =====
  const renderRequestRevisionView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative p-6 px-8 border-b border-white/5 bg-background">
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-white mb-1">Request Revision</h1>
          <p className="text-sm text-slate-500">Request revision for {candidateName}'s submission.</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6 flex-1 overflow-y-auto bg-[#09090b]/50">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-white/10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-slate-800 text-slate-400">{candidateInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FB923C] text-white hover:bg-[#FB923C] border-0 rounded h-5 px-2 text-[10px] font-bold uppercase tracking-wider">
                ⭐ Fair Payer
              </Badge>
            </div>
            <span className="text-base font-bold text-white mt-0.5">{candidateName}</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-200">Send message</Label>
          <Textarea
            value={revisionMessage}
            onChange={(e) => setRevisionMessage(e.target.value)}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            className="min-h-[140px] bg-[#0B0E14] border border-white/10 text-slate-300 placeholder:text-slate-600 resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-background flex justify-center">
        <Button
          variant="stallion"
          className="h-12 w-full max-w-sm rounded-lg font-bold flex items-center justify-center gap-2"
          onClick={handleSendRevision}
          disabled={!revisionMessage.trim()}
        >
          <RefreshCw className="h-4 w-4" /> Send Revision
        </Button>
      </div>
    </div>
  );

  // ===== RENDER DETAILS VIEW (ORIGINAL) =====
  const renderDetailsView = () => (
    <>
      {/* Header */}
      <div className="relative p-6 px-8 border-b border-white/5 bg-background">
        <div className="space-y-6">
          {/* User Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-[#0B0E14]">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-slate-800 text-slate-400">{candidateInitials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white mt-0.5">{candidateName}</span>
            </div>
          </div>

          {/* Title Block */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-1.5">{bountyTitle}</h1>
            <p className="text-xs text-slate-500 font-inter">
              Submitted by <span className="text-slate-300 font-medium">{candidateName}</span> on {submittedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-8 overflow-y-auto max-h-[65vh] space-y-7 bg-[#09090b]/50">
        {/* Main Submission Link */}
        {submission.submissionLink && (
          <ReadOnlyField
            label="Main Submission Link"
            subLabel="The primary link submitted for this bounty."
            value={submission.submissionLink}
            actionLink={submission.submissionLink}
            required
          />
        )}

        {/* Dynamic Fields */}
        {submission.submissionData && Object.entries(submission.submissionData).map(([key, value]) => {
          if (!value) return null;
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
          const isUrl = typeof value === 'string' && (value.startsWith('http') || value.startsWith('www'));
          return (
            <ReadOnlyField
              key={key}
              label={label}
              value={String(value)}
              isTextArea={String(value).length > 100 && !isUrl}
              actionLink={isUrl ? String(value) : undefined}
            />
          );
        })}

        {/* Attachments */}
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5">
            <Label className="text-sm font-medium text-slate-200">Additional Attachments</Label>
            <p className="text-[11px] text-slate-500 font-inter">Attached documents, screenshots, or files</p>
          </div>
          <div className="border border-dashed border-white/10 bg-[#0B0E14] rounded-xl p-6 min-h-[140px] flex items-center justify-center">
            {submissionData?.attachments && submissionData.attachments.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {submissionData.attachments.map((file: any, index: number) => (
                  <Link key={index} href={file.url} target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-[#12151C] border border-white/5 hover:border-white/20 transition-all group">
                    <div className="h-10 w-10 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium text-slate-300 truncate">{file.name || file.filename || `Attachment ${index + 1}`}</span>
                      <span className="text-[10px] text-slate-500">Click to download</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 opacity-50">
                <div className="h-12 w-12 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-medium text-slate-500 font-inter">No Files</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 bg-background grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          variant="stallion-outline"
          className="h-12 p-2 border-primary hover:bg-background/60 w-full rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4 shrink-0" />
          <span>Mark under review</span>
        </Button>
        <Button
          variant="stallion"
          className="h-12 w-full rounded-lg font-bold flex items-center justify-center gap-2 px-4"
          onClick={() => setModalView('selectWinner')}
        >
          <Trophy className="h-4 w-4 shrink-0" />
          <span>Confirm Winner</span>
        </Button>
        <Button
          variant="stallion-outline"
          className="h-12 border-primary hover:bg-background/60 w-full rounded-lg font-normal flex items-center justify-center gap-2 px-4"
          onClick={() => setModalView('requestRevision')}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span>Request Revision</span>
        </Button>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl bg-background border-border text-foreground p-0 gap-0 overflow-hidden shadow-2xl">
        {modalView === 'details' && renderDetailsView()}
        {modalView === 'selectWinner' && renderSelectWinnerView()}
        {modalView === 'requestRevision' && renderRequestRevisionView()}
      </DialogContent>
    </Dialog>
  );
}
