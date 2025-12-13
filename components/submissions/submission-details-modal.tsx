"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { CalendarDays, Clock, ExternalLink, FileText, MessageSquare, Phone, X } from "lucide-react";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any; // Using any for mock flexibility, ideally defined interface
}

export function SubmissionDetailsModal({ isOpen, onClose, submission }: SubmissionDetailsModalProps) {
  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 block">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#09090B] border-b border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                {submission.title || "React Dashboard UI Design"}
              </DialogTitle>
              <p className="text-sm text-gray-400 mb-3">Solana Foundation</p>
              <div className="flex gap-2">
                <Badge className="bg-[#007AFF] hover:bg-[#007AFF] text-white border-0 h-6 px-3 rounded-full gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Bounty
                </Badge>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/10 text-orange-400 h-6 px-3 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Pending Review
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#050B1C] p-4">
              <span className="text-xs text-gray-400 block mb-1">Reward</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">$3,700</span>
                <span className="text-blue-500 font-bold">$</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">USDC</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#050B1C] p-4">
              <span className="text-xs text-gray-400 block mb-1">Submitted</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Jan 15, 2024</span>
                <CalendarDays className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-[10px] text-orange-400">Pending Review</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#050B1C] p-4">
              <span className="text-xs text-gray-400 block mb-1">Deadline</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Jan 20, 2024</span>
                <CalendarDays className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-[10px] text-blue-400">20 days left</span>
            </div>
          </div>

          {/* Content Submission */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#007AFF]" /> Content Submission
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#050B1C] group cursor-pointer hover:border-[#007AFF]/50 transition-colors">
                  <div className="h-8 w-8 rounded bg-blue-900/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-white truncate font-medium group-hover:text-[#007AFF]">Contract_Spec.pdf</span>
                    <span className="text-[10px] text-gray-500">2.4 MB</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-[#007AFF]" />
                </div>
              ))}
            </div>
          </div>

          {/* Bounty Progress */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#007AFF]" /> Bounty Progress
            </h3>
            <div className="relative pl-4 space-y-6 border-l border-white/10 ml-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-[#09090B]" />
                <div className="bg-[#050B1C] border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px]">Pending Review</Badge>
                    <span className="text-[10px] text-gray-500">Jan 10, 12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-blue-500" />
                    <span className="text-xs text-white font-medium">You</span>
                  </div>
                  <p className="text-xs text-gray-400">Submitted complete 3-part video series</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-[#09090B]" />
                <div className="bg-[#050B1C] border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">Revision Requested</Badge>
                    <span className="text-[10px] text-gray-500">Jan 10, 12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-gray-500" />
                    <span className="text-xs text-white font-medium">Stallion Foundation</span>
                  </div>
                  <p className="text-xs text-gray-400">Submitted complete 3-part video series</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#007AFF]" /> Latest Feedback
            </h3>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-gray-300 italic">
                "Perfect execution! Looking forward to more collaborations."
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#09090B] border-t border-white/10 p-4 flex gap-3">
          <Button className="flex-1 bg-[#007AFF] hover:bg-[#0066CC] h-10 gap-2">
            <FileText className="h-4 w-4" /> Edit Submission
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 h-10 gap-2 text-white">
            <Phone className="h-4 w-4" /> Contact Stallion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
