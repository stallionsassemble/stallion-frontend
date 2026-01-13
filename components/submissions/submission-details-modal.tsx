"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { KpiCard } from "@/components/ui/kpi-card";
import { useGetMyMilestones, useGetProjectActivity } from "@/lib/api/projects/queries";
import { format } from "date-fns";
import { CalendarDays, CheckCircle2, Clock, Eye, FileText, FileUp, Pencil, Phone, User, X } from "lucide-react";
import { useState } from "react";
import { EditSubmissionModal } from "./edit-submission-modal";
import { SubmitMilestoneModal } from "./submit-milestone-modal";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

export function SubmissionDetailsModal({ isOpen, onClose, submission }: SubmissionDetailsModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitMilestoneOpen, setIsSubmitMilestoneOpen] = useState(false);

  const isProject = submission?.details?.source === "PROJECT";
  const { data: activitiesData } = useGetProjectActivity(isProject ? submission?.details?.entityId : "");
  const { data: milestones } = useGetMyMilestones(isProject ? submission?.details?.entityId : "");

  const totalPaid = milestones?.reduce((acc: number, m: any) => {
    return m.status === 'APPROVED' ? acc + (Number(m.milestone.amount) || 0) : acc;
  }, 0) || 0;

  if (!submission) return null;

  const { details } = submission;

  // Map Activities to Timeline
  const timeline = (activitiesData?.data || [])
    .filter((activity: any) => {
      const isGlobal = ['PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_COMPLETED'].includes(activity.type);
      const isMine = activity.userId === submission.userId;
      // Also include if related to this application (e.g. accepted/rejected/milestone actions targeted at user)
      // Check metadata for application ID or target userId
      const isRelated = activity.metadata?.applicationId === submission.details.id ||
        activity.metadata?.userId === submission.userId;

      return isGlobal || isMine || isRelated;
    })
    .map((activity: any) => {
      const isMe = activity.userId === submission.userId;
      const isOwner = submission.details.ownerId && activity.userId === submission.details.ownerId;

      let userLabel = activity.user?.firstName || "System";
      if (isMe) userLabel = "You";
      else if (isOwner) userLabel = submission.details.orgName || "Stallion Foundation";

      return {
        status: activity.type.split('_').slice(1).join(' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()),
        user: userLabel,
        action: activity.message,
        date: format(new Date(activity.createdAt), "MMM d, h:mm a"),
        type: activity.type,
        isMe
      };
    });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent showCloseButton={false} className="bg-background border border-border sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 gap-0 block font-inter shadow-2xl">

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
            <div className="flex items-start justify-between p-4 sm:p-8 pb-4 shrink-0 border-b border-border">
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground mb-1 leading-tight">
                  {details.title || "Untitled"}
                </DialogTitle>
                <p className="text-[12px] text-muted-foreground mb-3 sm:mb-4">{details.orgName}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#0066CC] hover:bg-[#0066CC]/90 text-white border-0 h-6 px-3 rounded-full gap-1.5 font-normal">
                    {details.source === "BOUNTY" ? <FileText className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {details.source === "BOUNTY" ? "Bounty" : "Project"}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/20 text-yellow-500 h-6 px-3 rounded-full flex items-center gap-1.5 font-normal">
                    <Clock className="w-3 h-3" />
                    {details.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground -mr-2 -mt-2 sm:mr-0 sm:mt-0">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-4 sm:p-8 pt-4 space-y-6 sm:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <KpiCard
                  label="Reward"
                  value={details.amount?.toLocaleString() || "0"}
                  valuePrefix=""
                  valueSuffix={details.currency || "USDC"}
                  activeColor="text-muted-foreground"
                  status={details.currency}
                  statusColor="text-foreground"
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-2xl"
                  className="p-4"
                />

                <KpiCard
                  label="Submitted"
                  value={details.date ? format(new Date(details.date), "MMM d, yyyy") : "-"}
                  icon={CalendarDays}
                  status={details.status}
                  statusColor="text-yellow-500 font-medium"
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-lg"
                  className="p-4"
                />

                <KpiCard
                  label="Deadline"
                  value={details.deadline ? format(new Date(details.deadline), "MMM d, yyyy") : "-"}
                  icon={CalendarDays}
                  status={details.deadline ? `${Math.max(0, Math.ceil((new Date(details.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left` : "-"}
                  statusColor={isProject ? "text-red-500 font-medium" : "text-[#0066CC] font-medium"}
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-lg"
                  className="p-4"
                />
              </div>

              {/* Content Submission (Bounty) or Milestones (Project) */}
              {/* Milestones for Projects */}
              {/* Content Submission (Both) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-inter text-foreground flex items-center gap-2">
                  <span className="p-1 rounded"><FileUp className="h-4 w-4 text-[#0066CC]" /></span>
                  Content Submission
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.attachments && details.attachments.length > 0 ? (
                    details.attachments.map((file: any, idx: number) => (
                      <div key={idx} className="bg-[#0066CC]/10 border border-[#0066CC]/20 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="text-[#0066CC] h-4 w-4 shrink-0" />
                          {file.url ? (
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0066CC] truncate hover:underline">{file.filename}</a>
                          ) : (
                            <span className="text-xs text-[#0066CC] truncate">{file.filename || "Attachment"}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#0066CC]/60">{file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-2">No attachments submitted.</p>
                  )}
                </div>
              </div>

              {/* Milestones for Projects */}
              {isProject && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-inter text-foreground flex items-center gap-2">
                    <span className="p-1 rounded"><Clock className="h-4 w-4 text-[#0066CC]" /></span>
                    Milestones & Payments
                    <span className="ml-auto text-xs font-normal text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" /> Paid: <span className="text-foreground font-bold">{totalPaid.toLocaleString()} {details.currency}</span></span>
                  </h3>

                  <div className="space-y-3">
                    {milestones?.map((milestoneData: any, i: number) => {
                      const m = milestoneData.milestone;
                      return (
                        <div key={i} className="border border-white/10 bg-[#0A0A0A] rounded-xl p-4 flex items-center justify-between group hover:border-[#0066CC]/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${milestoneData.status === 'APPROVED' ? 'text-[#0066CC]' : 'text-muted-foreground'}`}>
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground mb-0.5">{m.title}</h4>
                              <p className="text-[10px] text-muted-foreground">Due: {format(new Date(m.dueDate), "MMM d")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-foreground">{m.amount} {m.project.currency}</span>
                            <Badge
                              variant="secondary"
                              className={`h-5 text-[9px] px-2 font-bold uppercase tracking-wider ${milestoneData.status === 'APPROVED' ? 'bg-[#193B2D] text-[#4ADE80] hover:bg-[#193B2D]' :
                                milestoneData.status === 'PENDING' ? 'bg-[#3B3419] text-[#FACC15] hover:bg-[#3B3419]' :
                                  'bg-[#1F1F22] text-[#A1A1AA] hover:bg-[#1F1F22]'
                                }`}
                            >
                              {milestoneData.status === 'APPROVED' ? 'Paid' : milestoneData.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                    {milestones?.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                        <p className="text-sm text-muted-foreground">No milestones found for this project.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-inter text-foreground flex items-center gap-2">
                  <span className="p-1 rounded"><Clock className="h-4 w-4 text-[#0066CC]" /></span>
                  {isProject ? "Project Progress" : "Bounty Progress"}
                </h3>

                <div className="relative pl-2 sm:pl-4">
                  {/* Timeline Vertical Line */}
                  <div className="absolute left-[7px] sm:left-[15px] top-6 bottom-6 w-[1px] bg-white/10"></div>

                  <div className="space-y-6">
                    {timeline.map((item, i) => (
                      <div key={i} className="relative pl-6 sm:pl-8">
                        {/* Timeline Dot */}
                        <div className={`absolute left-[3px] sm:left-[11px] top-[1.5rem] w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] ${item.type === 'PROJECT_COMPLETED' ? 'bg-green-500' :
                          item.type.includes('REJECTED') ? 'bg-red-500' :
                            'bg-[#0066CC]'
                          } z-10 box-content`}></div>

                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 hover:border-[#0066CC]/30 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline" className={`
                              border-white/10 h-6 px-2 font-normal gap-1.5
                              ${item.type === 'PROJECT_COMPLETED' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                item.type.includes('REJECTED') ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                                  'text-blue-400 bg-blue-400/10 border-blue-400/20'}
                            `}>
                              {item.type === 'PROJECT_COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {item.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{item.date}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-gray-300">{item.user}</span>
                          </div>

                          <p className="text-sm text-foreground leading-relaxed">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Feedback */}
              {details.feedback && (
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-inter text-foreground flex items-center gap-2">
                    <span className="p-1 rounded"><Pencil className="h-4 w-4 text-[#0066CC]" /></span>
                    Latest Feedback
                  </h3>
                  <div className="border-l-2 border-[#0066CC] pl-4 py-1">
                    <p className="text-sm text-gray-300">{details.feedback}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-8 pt-0 mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
              {isProject ? (
                <Button
                  variant="stallion"
                  size="lg"
                  className="flex-1 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsSubmitMilestoneOpen(true)}
                  disabled={details.status !== 'ACCEPTED' || details.projectStatus === 'COMPLETED' || details.projectStatus === 'CLOSED'}
                >
                  <FileUp className="h-4 w-4 mr-2" /> {details.projectStatus === 'COMPLETED' ? "Project Completed" : "Submit Milestone"}
                </Button>
              ) : (
                <Button
                  variant="stallion"
                  size="lg"
                  className="flex-1 w-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Submission
                </Button>
              )}

              <Button
                variant="stallion-outline"
                size="lg"
                className="flex-1 w-full border-white/10 hover:bg-white/5"
              >
                <Phone className="h-4 w-4 mr-2" /> Contact Stallion
              </Button>
            </div>
            {isProject && details.updated && (
              <p className="text-center text-[10px] text-muted-foreground pb-4 sm:pb-8 -mt-2">
                Last updated: {format(new Date(details.updated), "MMM d, yyyy h:mm a")}
              </p>
            )}
          </div>

        </DialogContent>
      </Dialog >

      <EditSubmissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        submission={submission}
      />

      <SubmitMilestoneModal
        isOpen={isSubmitMilestoneOpen}
        onClose={() => setIsSubmitMilestoneOpen(false)}
        milestones={milestones || []}
        projectId={details.id}
        projectTitle={details.title}
        milestoneAmount={details.amount}
        milestoneCurrency={details.currency}
      />
    </>
  );
}
