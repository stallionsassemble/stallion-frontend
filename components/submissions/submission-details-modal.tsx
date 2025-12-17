"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { CalendarDays, CheckCircle2, Clock, ExternalLink, Eye, FileText, MessageSquare, Pencil, Phone, X } from "lucide-react";
import { useState } from "react";
import { EditSubmissionModal } from "./edit-submission-modal";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

export function SubmissionDetailsModal({ isOpen, onClose, submission }: SubmissionDetailsModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!submission) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#02010A] border-[0.5px] border-[#404040] sm:max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0 block font-inter shadow-2xl">

          {/* Background Grid */}
          <div
            className="fixed inset-0 pointer-events-none z-0 opacity-20"
            style={{
              backgroundImage: "url('/grid-bg.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "auto"
            }}
          />

          <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between p-8 pb-4 shrink-0">
              <div>
                <DialogTitle className="text-3xl font-bold text-white mb-1">
                  {submission.title || "React Dashboard UI Design"}
                </DialogTitle>
                <p className="text-sm text-[#A1A1AA] mb-4">Solana Foundation</p>
                <div className="flex gap-2">
                  <Badge className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white border-0 h-6 px-3 rounded-full gap-1.5 font-normal">
                    <Eye className="w-3 h-3" />
                    Bounty
                  </Badge>
                  <Badge variant="outline" className="border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623] h-6 px-3 rounded-full flex items-center gap-1.5 font-normal">
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-8 pt-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Reward Card */}
                <div className="rounded-[14px] border border-[#404040] bg-[#0A0A0A] p-5 relative overflow-hidden group hover:border-[#007AFF]/50 transition-colors">
                  <span className="text-sm text-[#A1A1AA] block mb-2 font-medium">Reward</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">$3,700</span>
                    <span className="text-[#A1A1AA] text-lg">$</span>
                  </div>
                  <span className="text-xs text-[#007AFF] font-bold mt-1 block">USDC</span>
                </div>

                {/* Submitted Card */}
                <div className="rounded-[14px] border border-[#404040] bg-[#0A0A0A] p-5 relative overflow-hidden group hover:border-[#F5A623]/50 transition-colors">
                  <span className="text-sm text-[#A1A1AA] block mb-2 font-medium">Submitted</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">Jan 15, 2024</span>
                    <CalendarDays className="h-5 w-5 text-[#A1A1AA]" />
                  </div>
                  <span className="text-xs text-[#F5A623] font-medium mt-1 block">Pending Review</span>
                </div>

                {/* Deadline Card */}
                <div className="rounded-[14px] border border-[#404040] bg-[#0A0A0A] p-5 relative overflow-hidden group hover:border-[#007AFF]/50 transition-colors">
                  <span className="text-sm text-[#A1A1AA] block mb-2 font-medium">Deadline</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">Jan 20, 2024</span>
                    <CalendarDays className="h-5 w-5 text-[#A1A1AA]" />
                  </div>
                  <span className="text-xs text-[#007AFF] font-medium mt-1 block">20 days left</span>
                </div>
              </div>

              {/* Content Submission */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded bg-[#007AFF]/20"><FileText className="h-4 w-4 text-[#007AFF]" /></span>
                  Content Submission
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Contract_Specifications.pdf', size: '2.4 MB' },
                    { name: 'Contract_Specifications.pdf', size: '2.4 MB' }, // Duplicate for mockup
                    { name: 'Form Submission Details', size: '' },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#007AFF]/20 bg-[#007AFF]/5 group cursor-pointer hover:bg-[#007AFF]/10 transition-colors">
                      <div className="shrink-0">
                        <FileText className="h-5 w-5 text-[#007AFF]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs text-white truncate font-medium">
                          {file.name}
                        </span>
                        {file.size && (
                          <span className="text-[10px] text-[#A1A1AA]">
                            {file.size}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#007AFF]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bounty Progress (Timeline) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded bg-[#007AFF]/20"><Clock className="h-4 w-4 text-[#007AFF]" /></span>
                  Bounty Progress
                </h3>

                <div className="relative pl-2 ml-1">
                  {/* Vertical Line */}
                  <div className="absolute left-[3px] top-2 bottom-4 w-px bg-[#404040/50] bg-linear-to-b from-[#404040] to-transparent h-[85%]" />

                  <div className="space-y-8">
                    {/* Item 1 - Pending Review (You) */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F5A623] ring-4 ring-[#02010A] z-10" />
                      <div className="border border-[#404040] bg-[#0A0A0A] rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/20 text-[10px] h-5 font-normal flex gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Pending Review
                          </Badge>
                          <span className="text-[10px] text-[#71717A]">Jan 10, 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 w-4 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                            <span className="text-[8px] text-white">Y</span>
                          </div>
                          <span className="text-xs text-white font-medium">You</span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">Submitted complete 3-part video series</p>
                      </div>
                    </div>

                    {/* Item 2 - Revision Requested */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ABC978] ring-4 ring-[#02010A] z-10" />
                      <div className="border border-[#404040] bg-[#0A0A0A] rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-[#ABC978]/20 text-[#ABC978] border-[#ABC978]/20 text-[10px] h-5 font-normal flex gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Revision Requested
                          </Badge>
                          <span className="text-[10px] text-[#71717A]">Jan 10, 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 w-4 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                            <span className="text-[8px] text-white">S</span>
                          </div>
                          <span className="text-xs text-white font-medium">Stallion Foundation</span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">Submitted complete 3-part video series</p>
                      </div>
                    </div>

                    {/* Item 3 - Pending Review (You) */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F5A623] ring-4 ring-[#02010A] z-10" />
                      <div className="border border-[#404040] bg-[#0A0A0A] rounded-xl p-4">
                        {/* Simplified content for demonstration */}
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/20 text-[10px] h-5 font-normal flex gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Pending Review
                          </Badge>
                          <span className="text-[10px] text-[#71717A]">Jan 10, 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-white font-medium">You</span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">Submitted complete 3-part video series</p>
                      </div>
                    </div>

                    {/* Item 4 - Approved */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-[#4ADE80] ring-4 ring-[#02010A] z-10" />
                      <div className="border border-[#404040] bg-[#0A0A0A] rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/20 text-[10px] h-5 font-normal flex gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </Badge>
                          <span className="text-[10px] text-[#71717A]">Jan 10, 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-white font-medium">Stallion Foundation</span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">Submitted complete 3-part video series</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Feedback */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded bg-[#007AFF]/20"><MessageSquare className="h-4 w-4 text-[#007AFF]" /></span>
                  Latest Feedback
                </h3>
                <div className="pl-4 border-l-2 border-[#007AFF]">
                  <p className="text-sm text-[#E4E4E7]">Perfect execution! Looking forward to more collaborations.</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 pt-0 mt-4 flex gap-4 shrink-0">
              <Button
                className="flex-1 bg-[#007AFF] hover:bg-[#007AFF]/90 h-12 rounded-lg gap-2 text-white font-medium"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4" /> Edit Submission
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent border-[#404040] hover:bg-white/5 h-12 rounded-lg gap-2 text-white font-medium">
                <Phone className="h-4 w-4" /> Contact Stallion
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      <EditSubmissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        submission={submission}
      />
    </>
  );
}
