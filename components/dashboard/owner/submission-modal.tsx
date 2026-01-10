'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BountySubmission } from "@/lib/types/bounties";
import { format } from "date-fns";
import { Check, Download, MessageSquare, Trophy, X } from "lucide-react";
import Link from "next/link";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission?: BountySubmission;
  bountyTitle: string;
}

const ReadOnlyField = ({
  label,
  subLabel,
  value,
  prefix = "https://",
  actionLink,
  isTextArea = false,
  required = false
}: {
  label: string,
  subLabel?: string,
  value?: string,
  prefix?: string,
  actionLink?: string,
  isTextArea?: boolean,
  required?: boolean
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-0.5">
        <Label className="text-sm font-medium text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {subLabel && <p className="text-[11px] text-slate-500 font-inter">{subLabel}</p>}
      </div>

      {isTextArea ? (
        <div className="bg-[#0B0E14] border border-white/5 rounded-lg p-3 text-sm text-slate-400 min-h-[100px] whitespace-pre-wrap leading-relaxed font-inter">
          {value || "No content provided."}
        </div>
      ) : (
        <div className="flex items-center h-11 bg-[#0B0E14] border border-white/5 rounded-lg overflow-hidden transition-colors hover:border-white/10 group">
          {prefix && (
            <div className="h-full px-3 flex items-center justify-center border-r border-white/5 bg-[#12151C] text-slate-500 text-xs font-mono select-none">
              {prefix}
            </div>
          )}
          <div className="flex-1 px-3 text-sm text-slate-300 truncate font-inter">
            {value ? value.replace(prefix, "") : "Not provided"}
          </div>
        </div>
      )}

      {actionLink && value && (
        <Link
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          className="inline-flex items-center text-[#3B82F6] text-[11px] font-medium hover:underline mt-1"
        >
          View Submission
        </Link>
      )}
    </div>
  );
};

export function SubmissionModal({ isOpen, onClose, submission, bountyTitle }: SubmissionModalProps) {
  if (!submission) return null;

  const { user, submissionData, createdAt, status } = submission;
  const candidateName = user ? `${user.firstName} ${user.lastName}` : "Unknown Candidate";
  const candidateInitials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "??";
  const submittedDate = createdAt ? format(new Date(createdAt), "MM/dd/yyyy") : "N/A";

  // Data Mapping
  const mainProjectUrl = submissionData?.liveDemo || submission.submissionLink;
  const xPostUrl = submissionData?.xPostUrl;
  const githubUrl = submissionData?.githubRepo;
  const description = submissionData?.description;
  const interestingUpdate = submissionData?.interestingUpdate; // Assuming this might be a field
  const usefulLinks = submissionData?.usefulLinks;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-[#09090b] border-white/10 text-white p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 px-8 border-b border-white/5 bg-[#09090b]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="space-y-6">
            {/* User Identity */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-[#0B0E14]">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-slate-800 text-slate-400">{candidateInitials}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  {/* Status badging if needed */}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#FB923C] text-white hover:bg-[#FB923C] border-0 rounded h-4 px-1.5 text-[9px] font-bold uppercase tracking-wider">Fair Payer</Badge>
                </div>
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

          <ReadOnlyField
            label="Main Project URL"
            subLabel="Share the primary link where your project can be viewed or accessed."
            value={mainProjectUrl}
            actionLink={mainProjectUrl}
            required
          />

          <ReadOnlyField
            label="X (Twitter) Post URL"
            subLabel="Optional: Add the link to your X post about this project to help others discover it."
            value={xPostUrl}
            actionLink={xPostUrl}
          />

          <ReadOnlyField
            label="Provide a public GitHub link to your project repository"
            subLabel="Provide the public link to your codebase or repository."
            value={githubUrl}
            actionLink={githubUrl}
            required
          />

          {/* Fallback for other potential fields in design */}
          <ReadOnlyField
            label="Project Link (if live)"
            subLabel="If your project is already deployed, share the live link here."
            value={mainProjectUrl} // Re-using for demo matching design structure
            actionLink={mainProjectUrl}
            required
          />

          <ReadOnlyField
            label="Description of project (250 characters or less)"
            value={description}
            isTextArea
            required
          />

          <ReadOnlyField
            label="What makes your project interesting/different (1000 characters or less)"
            value={interestingUpdate || description} // Fallback to description for demo
            isTextArea
            required
          />

          <div className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <Label className="text-sm font-medium text-slate-200">
                Additional Attachments (Optional) <span className="text-red-500">*</span>
              </Label>
              <p className="text-[11px] text-slate-500 font-inter">Attach relevant documents, screenshots, or files (max 5 files)</p>
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
        <div className="p-6 border-t border-white/10 bg-[#0B0E14] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="h-12 border-slate-700 text-slate-200 bg-transparent hover:bg-white/5 hover:text-white w-full rounded-lg font-medium">
            <Check className="h-4 w-4 mr-2" /> Mark under review
          </Button>
          <Button className="h-12 bg-[#3B82F6] hover:bg-blue-600 text-white w-full rounded-lg font-bold shadow-lg shadow-blue-900/20">
            <Trophy className="h-4 w-4 mr-2" /> Confirm Winner
          </Button>
          <Button variant="outline" className="h-12 border-slate-700 text-slate-200 bg-transparent hover:bg-white/5 hover:text-white w-full rounded-lg font-medium">
            <MessageSquare className="h-4 w-4 mr-2" /> Request Revision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
