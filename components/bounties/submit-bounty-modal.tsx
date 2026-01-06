import { useApplyToBounty } from "@/lib/api/bounties/queries";
import { useApplyProject, useUpdateApplication } from "@/lib/api/projects/queries";
import { uploadService } from "@/lib/api/upload";
import { Info, Loader2, Plus, Send, Upload, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ... existing imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/store/use-auth";
import { BountySubmissionField } from "@/lib/types/bounties";
import { Attachment, ApplyProjectResponse as ProjectApplication } from "@/lib/types/project";
import { CongratulationsModal } from "./congratulations-modal";

interface SubmitModalProps {
  children: React.ReactNode;
  type?: "BOUNTY" | "PROJECT";
  projectId: string; // Required now
  projectTitle: string;
  reward: string;
  currency: string;
  sponsorLogo?: string;
  submissionFields?: BountySubmissionField[];
  existingApplication?: ProjectApplication;
}

export function SubmitBountyModal({
  children,
  type = "BOUNTY",
  projectId,
  projectTitle,
  reward,
  currency,
  sponsorLogo,
  submissionFields,
  existingApplication
}: SubmitModalProps) {
  const [open, setOpen] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const isProject = type === "PROJECT";
  const { user } = useAuth();

  // Form State
  const [coverLetter, setCoverLetter] = useState("");
  const [estimateTime, setEstimateTime] = useState("");
  const [estimateUnit, setEstimateUnit] = useState("days");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Bounty dynamic state
  const [submissionValues, setSubmissionValues] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: applyProject, isPending: isProjectPending } = useApplyProject();
  const { mutate: updateApplication, isPending: isUpdatePending } = useUpdateApplication();
  const { mutate: applyBounty, isPending: isBountyPending } = useApplyToBounty();

  const isPending = isProjectPending || isBountyPending || isUpdatePending;

  useEffect(() => {
    if (existingApplication && open) {
      setCoverLetter(existingApplication.coverLetter);
      setEstimateTime(existingApplication.estimatedCompletionTime.toString());
      setEstimateUnit('days'); // Assuming backend stores days, we might want to convert back but 'days' is safe.
      setPortfolioLinks(existingApplication.portfolioLinks || []);
      setAttachments(existingApplication.attachments || []);
    }
  }, [existingApplication, open]);

  // ... helper functions (handleAddLink, handleFileSelect, removeAttachment) remain the same ...
  const handleAddLink = () => {
    if (portfolioLink.trim()) {
      setPortfolioLinks([...portfolioLinks, portfolioLink.trim()]);
      setPortfolioLink("");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        const docFiles = files.filter(f => !f.type.startsWith('image/'));

        const uploadPromises = [];

        // Handle Images
        if (imageFiles.length === 1) {
          uploadPromises.push(uploadService.uploadImage(imageFiles[0]).then(img =>
            [{
              filename: img.originalName,
              url: img.url,
              size: img.size
            }]
          ));
        } else if (imageFiles.length > 1) {
          uploadPromises.push(uploadService.uploadImages(imageFiles).then(res =>
            (res.images || (Array.isArray(res) ? res : [])).map((img: any) => ({
              filename: img.originalName,
              url: img.url,
              size: img.size
            }))
          ));
        }

        // Handle Documents
        if (docFiles.length === 1) {
          uploadPromises.push(uploadService.uploadDocument(docFiles[0]).then(doc =>
            [{
              filename: doc.originalName,
              url: doc.url,
              size: doc.size
            }]
          ));
        } else if (docFiles.length > 1) {
          uploadPromises.push(uploadService.uploadDocuments(docFiles).then(res =>
            (res.documents || (Array.isArray(res) ? res : [])).map((doc: any) => ({
              filename: doc.originalName,
              url: doc.url,
              size: doc.size
            }))
          ));
        }

        const results = await Promise.all(uploadPromises);
        const newAttachments = results.flat();

        setAttachments(prev => [...prev, ...newAttachments]);
      } catch (error) {
        console.error("Upload failed", error);
        // Could add toast here
      } finally {
        setIsUploading(false);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isProject) {
      const estimatedDays = parseInt(estimateTime) * (estimateUnit === 'weeks' ? 7 : estimateUnit === 'months' ? 30 : 1);

      const payload = {
        coverLetter,
        estimatedCompletionTime: estimatedDays || 0,
        portfolioLinks,
        attachments: attachments
      };

      if (existingApplication) {
        updateApplication({
          id: existingApplication.id,
          payload
        }, {
          onSuccess: () => {
            setOpen(false);
            // Maybe show toast instead of full congrats for update?
            // But existing behavior is fine.
            setShowCongrats(true);
          },
          onError: (err) => console.error(err)
        });
      } else {
        applyProject({
          id: projectId,
          payload
        }, {
          onSuccess: () => {
            setOpen(false);
            setShowCongrats(true);
            // Reset form
            setCoverLetter("");
            setEstimateTime("");
            setPortfolioLinks([]);
            setAttachments([]);
          },
          onError: (err) => {
            console.error("Failed to apply", err);
          }
        });
      }
    } else {
      // Extract submissionLink - prioritize explicit field, then githubRepo
      let submissionLink = submissionValues['submissionLink'] || submissionValues['githubRepo'] || "";

      // If still empty and we have fields, maybe one is a URL? 
      // User requirement implies submissionLink is "main", so we should ensure we grab it.
      // If explicit 'submissionLink' field exists in submissionFields, we used that above.

      // Create separate submissionData object excluding the main link if it was one of the keys
      const { submissionLink: _l, githubRepo: _g, ...otherData } = submissionValues;

      // If we didn't find a primary link yet, and we have to fallback to *something*, 
      // we might just have to send an empty string or error if required. 
      // But assuming the form validation (HTML required attribute) handles the presence.

      applyBounty({
        id: projectId,
        payload: {
          submissionLink: submissionLink,
          submissionData: otherData
        }
      }, {
        onSuccess: () => {
          setOpen(false);
          setShowCongrats(true);
          setSubmissionValues({});
        },
        onError: (err) => {
          console.error("Failed to submit bounty", err);
        }
      });
    }
  };

  // ... renderProjectForm same ...
  const renderProjectForm = () => (
    <div className="p-6 space-y-6">
      {/* Cover Letter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-foreground text-[16px] font-medium font-inter">
            Cover Letter <span className="text-destructive">*</span>
          </Label>
        </div>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="flex min-h-[140px] w-full rounded-lg border-[1.19px] border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-inter font-normal"
          placeholder="Introduce yourself and explain why you're the best fit for this project. Include relevant experience, approach to the problem and what makes you stand out..."
        />
        <div className="flex justify-between text-[12px] font-inter text-foreground font-light">
          <span>Be specific about your experience and approach</span>
          <span>{coverLetter.length} chars</span>
        </div>
      </div>

      {/* Estimated Completion Time */}
      <div className="space-y-2">
        <Label className="text-foreground text-[16px] font-medium font-inter">
          Estimated Completion Time <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          <div className="flex-1 flex rounded-lg border-[1.19px] border-input bg-transparent overflow-hidden focus-within:border-primary">
            <div className="px-3 py-2.5 flex items-center justify-center border-r border-input">
              <Info className="h-4 w-4 text-foreground" />
            </div>
            <input
              type="number"
              value={estimateTime}
              onChange={(e) => setEstimateTime(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground appearance-none"
              placeholder="Enter time"
            />
          </div>
          <Select value={estimateUnit} onValueChange={setEstimateUnit}>
            <SelectTrigger className="w-[110px] bg-transparent border-[1.19px] border-input text-foreground h-[42px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent className="bg-card border-[1.19px] border-input text-foreground">
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Portfolio Links */}
      <div className="space-y-1">
        <Label className="text-foreground text-[16px] font-medium font-inter">
          Portfolio Links <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex rounded-lg border-[1.19px] border-input bg-transparent overflow-hidden focus-within:border-primary h-[42px]">
            <input
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
              placeholder="https://"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddLink}
            className="h-[42px] w-[42px] p-0 bg-secondary hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {portfolioLinks.map((link, i) => (
            <div key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded flex items-center gap-1">
              <span className="truncate max-w-[200px]">{link}</span>
              <button
                onClick={() => setPortfolioLinks(links => links.filter((_, idx) => idx !== i))}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Attachments */}
      <div className="space-y-1">
        <Label className="text-foreground text-[16px] font-medium">
          Additional Attachments (Optional)
        </Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex h-[98px] items-center gap-4 rounded-lg border border-dashed border-input bg-transparent px-6 transition-colors hover:bg-background/90 cursor-pointer group"
        >
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-primary/90 shrink-0">
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[14px] text-foreground font-medium font-inter">
              {isUploading ? "Uploading..." : "Choose or drag and drop media"}
            </div>
            <div className="text-[12px] text-muted-foreground font-inter font-light">
              Maximum size 5 MB
            </div>
          </div>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
        </div>

        {/* Uploaded Files List */}
        {attachments.length > 0 && (
          <div className="space-y-2 mt-4">
            {attachments.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="bg-primary/10 p-1.5 rounded">
                    <Upload className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm truncate max-w-[200px]">{file.filename}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-destructive p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBountyForm = () => {
    // If no fields defined, show default fallback fields or empty state?
    // Let's show a default "Submission URL" if fields are empty to be safe
    const fields = submissionFields && submissionFields.length > 0 ? submissionFields : [
      { name: 'submissionLink', label: 'Submission Link', type: 'url', required: true },
      { name: 'comments', label: 'Comments', type: 'text', required: false }
    ];

    return (
      <div className="p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label className="text-foreground text-sm font-semibold">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.type === 'url' ? (
              <div className="flex rounded-lg border-[1.19px] border-input bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-foreground border-r border-input bg-background">https://</span>
                <input
                  value={(submissionValues[field.name] || '').replace('https://', '')}
                  onChange={(e) => setSubmissionValues(prev => ({ ...prev, [field.name]: 'https://' + e.target.value.replace('https://', '') }))}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                  placeholder={field.label}
                />
              </div>
            ) : field.type === 'text' ? ( // assuming 'text' can be long text
              <textarea
                value={submissionValues[field.name] || ''}
                onChange={(e) => setSubmissionValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="flex min-h-[100px] w-full rounded-lg border-[1.19px] border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder={field.label}
              />
            ) : (
              // default input
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={submissionValues[field.name] || ''}
                onChange={(e) => setSubmissionValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full rounded-lg border-[1.19px] border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="bg-card border-border sm:max-w-[550px] max-w-[550px] max-h-[90vh] overflow-y-auto block p-0 gap-0">
          <DialogHeader className="p-6 border-b border-border relative">
            <div className="flex items-center gap-1 mb-2 font-inter">
              <Badge className="bg-primary/50 hover:bg-primary/60 text-foreground rounded-[13.7px] px-2 py-0.5 font-bold text-xs tracking-[-4%]">
                {reward}
                <span className="text-[8px] font-medium opacity-80 bg-primary text-center rounded-[3422.21px] ml-1 px-1">{currency}</span>
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {isProject ? (existingApplication ? "Update Application" : "Apply for Project") : "Bounty Submission"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isProject ? (existingApplication ? "Update details for" : "Submit your application for") : "Submit your work for"} <span className="text-foreground font-medium">{projectTitle}</span>
            </p>
          </DialogHeader>

          {isProject ? renderProjectForm() : renderBountyForm()}

          <DialogFooter className="sticky bottom-0 bg-card p-6 border-t border-border z-10">
            <Button
              className="w-full bg-primary hover:bg-primary/90 font-bold h-12 text-base rounded-lg flex items-center justify-center gap-2 text-primary-foreground"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
              {isProject ? (isPending ? (existingApplication ? "Updating..." : "Applying...") : (existingApplication ? "Update Application" : "Submit Application")) : (isPending ? "Submitting..." : "Submit Bounty")}
            </Button>
          </DialogFooter>
          <div className="px-6 pb-6 text-center text-[10px] text-muted-foreground">
            By submitting/applying to this listing, you agree to our{" "}
            <Link href="/terms" className="underline cursor-pointer hover:text-primary">
              Terms of Use
            </Link>
            .
          </div>
        </DialogContent>
      </Dialog>

      <CongratulationsModal
        isOpen={showCongrats}
        onClose={() => setShowCongrats(false)}
        userLogo={user?.profilePicture}
        sponsorLogo={sponsorLogo}
        title={existingApplication ? "Application Updated!" : "Congratulations!"}
        message={existingApplication ? "Your application details have been updated." : "Your application/submission has been received."}
      />
    </>
  );
}
