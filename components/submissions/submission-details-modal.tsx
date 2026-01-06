"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { KpiCard } from "@/components/ui/kpi-card";
import { useGetProjectMilestones } from "@/lib/api/projects/queries";
import { format } from "date-fns";
import { CalendarDays, Clock, Eye, FileUp, Pencil, Phone, Upload, X } from "lucide-react";
import { useState } from "react";
import { EditSubmissionModal } from "./edit-submission-modal";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

export function SubmissionDetailsModal({ isOpen, onClose, submission }: SubmissionDetailsModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isProject = submission?.details?.source === "PROJECT";
  const { data: milestones } = useGetProjectMilestones(isProject ? submission?.details?.id : "");

  // Submit Milestone Logic (Placeholder for now, or simple file input)
  // const { mutate: submitMilestone } = useSubmitMilestone();

  if (!submission) return null;

  const { details } = submission;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-background border border-border sm:max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0 block font-inter shadow-2xl">

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
                <DialogTitle className="text-xl sm:text-[32px] font-bold text-foreground mb-1 leading-tight">
                  {details.title || "Untitled"}
                </DialogTitle>
                <p className="text-[12px] text-muted-foreground mb-3 sm:mb-4">{details.orgName}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-muted hover:bg-muted/80 text-foreground border-0 h-6 px-3 rounded-full gap-1.5 font-normal">
                    <Eye className="w-3 h-3" />
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <KpiCard
                  label="Reward"
                  value={details.amount?.toLocaleString() || "0"}
                  valuePrefix=""
                  valueSuffix={details.currency || "USDC"}
                  activeColor="text-muted-foreground"
                  status={details.currency}
                  statusColor="text-foreground"
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-3xl"
                />

                <KpiCard
                  label="Submitted"
                  value={details.date ? format(new Date(details.date), "MMM d, yyyy") : "-"}
                  icon={CalendarDays}
                  status={details.status}
                  statusColor="text-yellow-500 font-medium"
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-xl"
                />

                <KpiCard
                  label="Last Updated"
                  value={details.updated ? format(new Date(details.updated), "MMM d, yyyy") : "-"}
                  icon={CalendarDays}
                  status="Active"
                  statusColor="text-foreground font-medium"
                  borderColor="hover:border-foreground/50"
                  valueClassName="text-xl"
                />
              </div>

              {/* Milestones for Projects */}
              {isProject && milestones && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="p-1 rounded"><Clock className="h-4 w-4 text-primary" /></span>
                    Milestones
                  </h3>
                  <div className="space-y-3">
                    {milestones.map((milestone: any, i: number) => (
                      <div key={i} className="border border-border bg-card rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">{milestone.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{milestone.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">{milestone.amount} {milestone.currency}</Badge>
                            <Badge variant="outline" className={`text-[10px] ${milestone.status === 'COMPLETED' ? 'text-green-500 border-green-500/20' :
                              milestone.status === 'PENDING' ? 'text-yellow-500 border-yellow-500/20' :
                                'text-muted-foreground border-border'
                              }`}>
                              {milestone.status}
                            </Badge>
                          </div>
                        </div>
                        {/* Action for Milestone if needed, e.g. Submit */}
                        {milestone.status === 'PENDING' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                            <Upload className="w-3 h-3" /> Submit
                          </Button>
                        )}
                      </div>
                    ))}
                    {milestones.length === 0 && (
                      <p className="text-sm text-muted-foreground">No milestones defined for this project.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Content Submission (Bounty Only or General?) */}
              {!isProject && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-inter text-foreground flex items-center gap-2">
                    <span className="p-1 rounded"><FileUp className="h-4 w-4 text-primary" /></span>
                    Content Submission
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Placeholder for now as file data isn't in unified details yet */}
                    <p className="text-sm text-muted-foreground col-span-3">No files attached.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-8 pt-0 mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
              {!isProject && (
                <Button
                  variant="stallion"
                  size="xl"
                  className="flex-1 w-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" /> Edit Submission
                </Button>
              )}
              <Button
                variant="stallion-outline"
                size="xl"
                className="flex-1 w-full"
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
