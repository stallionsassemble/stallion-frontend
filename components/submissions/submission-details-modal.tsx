"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { CalendarDays, CheckCircle2, Clock, ExternalLink, FileText, MessageSquare, Phone, X } from "lucide-react";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
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
              <p className="text-sm text-gray-400 mb-3">Stallion Foundation</p>
              <div className="flex gap-2">
                <Badge className="bg-primary hover:bg-primary text-white border-0 h-6 px-3 rounded-full gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  UI Project
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
              <span className="text-[10px] text-red-500 font-medium">Deadline passed</span>
            </div>
          </div>

          {/* Content Submission */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Content Submission
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#050B1C] group cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="h-8 w-8 rounded bg-blue-900/20 flex items-center justify-center">
                    {i === 3 ? <ExternalLink className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4 text-blue-400" />}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-white truncate font-medium group-hover:text-primary">
                      {i === 1 ? 'Design_System_v2.fig' : i === 2 ? 'Prototype_Recording.mp4' : 'Live Preview Link'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {i === 1 ? '12.4 MB' : i === 2 ? '48.2 MB' : 'figma.com/file/...'}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Milestones & Payments - NEW SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Milestones & Payments
              </h3>
              <span className="text-[10px] text-gray-400">Total: 2000 SOL</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#050B1C] overflow-hidden">
              {[
                { title: "Initial Design & Wireframes", amount: "500 SOL", status: "Paid", date: "Oct 12, 2023" },
                { title: "Frontend Development", amount: "500 SOL", status: "In Progress", date: "Oct 25, 2023" },
                { title: "Backend Integration", amount: "500 SOL", status: "Pending", date: "Nov 05, 2023" },
                { title: "Testing & Launch", amount: "500 SOL", status: "Pending", date: "Nov 15, 2023" },
              ].map((milestone, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 ${idx !== 3 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${milestone.status === 'Paid' ? 'border-primary bg-primary/20 text-primary' :
                      milestone.status === 'In Progress' ? 'border-orange-500 bg-orange-500/20 text-orange-500' : 'border-gray-600 bg-transparent text-gray-600'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${milestone.status === 'Paid' ? 'bg-primary' :
                        milestone.status === 'In Progress' ? 'bg-orange-500' : 'bg-gray-600'
                        }`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{milestone.title}</p>
                      <p className="text-[10px] text-gray-500">{milestone.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-xs font-bold">{milestone.amount}</span>
                    <Badge variant="secondary" className={`h-5 text-[10px] px-2 ${milestone.status === 'Paid' ? 'bg-primary/20 text-primary' :
                      milestone.status === 'In Progress' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-400'
                      }`}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bounty Progress */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Bounty Progress
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
              <MessageSquare className="h-4 w-4 text-primary" /> Latest Feedback
            </h3>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-gray-300 italic">
                "Perfect execution! Looking forward to more collaborations."
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#09090B] border-t border-white/10 p-4 flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-[#0066CC] h-10 gap-2">
            <ExternalLink className="h-4 w-4" /> View Project Details
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 h-10 gap-2 text-white">
            <Phone className="h-4 w-4" /> Contact Stallion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
