import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProject, useUpdateProject } from "@/lib/api/projects/queries";
import { uploadService } from "@/lib/api/upload";
import { useGetWalletBalances } from "@/lib/api/wallet/queries";
import { useFormPersist } from "@/lib/hooks/use-form-persist";
import { BountyAttachment } from "@/lib/types/bounties"; // Reusing attachment type
import { CreateProjectPayload, Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { InsufficientBalanceModal } from "./insufficient-balance-modal";
// ... (imports remain)

// ...



interface CreateProjectModalProps {
  children?: React.ReactNode;
  existingProject?: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_TAGS = ["Frontend", "Backend", "Ui/UX Design", "Writing", "Digital Marketing"];

interface Milestone {
  title: string;
  amount: string;
  description: string; // implied simple description
  dueDate: string; // ISO
}

export function CreateProjectModal({ children, existingProject, open: controlledOpen, onOpenChange: setControlledOpen }: CreateProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [peopleNeeded, setPeopleNeeded] = useState(1);
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [projectType, setProjectType] = useState<"GIG" | "JOB">("GIG");

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [startMilestoneTitle, setStartMilestoneTitle] = useState("");
  const [startMilestoneAmount, setStartMilestoneAmount] = useState("");
  const [startMilestoneDescription, setStartMilestoneDescription] = useState("");
  const [startMilestoneDueDate, setStartMilestoneDueDate] = useState<Date | undefined>(undefined);


  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Documents/Attachments
  const [attachments, setAttachments] = useState<BountyAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: walletData } = useGetWalletBalances();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const isPending = isCreating || isUpdating;

  // Draft Persistence
  const draftValues = {
    title,
    description,
    requirements,
    deliverables,
    peopleNeeded,
    budget,
    currency,
    deadline: deadline ? deadline.toISOString() : undefined,
    projectType,
    milestones,
    startMilestoneTitle,
    startMilestoneAmount,
    startMilestoneDescription,
    startMilestoneDueDate: startMilestoneDueDate ? startMilestoneDueDate.toISOString() : undefined,
    selectedTags,
    attachments
  };

  const { clearDraft } = useFormPersist(
    "draft_project_create",
    draftValues,
    (data: any) => {
      if (!existingProject) {
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.requirements) setRequirements(data.requirements);
        if (data.deliverables) setDeliverables(data.deliverables);
        if (data.peopleNeeded) setPeopleNeeded(data.peopleNeeded);
        if (data.budget) setBudget(data.budget);
        if (data.currency) setCurrency(data.currency);
        if (data.deadline) setDeadline(new Date(data.deadline));
        if (data.projectType) setProjectType(data.projectType);
        if (data.milestones) setMilestones(data.milestones);
        if (data.selectedTags) setSelectedTags(data.selectedTags);
        if (data.attachments) setAttachments(data.attachments);

        // Restore active milestone inputs too
        if (data.startMilestoneTitle) setStartMilestoneTitle(data.startMilestoneTitle);
        if (data.startMilestoneAmount) setStartMilestoneAmount(data.startMilestoneAmount);
        if (data.startMilestoneDescription) setStartMilestoneDescription(data.startMilestoneDescription);
        if (data.startMilestoneDueDate) setStartMilestoneDueDate(new Date(data.startMilestoneDueDate));

        toast.info("Project draft restored");
      }
    }
  );

  useEffect(() => {
    if (existingProject && isOpen) {
      setTitle(existingProject.title);
      setDescription(existingProject.description);
      // Requirements usually array in backend but editor expects string or we join them
      setRequirements(existingProject.requirements?.join("\n") || "");
      setDeliverables(existingProject.deliverables || []);
      setPeopleNeeded(existingProject.peopleNeeded || 1);
      setBudget(existingProject.reward);
      setCurrency(existingProject.currency);
      setDeadline(existingProject.deadline ? new Date(existingProject.deadline) : undefined);
      setSelectedTags(existingProject.skills || []);
      setProjectType(existingProject.type || "GIG");

      // Milestones
      if (existingProject.milestones) {
        setMilestones(existingProject.milestones.map(m => ({
          title: m.title,
          amount: m.amount,
          description: m.description,
          dueDate: m.dueDate
        })));
      }
    }
  }, [existingProject, isOpen]);

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput("");
    }
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      if (selectedTags.length >= 5) {
        toast.error("Max 5 tags allowed");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadService.uploadDocument(file);
      setAttachments([...attachments, {
        filename: response.originalName || response.filename,
        url: response.url,
        size: response.size,
        mimetype: response.mimetype,
      }]);
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddMilestone = () => {
    if (!startMilestoneTitle || !startMilestoneAmount || !startMilestoneDescription || !startMilestoneDueDate) {
      toast.error("Please fill all milestone fields");
      return;
    }

    const newMilestone: Milestone = {
      title: startMilestoneTitle,
      amount: startMilestoneAmount,
      description: startMilestoneDescription,
      dueDate: startMilestoneDueDate.toISOString()
    };

    setMilestones([...milestones, newMilestone]);
    setStartMilestoneTitle("");
    setStartMilestoneAmount("");
    setStartMilestoneDescription("");
    setStartMilestoneDueDate(undefined);
  };

  const handleSubmit = () => {
    let finalMilestones = [...milestones];

    // Auto-add current input if valid and all fields filled
    if (startMilestoneTitle && startMilestoneAmount && startMilestoneDescription && startMilestoneDueDate) {
      finalMilestones.push({
        title: startMilestoneTitle,
        amount: startMilestoneAmount,
        description: startMilestoneDescription,
        dueDate: startMilestoneDueDate.toISOString()
      });
    }

    if (!title || !description || !budget || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (finalMilestones.length === 0) {
      toast.error("At least one milestone is required");
      return;
    }

    const totalBudget = Number(budget.replace(/,/g, ''));
    if (isNaN(totalBudget) || totalBudget <= 0) {
      toast.error("Invalid budget amount");
      return;
    }

    // Check Balance
    const balance = walletData?.balances.find(b => b.currency === currency)?.availableBalance || 0;

    // Logic: Requires full funding
    if (!existingProject && balance < totalBudget) {
      setShowInsufficientBalance(true);
      return;
    }

    // Check milestones sum
    const milestonesSum = finalMilestones.reduce((acc, m) => acc + Number(m.amount.replace(/,/g, '')), 0);
    if (milestonesSum > totalBudget) {
      toast.error(`Milestones total (${milestonesSum}) exceeds budget (${totalBudget})`);
      return;
    }

    // Base fields common to both
    const basePayload = {
      title,
      shortDescription: description.replace(/<[^>]*>/g, '').substring(0, 150),
      description,
      requirements: [requirements],
      deliverables,
      skills: selectedTags,
      deadline: deadline!.toISOString(),
      milestones: finalMilestones,
      attachments: attachments.map(a => ({ filename: a.filename, url: a.url, size: a.size, mimetype: a.mimetype })),
    };

    if (existingProject) {
      // Update: Exclude immutable fields (reward, currency, type)
      updateProject({ id: existingProject.id, payload: basePayload }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    } else {
      // Create: Include all fields
      const createPayload: CreateProjectPayload = {
        ...basePayload,
        reward: totalBudget.toString(),
        currency,
        type: projectType,
        peopleNeeded: 1,
      };

      createProject(createPayload, {
        onSuccess: () => {
          clearDraft();
          setOpen(false);
          // Reset
          setTitle("");
          setDescription("");
          setBudget("");
          setMilestones([]);
          setStartMilestoneTitle("");
          setStartMilestoneAmount("");
          setStartMilestoneDescription("");
          setStartMilestoneDueDate(undefined);
        }
      });
    }

  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="bg-card border-border sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {existingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {existingProject ? "Update project details." : "Post a job for freelancers to apply."}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Type */}
            <div className="flex gap-4">
              <div className="flex-[2] space-y-2">
                <Label className="text-foreground">Project Title <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g Bounty Hub"
                  className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-foreground">Type <span className="text-destructive">*</span></Label>
                <Select value={projectType} onValueChange={(val: "GIG" | "JOB") => setProjectType(val)}>
                  <SelectTrigger className="bg-transparent border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="GIG">Gig</SelectItem>
                    <SelectItem value="JOB">Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-foreground">Description <span className="text-destructive">*</span></Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Detailed description of the project..."
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-foreground">Requirements <span className="text-destructive">*</span></Label>
              <RichTextEditor
                value={requirements}
                onChange={setRequirements}
                placeholder="Specific requirements, tech stack, etc..."
              />
            </div>

            {/* Deliverables */}
            <div className="space-y-2">
              <Label className="text-foreground">Deliverables <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Link title"
                  className="bg-transparent border-input text-foreground"
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                />
                <Button variant="secondary" onClick={handleAddDeliverable} className="bg-secondary hover:bg-secondary/80 border border-input">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {deliverables.map((d, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2">
                      {d} <X className="h-3 w-3 cursor-pointer" onClick={() => setDeliverables(prev => prev.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label className="text-foreground">Total Budget <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    placeholder="20,000"
                    className="bg-transparent border-input text-foreground pl-7"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    type="number"
                  />
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[100px] bg-transparent border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="XLM">XLM</SelectItem>
                    <SelectItem value="EURC">EURC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Milestone - Updated Layout */}
            <div className="space-y-2">
              <Label className="text-foreground">Milestones <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mb-2">Break down the project into trackable milestones.</p>

              {/* Existing added milestones */}
              <div className="space-y-3 mb-4">
                {milestones.map((m, i) => (
                  <div key={i} className="bg-secondary/20 border border-input rounded-md p-3 relative">
                    <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0" onClick={() => setMilestones(prev => prev.filter((_, idx) => idx !== i))}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                    <div className="flex justify-between items-start mb-1 pr-6">
                      <span className="font-medium text-sm text-foreground">{m.title}</span>
                      <span className="font-bold text-sm text-foreground">${m.amount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{m.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(m.dueDate), "PPP")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input row */}
              <div className="grid grid-cols-2 gap-3 p-3 border border-border rounded-lg bg-card/50">
                <Input
                  placeholder="Milestone Title"
                  className="bg-transparent border-input text-foreground"
                  value={startMilestoneTitle}
                  onChange={(e) => setStartMilestoneTitle(e.target.value)}
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    placeholder="Amount"
                    className="bg-transparent border-input text-foreground pl-7"
                    value={startMilestoneAmount}
                    onChange={(e) => setStartMilestoneAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <Input
                  placeholder="Description"
                  className="col-span-2 bg-transparent border-input text-foreground"
                  value={startMilestoneDescription}
                  onChange={(e) => setStartMilestoneDescription(e.target.value)}
                />
                <div className="col-span-2 flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !startMilestoneDueDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startMilestoneDueDate ? format(startMilestoneDueDate, "PPP") : "Milestone Due Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border">
                      <Calendar mode="single" selected={startMilestoneDueDate} onSelect={setStartMilestoneDueDate} initialFocus className="bg-card text-foreground" />
                    </PopoverContent>
                  </Popover>
                  <Button variant="secondary" onClick={handleAddMilestone} className="bg-secondary hover:bg-secondary/80 border border-input shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Add Milestone
                  </Button>
                </div>
              </div>
            </div>


            {/* Deadline */}
            <div className="space-y-2">
              <Label className="text-foreground">Project Valid Until <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !deadline && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select Submission Deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus className="bg-card text-foreground" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-foreground">Tags <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Select Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput) {
                    handleAddTag(tagInput);
                  }
                }}
                className="bg-transparent border-input text-foreground"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {DEFAULT_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-input hover:border-foreground/50"
                    )}
                  >
                    {tag} {selectedTags.includes(tag) ? '-' : '+'}
                  </button>
                ))}
                {selectedTags.filter(t => !DEFAULT_TAGS.includes(t)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="bg-primary text-primary-foreground border-primary text-xs px-3 py-1 rounded-full border transition-colors"
                  >
                    {tag} -
                  </button>
                ))}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label className="text-foreground">Project Document</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-secondary hover:bg-secondary/80 border border-input flex-1"
                >
                  {isUploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> Upload Document</>
                  )}
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-1 mt-2">
                  {attachments.map((attachment, i) => (
                    <div key={i} className="text-sm bg-muted/50 px-3 py-2 rounded-md flex items-center justify-between">
                      <span className="text-foreground truncate flex-1">{attachment.filename}</span>
                      <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-lg mt-4"
            >
              {isPending ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
              {existingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <InsufficientBalanceModal
        isOpen={showInsufficientBalance}
        onClose={() => setShowInsufficientBalance(false)}
        requiredAmount={budget}
        currency={currency}
      />
    </>
  );
}
