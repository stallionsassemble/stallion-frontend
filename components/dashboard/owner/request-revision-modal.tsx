"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";

interface RequestRevisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: {
    firstName: string;
    lastName: string;
    profilePicture: string;
  } | null;
  onSend: (message: string) => void;
  isProcessing?: boolean;
}

export function RequestRevisionModal({
  open,
  onOpenChange,
  applicant,
  onSend,
  isProcessing = false
}: RequestRevisionModalProps) {
  const [message, setMessage] = useState("");

  if (!applicant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border-white/10 p-0 gap-0 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="p-6 pb-2 relative">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                Request Revision
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Request revision for {applicant.firstName} {applicant.lastName}&apos;s submission.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-primary/20 ring-2 ring-background">
              <AvatarImage src={applicant.profilePicture} alt={applicant.firstName} />
              <AvatarFallback>{applicant.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full">
                  Fair Payer
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-white leading-none">
                {applicant.firstName} {applicant.lastName}
              </h3>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 mx-6 mb-6" />

        {/* Message Input */}
        <div className="px-6 pb-6 space-y-3">
          <Label className="text-sm font-medium text-white">Send message</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the changes needed..."
            className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground resize-none focus-visible:ring-blue-500/50"
          />
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex justify-center">
          <Button
            onClick={() => onSend(message)}
            disabled={isProcessing || !message.trim()}
            className="w-[200px] h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            <span className="mr-2">💬</span> Send Revision
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
