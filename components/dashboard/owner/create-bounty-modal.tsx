import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBounty, useUpdateBounty } from "@/lib/api/bounties/queries";
import { uploadService } from "@/lib/api/upload";
import { useGetWalletBalances } from "@/lib/api/wallet/queries";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import { Bounty, BountyAttachment, CreateBountyDto } from "@/lib/types/bounties";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { InsufficientBalanceModal } from "./insufficient-balance-modal";



interface CreateBountyModalProps {
  children?: React.ReactNode;
  existingBounty?: Bounty;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_TAGS = ["Frontend", "Backend", "Ui/UX Design", "Writing", "Digital Marketing", "Mobile", "Web3"];

export function CreateBountyModal({ children, existingBounty, open: controlledOpen, onOpenChange: setControlledOpen }: CreateBountyModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // ... imports ...


  // Form State - Persisted
  const [title, setTitle] = usePersistedState("draft_bounty_title", "");
  const [description, setDescription] = usePersistedState("draft_bounty_description", "");

  const [requirements, setRequirements] = usePersistedState<string[]>("draft_bounty_requirements", []);
  const [requirementInput, setRequirementInput] = useState("");
  const [deliverables, setDeliverables] = usePersistedState<string[]>("draft_bounty_deliverables", []);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [budget, setBudget] = usePersistedState("draft_bounty_budget", "");
  const [currency, setCurrency] = usePersistedState("draft_bounty_currency", "USDC");

  // Date handling: Persisted stores as string, so we need to parse back to Date if string
  const [deadlineStr, setDeadlineStr] = usePersistedState<string | undefined>("draft_bounty_deadline", undefined);
  const deadline = deadlineStr ? new Date(deadlineStr) : undefined;
  const setDeadline = (date: Date | undefined) => setDeadlineStr(date ? date.toISOString() : undefined);

  const [announcementDateStr, setAnnouncementDateStr] = usePersistedState<string | undefined>("draft_bounty_announcement", undefined);
  const announcementDate = announcementDateStr ? new Date(announcementDateStr) : undefined;
  const setAnnouncementDate = (date: Date | undefined) => setAnnouncementDateStr(date ? date.toISOString() : undefined);

  // Prize Pool
  const [prizeDistribution, setPrizeDistribution] = usePersistedState<{ rank: number; amount: string }[]>("draft_bounty_distribution", [
    { rank: 1, amount: "" },
    { rank: 2, amount: "" },
    { rank: 3, amount: "" },
  ]);

  // Tags
  const [selectedTags, setSelectedTags] = usePersistedState<string[]>("draft_bounty_tags", []);
  const [tagInput, setTagInput] = useState("");

  // Documents/Attachments
  const [attachments, setAttachments] = useState<BountyAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: walletData } = useGetWalletBalances();
  const { mutate: createBounty, isPending: isCreating } = useCreateBounty();
  const { mutate: updateBounty, isPending: isUpdating } = useUpdateBounty();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (existingBounty && isOpen) {
      setTitle(existingBounty.title);
      setDescription(existingBounty.description);

      setRequirements(existingBounty.requirements || []);
      setDeliverables(existingBounty.deliverables || []);
      setBudget(existingBounty.reward);
      setCurrency(existingBounty.rewardCurrency);
      setDeadline(existingBounty.submissionDeadline ? new Date(existingBounty.submissionDeadline) : undefined);
      setAnnouncementDate(existingBounty.judgingDeadline ? new Date(existingBounty.judgingDeadline) : undefined);
      setSelectedTags(existingBounty.skills || []);

      // Distro
      const distList = existingBounty.distribution || existingBounty.rewardDistribution;
      if (distList) {
        const distro = distList.map((d, i) => {
          let percentage = 0;
          if (Array.isArray(d.percentage)) {
            percentage = d.percentage.length > 1 ? d.percentage[1] : d.percentage[0];
          } else {
            percentage = Number(d.percentage);
          }

          return {
            rank: i + 1, // Force 1-based ranking based on index
            amount: ((percentage / 100) * Number(existingBounty.reward)).toString(),
          };
        }); // Removed .sort because we trust the index order now, or we sort properly then re-map? 
        // Better: sort first then map to index.
        // Actually, if distList is unordered, mapping index to rank might be wrong if we don't sort first.

        const sortedDistList = [...distList].sort((a, b) => Number(a.rank) - Number(b.rank));

        const finalDistro = sortedDistList.map((d, i) => {
          let percentage = 0;
          if (Array.isArray(d.percentage)) {
            percentage = d.percentage.length > 1 ? d.percentage[1] : d.percentage[0];
          } else {
            percentage = Number(d.percentage);
          }
          return {
            rank: i + 1,
            amount: ((percentage / 100) * Number(existingBounty.reward)).toString()
          };
        });

        if (finalDistro.length > 0) {
          setPrizeDistribution(finalDistro);
        }
      }
    }
  }, [existingBounty, isOpen]);

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput("");
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
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

  const handleAddPrize = () => {
    const nextRank = prizeDistribution.length + 1;
    setPrizeDistribution([...prizeDistribution, { rank: nextRank, amount: "" }]);
  };

  const handleRemovePrize = (index: number) => {
    const newDistro = prizeDistribution.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, rank: i + 1 })); // Recalculate ranks
    setPrizeDistribution(newDistro);
  };

  const handleUpdatePrize = (index: number, val: string) => {
    const newDistro = [...prizeDistribution];
    newDistro[index].amount = val;
    setPrizeDistribution(newDistro);
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


  const handleSubmit = () => {
    // Validation
    if (!title || !description || !budget || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalBudget = Number(budget.replace(/,/g, ''));
    if (isNaN(totalBudget) || totalBudget <= 0) {
      toast.error("Invalid budget amount");
      return;
    }

    // Check Balance
    const balance = walletData?.balances.find(b => b.currency === currency)?.availableBalance || 0;

    // For update, we might not strictly need full balance if already escrowed, 
    // but simplifying to always check for now or maybe only for CREATE?
    // Let's assume Create needs full balance. Update might need difference? 
    // For MVP, lets enforce balance check on Create.
    if (!existingBounty && balance < totalBudget) {
      setShowInsufficientBalance(true);
      return;
    }

    // Prepare distribution
    // Prepare distribution
    const distroTotal = prizeDistribution.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    if (distroTotal > totalBudget) {
      toast.error("Prize pool exceeds total budget");
      return;
    }

    // Calculate percentages
    // Calculate percentages
    const distribution = prizeDistribution
      .map((p, i) => ({
        rank: i + 1, // Ensure strictly 1-based sequential
        percentage: (Number(p.amount) / totalBudget) * 100
      }))
      .filter(d => d.percentage > 0);

    // Ensure deadline is end of day to avoid "past" issues for today's date
    const submissionDate = new Date(deadline);
    submissionDate.setHours(23, 59, 59, 999);

    // Base payload with common fields
    const basePayload = {
      title,
      shortDescription: description.replace(/<[^>]*>/g, '').substring(0, 150),
      description,
      requirements,
      deliverables,
      skills: selectedTags,
      submissionDeadline: submissionDate.toISOString(),
      distribution: distribution, // Use calculated distribution
      attachments: attachments.map(a => ({ filename: a.filename, url: a.url, size: a.size, mimetype: a.mimetype })),
    };

    if (existingBounty) {
      // Update payload: Exclude immutable fields
      const updatePayload: any = { // Partial<CreateBountyDto> ideally but structure varies slightly for update
        ...basePayload,
      };

      updateBounty({ id: existingBounty.id, payload: updatePayload }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    } else {
      // Create payload: Include immutable fields
      const createPayload: CreateBountyDto = {
        title: basePayload.title,
        shortDescription: basePayload.shortDescription,
        description: basePayload.description,
        requirements: basePayload.requirements,
        deliverables: basePayload.deliverables,
        skills: basePayload.skills,
        submissionDeadline: basePayload.submissionDeadline,
        distribution: basePayload.distribution,
        attachments: basePayload.attachments,
        reward: totalBudget, // number is allowed by DTO
        rewardCurrency: currency,
        judgingDeadline: announcementDate?.toISOString() || new Date(deadline.getTime() + 86400000 * 7).toISOString(),
      };

      createBounty(createPayload, {
        onSuccess: () => {
          setOpen(false);
          // Reset form
          setTitle("");
          setDescription("");
          setBudget("");
          setRequirements([]);
          setDeliverables([]);
          setPrizeDistribution([{ rank: 1, amount: "" }, { rank: 2, amount: "" }, { rank: 3, amount: "" }]);
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
                {existingBounty ? "Edit Bounty" : "Create New Bounty"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {existingBounty ? "Update bounty details." : "Launch a competition where contributors submit solutions."}
              </p>
            </div>
            {/* Close button handled by Dialog primitive usually, but we can have custom one if needed */}
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-foreground">Bounty Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g Bounty Hub"
                className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-foreground">Description<span className="text-destructive">*</span></Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Introduce yourself and explain why you're the best fit for this project. Include relevant experience, approach to the problem and what makes you stand out..."
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-foreground">Requirements <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement"
                  className="bg-transparent border-input text-foreground"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && requirementInput) {
                      handleAddRequirement();
                    }
                  }}
                />
                <Button variant="secondary" onClick={handleAddRequirement} className="bg-secondary hover:bg-secondary/80 border border-input">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {requirements.map((r, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2 justify-between py-2 px-3 w-full">
                      <span className="truncate">{r}</span>
                      <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => setRequirements(prev => prev.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
              )}
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

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Deadline <span className="text-destructive">*</span></Label>
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
              <div className="space-y-2">
                <Label className="text-foreground">Announcement Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !announcementDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {announcementDate ? format(announcementDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border">
                    <Calendar mode="single" selected={announcementDate} onSelect={setAnnouncementDate} initialFocus className="bg-card text-foreground" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Prize Pool ({Number(budget).toLocaleString()} {currency}) <span className="text-destructive">*</span></Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddPrize}
                  className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Position
                </Button>
              </div>

              <div className="space-y-3">
                {prizeDistribution.map((item, index) => (
                  <div key={index} className="grid grid-cols-[100px_1fr_40px] gap-4 items-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border border-input rounded-md p-2 px-3 text-sm text-foreground flex items-center justify-center font-medium bg-secondary/20">
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        placeholder="Amount"
                        className="bg-transparent border-input text-foreground pl-7"
                        value={item.amount}
                        onChange={(e) => handleUpdatePrize(index, e.target.value)}
                        type="number"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePrize(index)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {prizeDistribution.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                  No prizes added. Add at least one position.
                </div>
              )}
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
              <Label className="text-foreground">Bounty Document</Label>
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
              {existingBounty ? "Update Bounty" : "Create Bounty"}
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
