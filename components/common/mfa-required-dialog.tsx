"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

interface MfaRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MfaRequiredDialog({ open, onOpenChange }: MfaRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-orange-500" />
          </div>
          <DialogTitle className="text-center">Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            For your security, Two-Factor Authentication (2FA) must be enabled to perform this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col space-y-2 sm:space-y-0 mt-4 sm:flex-col sm:space-y-2">
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard/settings?tab=security" onClick={() => onOpenChange(false)}>
              Enable 2FA
            </Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
