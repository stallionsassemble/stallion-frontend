import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ApplyProjectResponse } from "@/lib/types/project";
import { format } from "date-fns";
import { Clock, Download, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

interface ProjectSubmissionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplyProjectResponse | null;
}

export function ProjectSubmissionDetailsModal({
  open,
  onOpenChange,
  application
}: ProjectSubmissionDetailsModalProps) {
  if (!application) return null;

  const { user, coverLetter, estimatedCompletionTime, portfolioLinks, attachments, createdAt } = application;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-background border-border p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={user.profilePicture} alt={user.firstName} />
              <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {/* <Badge>Badge</Badge> placeholder if needed */}
                <span className="text-xs text-muted-foreground">Applied {format(new Date(createdAt), 'MMM dd, yyyy')}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h2>
            </div>
          </div>
          {/* Close is handled by DialogPrimitive but visual custom close can be added if design demands */}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* Cover Letter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Cover Letter</Label>
            <div className="bg-card/50 border border-input rounded-lg p-4 text-sm text-foreground/80 min-h-[120px] whitespace-pre-wrap">
              {coverLetter || "No cover letter provided."}
            </div>
          </div>

          {/* Estimated Completion Time */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Estimated Completion Time</Label>
            <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground/80 cursor-default">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              {estimatedCompletionTime} Days
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Portfolio Links</Label>
            {portfolioLinks && portfolioLinks.length > 0 ? (
              <div className="grid gap-2">
                {portfolioLinks.map((link, i) => (
                  <Link key={i} href={link} target="_blank" className="flex items-center justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-blue-500 hover:underline hover:bg-card/50 transition-colors">
                    <span className="truncate">{link}</span>
                    <ExternalLink className="h-4 w-4 ml-2 shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">No portfolio links provided.</div>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Attachments</Label>
            {attachments && attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file, i) => (
                  <Link key={i} href={file.url} target="_blank" className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors group">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">{file.size ? (file.size / 1024).toFixed(0) + ' KB' : 'Unknown size'}</p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">No attachments.</div>
            )}
          </div>

        </div>

        <div className="p-6 border-t border-border bg-background flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
