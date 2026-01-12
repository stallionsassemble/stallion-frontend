"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/types";

interface HireTalentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: User | null;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export function HireTalentModal({
  open,
  onOpenChange,
  applicant,
  onConfirm,
  isConfirming = false
}: HireTalentModalProps) {
  if (!applicant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border-border p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-2 flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-white">Hire Talent</DialogTitle>
        </div>

        <div className="px-6 pb-6 space-y-1">
          <p className="text-muted-foreground">Confirm hiring {applicant.firstName} {applicant.lastName} for this project</p>
        </div>

        <div className="px-6 py-4 bg-muted/5 border-y border-border/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-primary/20">
              <AvatarImage src={applicant.profilePicture} alt={applicant.firstName} />
              <AvatarFallback>{applicant.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full">
                  Fair Payer
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white leading-none">
                {applicant.firstName} {applicant.lastName}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-muted-foreground mb-8">
            Once hired, this contributor will be able to start working on milestones. Other applicants will remain in the list but won't be able to be hired.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 border-primary/20 bg-transparent text-white hover:bg-primary/10 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel Selection
            </Button>
            <Button
              className="h-11"
              variant={'stallion'}
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Confirming..." : "Confirm Hire"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
