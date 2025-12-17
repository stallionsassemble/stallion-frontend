"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { CalendarDays, CheckCircle2, Clock, ExternalLink, Eye, FileText, FileUp, MessageCircle, Pencil, Phone, X } from "lucide-react";
import { useState } from "react";
import { EditSubmissionModal } from "./edit-submission-modal";

import { KpiCard } from "@/components/ui/kpi-card";

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
            <div className="flex items-start justify-between p-8 pb-4 shrink-0 border-b border-[#007AFF3B]">
              <div>
                <DialogTitle className="text-[32px] font-bold text-white mb-1">
                  {submission.title || "React Dashboard UI Design"}
                </DialogTitle>
                <p className="text-[12px] text-white mb-4">Solana Foundation</p>
                <div className="flex gap-2">
                  <Badge className="bg-[#007AFF]/47 hover:bg-[#007AFF]/47 text-white border-0 h-6 px-3 rounded-full gap-1.5 font-normal">
                    <Eye className="w-3 h-3" />
                    Bounty
                  </Badge>
                  <Badge variant="outline" className="border-[#FFD19A] bg-[#FFD19A]/20 text-[#FFD19A] h-6 px-3 rounded-full flex items-center gap-1.5 font-normal">
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
                <KpiCard
                  label="Reward"
                  value="3,700"
                  valuePrefix="$"
                  valueSuffix="$"
                  activeColor="text-[#A1A1AA]"
                  status="USDC"
                  statusColor="text-[#007AFF]"
                  borderColor="hover:border-[#007AFF]/50"
                  valueClassName="text-3xl"
                />

                <KpiCard
                  label="Submitted"
                  value="Jan 15, 2024"
                  icon={CalendarDays}
                  status="Pending Review"
                  statusColor="text-[#FFD19A] font-medium"
                  borderColor="hover:border-[#007AFF]/50"
                  valueClassName="text-xl"
                />

                <KpiCard
                  label="Deadline"
                  value="Jan 20, 2024"
                  icon={CalendarDays}
                  status="20 days left"
                  statusColor="text-[#007AFF] font-medium"
                  borderColor="hover:border-[#007AFF]/50"
                  valueClassName="text-xl"
                />
              </div>

              {/* Content Submission */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-inter text-white flex items-center gap-2">
                  <span className="p-1 rounded"><FileUp className="h-4 w-4 text-[#007AFF]" /></span>
                  Content Submission
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Contract_Specifications.pdf', size: '2.4 MB' },
                    { name: 'Contract_Specifications.pdf', size: '2.4 MB' }, // Duplicate for mockup
                    { name: 'Form Submission Details', size: '' },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0C62C024] group cursor-pointer hover:bg-[#0C62C024]/20 transition-colors">
                      <div className="shrink-0">
                        <FileText className="h-5 w-5 text-[#007AFF]" />
                      </div>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs text-white truncate font-medium">
                          {file.name}
                        </span>
                        {file.size && (
                          <span className="text-[10px] text-[#A1A1AA] shrink-0">
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
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded"><Clock className="h-4 w-4 text-[#007AFF]" /></span>
                  Bounty Progress
                </h3>

                <div className="relative pl-2 ml-1">
                  {/* Vertical Line */}
                  <div className="absolute left-[3px] top-2 bottom-4 w-px bg-[#404040/50] bg-linear-to-b from-[#404040] to-transparent h-[85%]" />

                  <div className="space-y-4">
                    {[
                      { status: "Pending Review", color: "#F5A623", date: "Jan 10, 12:00 PM", author: "You", authorInitial: "Y", content: "Submitted complete 3-part video series" },
                      { status: "Revision Requested", color: "#ABC978", date: "Jan 10, 12:00 PM", author: "Stallion Foundation", authorInitial: "S", content: "Please update the intro." },
                      { status: "Pending Review", color: "#F5A623", date: "Jan 11, 09:00 AM", author: "You", authorInitial: "Y", content: "Updated intro as requested." },
                      { status: "Approved", color: "#4ADE80", date: "Jan 12, 02:00 PM", author: "Stallion Foundation", authorInitial: "S", content: "Looks great, approved!" },
                    ].map((item, i) => (
                      <div key={i} className="relative pl-5">
                        <div
                          className="absolute left-[-5.5px] top-1.5 h-1.5 w-1.5 rounded-full ring-4 ring-[#02010A] z-10"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="border border-[#404040] bg-[#0A0A0A] rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <Badge
                              variant="secondary"
                              className="border text-[10px] h-5 font-normal flex gap-1 bg-opacity-20"
                              style={{
                                backgroundColor: `${item.color}33`, // 20% opacity hex
                                borderColor: `${item.color}33`,
                                color: item.color
                              }}
                            >
                              <CheckCircle2 className="w-3 h-3" /> {item.status}
                            </Badge>
                            <span className="text-[10px] text-[#71717A]">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-4 w-4 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                              <span className="text-[8px] text-white">{item.authorInitial}</span>
                            </div>
                            <span className="text-xs text-white font-medium">{item.author}</span>
                          </div>
                          <p className="text-xs text-[#A1A1AA]">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Feedback */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded"><MessageCircle className="h-4 w-4 text-[#007AFF]" /></span>
                  Latest Feedback
                </h3>
                <div className="pl-[10px] pr-[10px] pt-[13px] pb-[13px] border-l-2 border-[#113264] rounded-[8.24px]">
                  <p className="text-sm text-[#E4E4E7]">Perfect execution! Looking forward to more collaborations.</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 pt-0 mt-4 flex gap-4 shrink-0">
              <Button
                variant="stallion"
                size="xl"
                className="flex-1"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4" /> Edit Submission
              </Button>
              <Button
                variant="stallion-outline"
                size="xl"
                className="flex-1"
              >
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
