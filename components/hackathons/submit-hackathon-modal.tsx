/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Plus, Users, UserPlus, ChevronRight } from "lucide-react";
import { useSubmitProject, useCreateTeam, useJoinTeam } from "@/lib/api/hackathon/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubmitHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: string;
  hackathonTitle: string;
  isTeamBased: boolean;
  initialTeamId?: string;
}

export function SubmitHackathonModal({
  isOpen,
  onClose,
  hackathonId,
  hackathonTitle,
  isTeamBased,
  initialTeamId,
}: SubmitHackathonModalProps) {
  const [step, setStep] = useState<"team-setup" | "project-details">("project-details");
  const [teamMode, setTeamMode] = useState<"create" | "join" | null>(null);
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(initialTeamId);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const submitMutation = useSubmitProject();
  const createTeamMutation = useCreateTeam();
  const joinTeamMutation = useJoinTeam();

  useEffect(() => {
    setCurrentTeamId(initialTeamId);
    if (isTeamBased && !initialTeamId) {
      setStep("team-setup");
    } else {
      setStep("project-details");
    }
  }, [initialTeamId, isTeamBased, isOpen]);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    createTeamMutation.mutate({ 
      id: hackathonId, 
      payload: { name: teamName.trim() } 
    }, {
      onSuccess: () => {
        setStep("project-details");
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || '';
        if (message.toLowerCase().includes('already in a team') || message.toLowerCase().includes('already registered')) {
          setStep("project-details");
        }
      }
    });
  };

  const handleJoinTeam = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter an invitation code");
      return;
    }
    joinTeamMutation.mutate({ 
      id: hackathonId, 
      teamId: joinCode.trim() 
    }, {
      onSuccess: () => {
        setStep("project-details");
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || '';
        if (message.toLowerCase().includes('already in a team') || message.toLowerCase().includes('already registered')) {
          setStep("project-details");
        }
      }
    });
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
        projectName: title,
        description,
        submissionLink,
        repositoryUrl: githubUrl || undefined,
        videoUrl: videoUrl || undefined,
        teamId: currentTeamId || undefined,
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
    setTeamName("");
    setJoinCode("");
    setTeamMode(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 space-y-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-white font-syne tracking-tighter">
              {step === "team-setup" ? "Form Your Team" : "Submit Project"}
            </DialogTitle>
            <p className="text-gray-500 text-sm font-medium">
              {hackathonTitle}
            </p>
          </DialogHeader>

          {step === "team-setup" ? (
            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentTeamId ? (
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center space-y-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-xl">You're already in a team</h3>
                    <p className="text-gray-500">You are registered as a member for this hackathon.</p>
                  </div>
                  <Button 
                    onClick={() => setStep("project-details")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-14 rounded-2xl text-lg shadow-xl shadow-primary/20"
                  >
                    Continue to Submission
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-2">
                    <p className="text-white font-bold">This is a team-based hackathon.</p>
                    <p className="text-gray-500 text-sm">You need to be in a team to submit your project.</p>
                  </div>

                  {!teamMode ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setTeamMode("create")}
                        className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl transition-all hover:bg-white/10 hover:border-primary/50 group"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Plus className="h-7 w-7" />
                        </div>
                        <span className="text-white font-bold">Create Team</span>
                      </button>
                      <button 
                        onClick={() => setTeamMode("join")}
                        className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl transition-all hover:bg-white/10 hover:border-blue-500/50 group"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <UserPlus className="h-7 w-7" />
                        </div>
                        <span className="text-white font-bold">Join Team</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in-95">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                          {teamMode === "create" ? "Team Name" : "Invitation Code"}
                        </Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder={teamMode === "create" ? "Enter team name" : "Paste invitation code"}
                            value={teamMode === "create" ? teamName : joinCode}
                            onChange={(e) => teamMode === "create" ? setTeamName(e.target.value) : setJoinCode(e.target.value)}
                            className="bg-white/5 border-white/10 h-14 text-white rounded-2xl text-lg px-6"
                          />
                          <Button 
                            onClick={teamMode === "create" ? handleCreateTeam : handleJoinTeam}
                            disabled={createTeamMutation.isPending || joinTeamMutation.isPending}
                            className="h-14 px-8 rounded-2xl font-bold text-lg"
                          >
                            {(createTeamMutation.isPending || joinTeamMutation.isPending) ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <ChevronRight className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTeamMode(null)}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-400 text-xs uppercase tracking-widest font-bold">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's your project called?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 text-white rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-400 text-xs uppercase tracking-widest font-bold">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what you built..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border-white/10 min-h-[120px] text-white rounded-xl resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submissionLink" className="text-gray-400 text-xs uppercase tracking-widest font-bold">Demo Link *</Label>
                    <Input
                      id="submissionLink"
                      placeholder="https://yourapp.com"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 text-white rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-gray-400 text-xs uppercase tracking-widest font-bold">GitHub (Optional)</Label>
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-gray-400 text-xs uppercase tracking-widest font-bold">Video URL (Optional)</Label>
                  <Input
                    id="videoUrl"
                    placeholder="YouTube or Loom link"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 text-white rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 pt-0 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-white rounded-full px-8"
          >
            Cancel
          </Button>
          {step === "project-details" && (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-10 h-12 shadow-xl shadow-primary/20"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              Submit Entry
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
