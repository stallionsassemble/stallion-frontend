"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectMilestone } from "@/lib/types/project";
import { ExternalLink, Star, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MilestoneReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: ProjectMilestone | null;
  applicant: {
    firstName: string;
    lastName: string;
    profilePicture: string;
  } | null;
  onApprove: (reviewNote: string) => void;
  onRequestRevision: (reviewNote: string) => void;
  isProcessing?: boolean;
}

export function MilestoneReviewModal({
  open,
  onOpenChange,
  milestone,
  applicant,
  onApprove,
  onRequestRevision,
  isProcessing = false
}: MilestoneReviewModalProps) {
  const [feedback, setFeedback] = useState("");

  if (!milestone || !applicant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-[#0A0A0B] border-white/10 p-0 gap-0 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="p-6 pb-4 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Milestone {milestone.milestone.order}
              </p>
              <DialogTitle className="text-xl md:text-2xl font-bold text-white leading-tight">
                {milestone.milestone.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Review the submitted work for this milestone</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Avatar className="h-12 w-12 border border-primary/20 ring-2 ring-background">
              <AvatarImage src={applicant.profilePicture} alt={applicant.firstName} />
              <AvatarFallback>{applicant.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full">
                  Fair Payer
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-white leading-none">
                {applicant.firstName} {applicant.lastName}
              </h3>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Description</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {milestone.submissionNote || "No specific notes provided with submission."}
            </p>
          </div>

          {/* Submission Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Submission Links</h4>
            {milestone.submissionUrl ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={milestone.submissionUrl}
                  target="_blank"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2 truncate"
                >
                  1. Link - {milestone.submissionUrl} <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No links provided.</p>
            )}
          </div>

          {/* Feedback Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback or audit findings here..."
              className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground resize-none focus-visible:ring-primary/50"
            />
          </div>

          {/* Additional Attachments */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Additional Attachments</h4>
            <div className="text-sm text-muted-foreground">No Attachments</div>
          </div>

          {/* Rating Placeholder (Visual Only as per image) */}
          <div className="flex justify-center py-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-6 h-6 text-blue-500 fill-blue-500" />)}
              <Star className="w-6 h-6 text-blue-500" />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-white/10 bg-[#0A0A0B] flex gap-4">
          <Button
            variant="outline"
            onClick={() => onRequestRevision(feedback)}
            disabled={isProcessing}
            className="flex-1 h-12 bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
          >
            <span className="mr-2">💬</span> Send Revision
          </Button>
          <Button
            onClick={() => onApprove(feedback)}
            disabled={isProcessing}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <span className="mr-2">✓</span> Approve
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
