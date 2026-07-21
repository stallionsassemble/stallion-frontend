/* eslint-disable */
"use client";

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
import { adminService } from "@/lib/api/admin";

interface CreateBountyModalProps {
  children?: React.ReactNode;
  existingBounty?: Bounty;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isAdmin?: boolean;
}

const DEFAULT_TAGS = ["Frontend", "Backend", "Ui/UX Design", "Writing", "Digital Marketing", "Mobile", "Web3"];

export function CreateBountyModal({ 
  children, 
  existingBounty, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  isAdmin,
}: CreateBountyModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // Form State - Persisted
  const [title, setTitle] = usePersistedState("draft_bounty_title", "");
  const [description, setDescription] = usePersistedState("draft_bounty_description", "");

  const [requirements, setRequirements] = usePersistedState<string[]>("draft_bounty_requirements", []);
  const [requirementInput, setRequirementInput] = useState("");
  const [deliverables, setDeliverables] = usePersistedState<string[]>("draft_bounty_deliverables", []);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [budget, setBudget] = usePersistedState("draft_bounty_budget", "");
  const [currency, setCurrency] = usePersistedState("draft_bounty_currency", "USDC");

  // Date handling: Start Date & End Date
  const [startDateStr, setStartDateStr] = usePersistedState<string | undefined>("draft_bounty_start_date", undefined);
  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const setStartDate = (date: Date | undefined) => setStartDateStr(date ? date.toISOString() : undefined);

  const [endDateStr, setEndDateStr] = usePersistedState<string | undefined>("draft_bounty_end_date", undefined);
  const endDate = endDateStr ? new Date(endDateStr) : undefined;
  const setEndDate = (date: Date | undefined) => setEndDateStr(date ? date.toISOString() : undefined);

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

      const existingStart = existingBounty.startDate
        ? new Date(existingBounty.startDate)
        : existingBounty.createdAt
        ? new Date(existingBounty.createdAt)
        : undefined;

      const existingEnd = existingBounty.endDate
        ? new Date(existingBounty.endDate)
        : existingBounty.submissionDeadline
        ? new Date(existingBounty.submissionDeadline)
        : undefined;

      setStartDate(existingStart);
      setEndDate(existingEnd);
      setSelectedTags(existingBounty.skills || []);

      const distList = existingBounty.distribution || existingBounty.rewardDistribution;
      if (distList) {
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
      .map((item, i) => ({ ...item, rank: i + 1 }));
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
    if (!title || !description || !budget || !startDate || !endDate) {
      toast.error("Please fill in all required fields (including Start Date & End Date)");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    const totalBudget = Number(budget.replace(/,/g, ''));
    if (isNaN(totalBudget) || totalBudget <= 0) {
      toast.error("Invalid budget amount");
      return;
    }

    // Check Balance
    const balance = walletData?.balances.find(b => b.currency === currency)?.availableBalance || 0;

    if (!existingBounty && balance < totalBudget) {
      setShowInsufficientBalance(true);
      return;
    }

    // Prepare distribution
    const distroTotal = prizeDistribution.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    if (distroTotal > totalBudget) {
      toast.error("Prize pool exceeds total budget");
      return;
    }

    // Calculate percentages
    const distribution = prizeDistribution
      .map((p, i) => ({
        rank: i + 1,
        percentage: (Number(p.amount) / totalBudget) * 100
      }))
      .filter(d => d.percentage > 0);

    // Format dates to ISO
    const startIso = startDate.toISOString();

    const endFormatted = new Date(endDate);
    endFormatted.setHours(23, 59, 59, 999);
    const endIso = endFormatted.toISOString();

    // Base payload with Start Date and End Date
    const basePayload = {
      title,
      shortDescription: description.replace(/<[^>]*>/g, '').substring(0, 150),
      description,
      requirements,
      deliverables,
      skills: selectedTags,
      startDate: startIso,
      endDate: endIso,
      distribution: distribution,
      attachments: attachments.map(a => ({ filename: a.filename, url: a.url, size: a.size, mimetype: a.mimetype })),
    };

    if (existingBounty) {
      const updatePayload: any = {
        ...basePayload,
      };

      if (isAdmin) {
        const toastId = toast.loading("Updating as admin...");
        adminService.updateBounty(existingBounty.id, updatePayload)
          .then(() => {
            toast.success("Bounty updated successfully", { id: toastId });
            setOpen(false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to update bounty", { id: toastId });
          });
      } else {
        updateBounty({ id: existingBounty.id, payload: updatePayload }, {
          onSuccess: () => {
            setOpen(false);
          }
        });
      }
    } else {
      const createPayload: CreateBountyDto = {
        title: basePayload.title,
        shortDescription: basePayload.shortDescription,
        description: basePayload.description,
        requirements: basePayload.requirements,
        deliverables: basePayload.deliverables,
        skills: basePayload.skills,
        startDate: basePayload.startDate,
        endDate: basePayload.endDate,
        distribution: basePayload.distribution,
        attachments: basePayload.attachments,
        reward: totalBudget,
        rewardCurrency: currency,
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
          setStartDate(undefined);
          setEndDate(undefined);
          setPrizeDistribution([{ rank: 1, amount: "" }, { rank: 2, amount: "" }, { rank: 3, amount: "" }]);
        }
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="bg-card border-border w-full max-w-[calc(100vw-2rem)] sm:max-w-[720px] md:max-w-[780px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-border bg-card shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {existingBounty ? "Edit Bounty" : "Create New Bounty"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {existingBounty ? "Update bounty details." : "Launch a competition where contributors submit solutions."}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto overflow-x-hidden flex-1 min-w-0 max-w-full">
            {/* Title */}
            <div className="space-y-2 min-w-0">
              <Label className="text-foreground">Bounty Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g Bounty Hub"
                className="bg-transparent border-input text-foreground placeholder:text-muted-foreground w-full min-w-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 min-w-0 max-w-full">
              <Label className="text-foreground">Description<span className="text-destructive">*</span></Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Introduce yourself and explain why you're the best fit for this project. Include relevant experience, approach to the problem and what makes you stand out..."
                className="w-full max-w-full"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2 min-w-0">
              <Label className="text-foreground">Requirements <span className="text-destructive">*</span></Label>
              <div className="flex gap-2 min-w-0">
                <Input
                  placeholder="Add a requirement"
                  className="bg-transparent border-input text-foreground flex-1 min-w-0"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && requirementInput) {
                      handleAddRequirement();
                    }
                  }}
                />
                <Button variant="secondary" onClick={handleAddRequirement} className="bg-secondary hover:bg-secondary/80 border border-input shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 min-w-0">
                  {requirements.map((r, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2 justify-between py-2 px-3 w-full min-w-0">
                      <span className="truncate flex-1 min-w-0 text-left">{r}</span>
                      <X className="h-3 w-3 cursor-pointer shrink-0 ml-1" onClick={() => setRequirements(prev => prev.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Deliverables */}
            <div className="space-y-2 min-w-0">
              <Label className="text-foreground">Deliverables <span className="text-destructive">*</span></Label>
              <div className="flex gap-2 min-w-0">
                <Input
                  placeholder="Link title"
                  className="bg-transparent border-input text-foreground flex-1 min-w-0"
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                />
                <Button variant="secondary" onClick={handleAddDeliverable} className="bg-secondary hover:bg-secondary/80 border border-input shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                  {deliverables.map((d, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2 max-w-full">
                      <span className="truncate max-w-[200px]">{d}</span>
                      <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => setDeliverables(prev => prev.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2 min-w-0">
              <Label className="text-foreground">Total Budget <span className="text-destructive">*</span></Label>
              <div className="flex gap-2 min-w-0">
                <div className="relative flex-1 min-w-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    placeholder="20,000"
                    className="bg-transparent border-input text-foreground pl-7 w-full min-w-0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    type="number"
                  />
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[100px] shrink-0 bg-transparent border-input text-foreground">
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

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              <div className="space-y-2 min-w-0">
                <Label className="text-foreground">Start Date <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground">Date when the bounty opens for submissions.</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full min-w-0 justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{startDate ? format(startDate, "PPP") : "Select start date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        if (date && endDate && endDate < date) {
                          setEndDate(undefined);
                        }
                      }}
                      initialFocus
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 min-w-0">
                <Label className="text-foreground">End Date <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground">Date when the bounty closes for submissions.</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full min-w-0 justify-start text-left font-normal bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{endDate ? format(endDate, "PPP") : "Select end date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => {
                        const minDate = startDate ? new Date(startDate) : new Date();
                        minDate.setHours(0, 0, 0, 0);
                        return date < minDate;
                      }}
                      initialFocus
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-center justify-between">
                <Label className="text-foreground truncate pr-2">
                  Prize Pool ({Number(budget).toLocaleString()} {currency}) <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddPrize}
                  className="h-8 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Position
                </Button>
              </div>

              <div className="space-y-3 min-w-0">
                {prizeDistribution.map((item, index) => (
                  <div key={index} className="grid grid-cols-[75px_1fr_40px] sm:grid-cols-[90px_1fr_40px] gap-2 sm:gap-4 items-center min-w-0">
                    <div className="border border-input rounded-md p-2 text-sm text-foreground flex items-center justify-center font-medium bg-secondary/20 truncate">
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}
                    </div>
                    <div className="relative min-w-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        placeholder="Amount"
                        className="bg-transparent border-input text-foreground pl-7 w-full min-w-0"
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
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0"
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
            <div className="space-y-2 min-w-0">
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
                className="bg-transparent border-input text-foreground w-full min-w-0"
              />
              <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                {DEFAULT_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-colors shrink-0",
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
                    type="button"
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="bg-primary text-primary-foreground border-primary text-xs px-3 py-1 rounded-full border transition-colors shrink-0"
                  >
                    {tag} -
                  </button>
                ))}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-2 min-w-0">
              <Label className="text-foreground">Bounty Document</Label>
              <div className="flex gap-2 min-w-0">
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
                  className="bg-secondary hover:bg-secondary/80 border border-input flex-1 min-w-0"
                >
                  {isUploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2 shrink-0" /> Upload Document</>
                  )}
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-1 mt-2 min-w-0">
                  {attachments.map((attachment, i) => (
                    <div key={i} className="text-sm bg-muted/50 px-3 py-2 rounded-md flex items-center justify-between min-w-0">
                      <span className="text-foreground truncate flex-1 min-w-0">{attachment.filename}</span>
                      <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground shrink-0 ml-2" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-lg mt-4 shrink-0"
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
