/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Plus, Users, UserPlus, ChevronRight, ImagePlus, X } from "lucide-react";
import { uploadService } from "@/lib/api/upload";
import { useSubmitProject, useCreateTeam, useJoinTeam } from "@/lib/api/hackathon/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApplicationFormFields } from "@/components/hackathons/application-form-fields";
import { ApplicationAnswers, ApplicationQuestion, validateAnswers } from "@/lib/hackathon-form";

interface SubmitHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: string;
  hackathonTitle: string;
  isTeamBased: boolean;
  initialTeamId?: string;
  /** The hackathon's tracks. When there are any, the submission must pick one. */
  tracks?: string[];
  /** Extra questions the admin added for submissions, e.g. a pitch deck link. */
  submissionQuestions?: ApplicationQuestion[];
}

export function SubmitHackathonModal({
  isOpen,
  onClose,
  hackathonId,
  hackathonTitle,
  isTeamBased,
  initialTeamId,
  tracks = [],
  submissionQuestions = [],
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
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [extraAnswers, setExtraAnswers] = useState<ApplicationAnswers>({});
  const [extraErrors, setExtraErrors] = useState<Record<string, string>>({});
  const [track, setTrack] = useState<string>(tracks.length === 1 ? tracks[0] : "");

  // When the admin defines their own submission questions, GitHub, video and the like come from there.
  const hasCustomForm = submissionQuestions.length > 0;

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

  const MAX_SCREENSHOTS = 5;
  const MAX_IMAGE_MB = 5;

  const handleScreenshots = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;

    const room = MAX_SCREENSHOTS - screenshots.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_SCREENSHOTS} images`);
      return;
    }
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_IMAGE_MB * 1024 * 1024);
    if (valid.length < files.length) {
      toast.error(`Only images up to ${MAX_IMAGE_MB} MB are allowed`);
    }
    const batch = valid.slice(0, room);
    if (batch.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(batch.map((file) => uploadService.uploadImage(file)));
      setScreenshots((prev) => [...prev, ...uploaded.map((u) => u.url)]);
    } catch {
      toast.error("Could not upload an image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !submissionLink) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (tracks.length > 0 && !track) {
      toast.error("Choose a track for your project");
      return;
    }

    const problems = validateAnswers(submissionQuestions, extraAnswers);
    setExtraErrors(problems);
    if (Object.keys(problems).length > 0) {
      toast.error("Please fix the highlighted questions");
      return;
    }

    const submissionData: Record<string, unknown> = {};
    if (screenshots.length > 0) submissionData.images = screenshots;
    if (submissionQuestions.length > 0) submissionData.answers = extraAnswers;

    submitMutation.mutate({
      id: hackathonId,
      payload: {
        title,
        projectName: title,
        description,
        submissionLink,
        repositoryUrl: githubUrl.trim() || undefined,
        videoUrl: videoUrl || undefined,
        teamId: currentTeamId || undefined,
        track: track || undefined,
        submissionData: Object.keys(submissionData).length > 0 ? submissionData : undefined,
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
    setTrack(tracks.length === 1 ? tracks[0] : "");
    setScreenshots([]);
    setExtraAnswers({});
    setExtraErrors({});
    setTeamName("");
    setJoinCode("");
    setTeamMode(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 overflow-hidden p-0 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-black text-white font-syne tracking-tighter">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => setTeamMode("create")}
                        className="flex flex-col items-center gap-4 p-5 sm:p-8 bg-white/5 border border-white/10 rounded-3xl transition-all hover:bg-white/10 hover:border-primary/50 group"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Plus className="h-7 w-7" />
                        </div>
                        <span className="text-white font-bold">Create Team</span>
                      </button>
                      <button 
                        onClick={() => setTeamMode("join")}
                        className="flex flex-col items-center gap-4 p-5 sm:p-8 bg-white/5 border border-white/10 rounded-3xl transition-all hover:bg-white/10 hover:border-blue-500/50 group"
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

                {tracks.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Track *</Label>
                    <div className="flex flex-wrap gap-2">
                      {tracks.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTrack(t)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            track === t
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Pick the track your project belongs to.</p>
                  </div>
                )}

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
                  {!hasCustomForm && (
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
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Screenshots (Optional)</Label>
                  <div className="flex flex-wrap gap-3">
                    {screenshots.map((url) => (
                      <div key={url} className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Project screenshot" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="Remove image"
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white hover:bg-black"
                          onClick={() => setScreenshots((prev) => prev.filter((u) => u !== url))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {screenshots.length < MAX_SCREENSHOTS && (
                      <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-gray-400 hover:bg-white/5">
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={isUploading}
                          onChange={handleScreenshots}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Up to {MAX_SCREENSHOTS} images, {MAX_IMAGE_MB} MB each.</p>
                </div>

                {submissionQuestions.length > 0 && (
                  <ApplicationFormFields
                    questions={submissionQuestions}
                    answers={extraAnswers}
                    onChange={setExtraAnswers}
                    errors={extraErrors}
                    disabled={submitMutation.isPending}
                  />
                )}

                {!hasCustomForm && (
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
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/10 p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-white rounded-full px-8 h-12"
          >
            Cancel
          </Button>
          {step === "project-details" && (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || isUploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-10 h-12 shadow-xl shadow-primary/20 sm:min-w-[170px]"
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
