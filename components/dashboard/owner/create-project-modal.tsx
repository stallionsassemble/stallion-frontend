import { MarkdownEditor } from "@/components/shared/markdown-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProject } from "@/lib/api/projects/queries";
import { useGetWalletBalances } from "@/lib/api/wallet/queries";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InsufficientBalanceModal } from "./insufficient-balance-modal";

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
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [startMilestoneTitle, setStartMilestoneTitle] = useState("");
  const [startMilestoneAmount, setStartMilestoneAmount] = useState("");


  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Documents/Links
  const [docLink, setDocLink] = useState("");
  const [docLinks, setDocLinks] = useState<string[]>([]);

  const { data: walletData } = useGetWalletBalances();
  const { mutate: createProject, isPending } = useCreateProject();
  // TODO: Add useUpdateProject if API supports it, currently primarily creating based on design

  useEffect(() => {
    if (existingProject && isOpen) {
      setTitle(existingProject.title);
      setDescription(existingProject.description);
      // Requirements usually array in backend but editor expects string or we join them
      setRequirements(existingProject.requirements?.join("\n") || "");
      setDeliverables(existingProject.deliverables || []);
      setBudget(existingProject.reward);
      setCurrency(existingProject.currency);
      setDeadline(existingProject.deadline ? new Date(existingProject.deadline) : undefined);
      setSelectedTags(existingProject.skills || []);

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

  const handleAddDocLink = () => {
    if (docLink.trim()) {
      setDocLinks([...docLinks, docLink.trim()]);
      setDocLink("");
    }
  };

  const handleAddMilestone = () => {
    // In design, it looks like just one row initially, but '+' suggests adding more.
    // Let's assume standard 'add' flow
    if (!startMilestoneTitle || !startMilestoneAmount) return;

    const newMilestone: Milestone = {
      title: startMilestoneTitle,
      amount: startMilestoneAmount,
      description: `Milestone: ${startMilestoneTitle}`, // Default description
      dueDate: deadline ? deadline.toISOString() : new Date().toISOString() // Fallback
    };

    setMilestones([...milestones, newMilestone]);
    setStartMilestoneTitle("");
    setStartMilestoneAmount("");
  };

  // Design shows simpler "Milestone 1  $20,000" input. 
  // If user only enters the first one without clicking add, we should catch it or treat it as the only milestone?
  // Let's treat the inputs as "Adding a milestone" but checking if current inputs are filled on submit to auto-add.

  const handleSubmit = () => {
    let finalMilestones = [...milestones];

    // Auto-add current input if valid
    if (startMilestoneTitle && startMilestoneAmount) {
      finalMilestones.push({
        title: startMilestoneTitle,
        amount: startMilestoneAmount,
        description: `Milestone: ${startMilestoneTitle}`,
        dueDate: deadline ? deadline.toISOString() : new Date().toISOString()
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

    const payload: any = {
      title,
      shortDescription: description.substring(0, 100),
      description,
      requirements: requirements.split('\n').filter(Boolean),
      deliverables,
      skills: selectedTags,
      reward: totalBudget.toString(), // Project API expects string usually? Interface says string.
      currency,
      deadline: deadline.toISOString(),
      type: 'GIG', // Defaulting to GIG as per most common use case here? Or JOB? Design says "Post a job"
      peopleNeeded: 1, // Default
      milestones: finalMilestones,
      attachments: [] // docLinks not fully supported in simple attachment interface yet
    };

    createProject(payload, {
      onSuccess: () => {
        setOpen(false);
        // Reset
        setTitle("");
        setDescription("");
        setBudget("");
        setMilestones([]);
        setStartMilestoneTitle("");
        setStartMilestoneAmount("");
      }
    });

  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="bg-card border-border sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create New Project</h2>
              <p className="text-xs text-muted-foreground mt-1">Post a job for freelancers to apply.</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-foreground">Project Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g Bounty Hub"
                className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-foreground">Description <span className="text-destructive">*</span></Label>
              <div className="min-h-[150px] border border-input rounded-md bg-transparent">
                <MarkdownEditor
                  value={description}
                  onChange={setDescription}
                  className="bg-transparent border-none text-foreground min-h-[140px]"
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-foreground">Requirements <span className="text-destructive">*</span></Label>
              <div className="min-h-[150px] border border-input rounded-md bg-transparent">
                <MarkdownEditor
                  value={requirements}
                  onChange={setRequirements}
                  className="bg-transparent border-none text-foreground min-h-[140px]"
                />
              </div>
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

            {/* Milestone */}
            <div className="space-y-2">
              <Label className="text-foreground">Milestone <span className="text-destructive">*</span></Label>

              {/* Existing added milestones */}
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <div className="flex-1 bg-secondary border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    {m.title}
                  </div>
                  <div className="w-[150px] bg-secondary border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    ${m.amount}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setMilestones(prev => prev.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}

              {/* Input row */}
              <div className="flex gap-2">
                <Input
                  placeholder="Milestone Title"
                  className="flex-[2] bg-transparent border-input text-foreground"
                  value={startMilestoneTitle}
                  onChange={(e) => setStartMilestoneTitle(e.target.value)}
                />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    placeholder="Amount"
                    className="bg-transparent border-input text-foreground pl-7"
                    value={startMilestoneAmount}
                    onChange={(e) => setStartMilestoneAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <Button variant="secondary" onClick={handleAddMilestone} className="bg-secondary hover:bg-secondary/80 border border-input">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label className="text-foreground">Submission Deadline <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !deadline && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select date"}
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

            {/* Document Link */}
            <div className="space-y-2">
              <Label className="text-foreground">Project Document <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Link title"
                  className="bg-transparent border-input text-foreground flex-1"
                />
                <Input
                  placeholder="https://"
                  className="bg-transparent border-input text-foreground flex-[2]"
                  value={docLink}
                  onChange={(e) => setDocLink(e.target.value)}
                />
                <Button variant="secondary" onClick={handleAddDocLink} className="bg-secondary hover:bg-secondary/80 border border-input">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {docLinks.map((link, i) => (
                <div key={i} className="text-sm text-blue-400 flex items-center gap-2">
                  {link} <X className="h-3 w-3 cursor-pointer text-foreground" onClick={() => setDocLinks(prev => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
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
