"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Clock, Eye, RefreshCcw } from "lucide-react";

export type MilestoneStatus = "Paid" | "Submitted" | "Pending";

interface ProjectMilestoneCardProps {
  index: number;
  title: string;
  description: string;
  amount: number | string;
  currency: string;
  deadline?: string;
  dueDate?: string;
  paidDate?: string;
  status: MilestoneStatus | string;
  onViewSubmission?: () => void;
  onApprove?: () => void;
  onRequestRevision?: () => void;
  hasHiredTalent?: boolean;
}

export function ProjectMilestoneCard({
  index,
  title,
  description,
  amount,
  currency,
  deadline,
  dueDate,
  paidDate,
  status,
  onViewSubmission,
  onApprove,
  onRequestRevision,
  hasHiredTalent = false
}: ProjectMilestoneCardProps) {

  /* FAILSAFE: Normalize status to Title Case to handle API variations (SUBMITTED vs Submitted vs submitted) */
  const normalizeStatus = (s: string) => {
    if (!s) return "Pending";
    const lower = s.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const normalizedStatus = normalizeStatus(status as string);

  const statusColors: Record<string, string> = {
    Paid: "bg-green-500/10 text-green-500 border-green-500/20",
    Approved: "bg-green-500/10 text-green-500 border-green-500/20",
    Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    Submitted: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Pending: "bg-muted text-muted-foreground border-border"
  };

  const isCurrent = normalizedStatus === "Submitted"; // Highlight current milestone
  const isPaid = normalizedStatus === "Paid";

  return (
    <Card className={cn(
      "bg-card border-border transition-all hover:bg-accent/5",
      isCurrent ? "border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)] ring-1 ring-primary/20" : ""
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">

          {/* Number Circle */}
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border",
            isCurrent ? "bg-primary text-primary-foreground border-primary" :
              isPaid ? "bg-green-500/20 text-green-500 border-green-500/30" :
                "bg-muted text-muted-foreground border-transparent"
          )}>
            {index}
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-4">
              <h3 className="text-base font-bold text-foreground leading-tight break-words">{title}</h3>
              <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wide shrink-0", statusColors[normalizedStatus] || statusColors.Pending)}>
                {isPaid && <Check className="w-3 h-3 mr-1" />}
                {normalizedStatus}
              </Badge>
            </div>

            <p className="text-sm text-foreground/70 mb-3 break-words whitespace-pre-wrap">{description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">{amount} {currency}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>Due: {dueDate || deadline}</span>
              </div>
              {paidDate && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Paid: {paidDate}</span>
                </div>
              )}
            </div>

            {/* Actions visible if talent is hired AND milestone is not yet Paid (covers Pending & Submitted) */}
            {normalizedStatus !== "Paid" && hasHiredTalent && ( // Check against normalizedStatus
              <div className="flex gap-2 mt-5 flex-wrap">
                <Button
                  size="sm"
                  onClick={onViewSubmission}
                  className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" /> View Submissions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onApprove}
                  className="h-8 text-foreground hover:bg-accent hover:text-accent-foreground border-border bg-transparent shrink-0"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRequestRevision}
                  className="h-8 text-foreground hover:bg-accent hover:text-accent-foreground border-border bg-transparent shrink-0"
                >
                  <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> Request Revision
                </Button>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
