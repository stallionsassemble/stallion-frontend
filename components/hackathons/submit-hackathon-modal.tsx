"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Plus, X } from "lucide-react";
import { useSubmitProject } from "@/lib/api/hackathon/queries";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SubmitHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: string;
  hackathonTitle: string;
}

export function SubmitHackathonModal({
  isOpen,
  onClose,
  hackathonId,
  hackathonTitle,
}: SubmitHackathonModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const submitMutation = useSubmitProject();

  const handleAddMember = () => {
    if (member.trim() && !members.includes(member.trim())) {
      setMembers([...members, member.trim()]);
      setMember("");
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !submissionLink) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitMutation.mutate({
      id: hackathonId,
      payload: {
        title,
        description,
        submissionLink,
        repositoryUrl: githubUrl || undefined,
        videoUrl: videoUrl || undefined,
        // members: members.length > 0 ? members : undefined, // Backend doesn't seem to support members in this DTO yet
      },
    }, {
      onSuccess: () => {
        onClose();
        resetForm();
      },
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubmissionLink("");
    setGithubUrl("");
    setVideoUrl("");
    setMembers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Submit Project
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Submit your project for <span className="text-primary font-medium">{hackathonTitle}</span>
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter your project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project, the problem it solves, and how it works..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submissionLink" className="text-foreground">Project URL / Demo Link *</Label>
              <Input
                id="submissionLink"
                placeholder="https://..."
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-foreground">GitHub Repository (Optional)</Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground">Video Demo URL (Optional)</Label>
            <Input
              id="videoUrl"
              placeholder="YouTube, Loom, or Vimeo link"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Team Members (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter member name or email"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                className="bg-background border-border"
              />
              <Button type="button" variant="secondary" onClick={handleAddMember}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map((m, i) => (
                <Badge key={i} variant="secondary" className="gap-1 px-2 py-1">
                  {m}
                  <button onClick={() => removeMember(i)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
