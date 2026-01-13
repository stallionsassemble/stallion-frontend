"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUpdateSubmission } from "@/lib/api/bounties/queries";
import { uploadService } from "@/lib/api/upload";
import { BountySubmissionField } from "@/lib/types/bounties";
import { Loader2, Send, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Attachment {
  filename: string;
  url?: string;
  size: number;
}

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

export function EditSubmissionModal({ isOpen, onClose, submission }: EditSubmissionModalProps) {
  const [submissionValues, setSubmissionValues] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: updateSubmission, isPending: isSaving } = useUpdateSubmission();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (submission) {
      // Restore dynamic values
      const subData = submission.submission || {};
      const initialValues: Record<string, string> = {};

      if (submission.submissionLink) {
        initialValues["submissionLink"] = submission.submissionLink;
      }

      // Flatten nested data back to form values if keys match known fields
      // Or just dump everything from `submissionData`
      if (submission.submissionData) {
        Object.entries(submission.submissionData).forEach(([k, v]) => {
          if (typeof v === 'string' || typeof v === 'number') {
            initialValues[k] = String(v);
          }
        });
      }

      setSubmissionValues(initialValues);

      // Restore attachments
      const atts = submission.attachments || submission.submission?.attachments || [];
      setAttachments(atts.map((a: any) => ({
        filename: a.filename,
        url: a.url,
        size: a.size
      })));
    }
  }, [submission]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        const docFiles = files.filter(f => !f.type.startsWith('image/'));

        const uploadPromises = [];

        if (imageFiles.length > 0) {
          if (imageFiles.length === 1) {
            uploadPromises.push(uploadService.uploadImage(imageFiles[0]).then(img => [{ filename: img.originalName, url: img.url, size: img.size }]));
          } else {
            uploadPromises.push(uploadService.uploadImages(imageFiles).then(res => (res.images || (Array.isArray(res) ? res : [])).map((img: any) => ({ filename: img.originalName, url: img.url, size: img.size }))));
          }
        }
        if (docFiles.length > 0) {
          if (docFiles.length === 1) {
            uploadPromises.push(uploadService.uploadDocument(docFiles[0]).then(doc => [{ filename: doc.originalName, url: doc.url, size: doc.size }]));
          } else {
            uploadPromises.push(uploadService.uploadDocuments(docFiles).then(res => (res.documents || (Array.isArray(res) ? res : [])).map((doc: any) => ({ filename: doc.originalName, url: doc.url, size: doc.size }))));
          }
        }

        const results = await Promise.all(uploadPromises);
        setAttachments(prev => [...prev, ...results.flat()]);

      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Re-validate based on active fields
    // We try to use the bounty's fields if available in the submission object (often nested in bounty: { submissionFields: [] })
    // If not directly available on `submission`, we might need to rely on typical defaults or fetch bounty details.
    // For now, let's assume if submissionFields are missing, we use the standard set.
    const fields: BountySubmissionField[] = submission?.bounty?.submissionFields || [
      { name: 'submissionLink', label: 'Submission Link', type: 'url', required: true },
      { name: 'comments', label: 'Comments', type: 'text', required: false }
    ];

    for (const field of fields) {
      if (field.required && !submissionValues[field.name]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    // Prepare payload
    let submissionLink = submissionValues['submissionLink'] || submissionValues['githubRepo'] || "";
    // Separate data
    const { submissionLink: _l, githubRepo: _g, ...otherData } = submissionValues;

    // Always include attachments in submissionData
    const payload = {
      submissionLink: submissionLink,
      submissionData: {
        ...otherData,
        attachments: attachments
      }
    };

    updateSubmission({
      id: submission.id,
      payload: payload
    }, {
      onSuccess: () => {
        onClose();
        // Toast handled in query hook
      }
    });
  };

  const renderForm = () => {
    // Use bounty fields if available, else default
    const fields: BountySubmissionField[] = submission?.bounty?.submissionFields || [
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
            ) : field.type === 'text' ? (
              <textarea
                value={submissionValues[field.name] || ''}
                onChange={(e) => setSubmissionValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="flex min-h-[100px] w-full rounded-lg border-[1.19px] border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder={field.label}
              />
            ) : (
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

        {/* Additional Attachments */}
        <div className="space-y-1 pt-2">
          <Label className="text-foreground text-[16px] font-medium">
            Additional Attachments (Optional)
          </Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex h-[98px] items-center gap-4 rounded-lg border border-dashed border-input bg-transparent px-6 transition-colors hover:bg-white/5 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-primary/90 shrink-0">
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[14px] text-foreground font-medium font-inter">
                Choose or drag and drop media
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

          {/* Attachment List */}
          {attachments.length > 0 && (
            <div className="space-y-2 mt-4">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-sm truncate max-w-[200px] text-white">{file.filename}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button onClick={() => removeAttachment(i)} className="text-gray-500 hover:text-red-500 p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-[550px] max-h-[90vh] overflow-y-auto block p-0 gap-0">
        <DialogHeader className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-1 mb-2 font-inter">
            {submission?.details?.amount && (
              <Badge className="bg-primary/50 hover:bg-primary/60 text-foreground rounded-[13.7px] px-2 py-0.5 font-bold text-xs tracking-[-4%]">
                {submission.details.amount}
                <span className="text-[8px] font-medium opacity-80 bg-primary text-center rounded-[3422.21px] ml-1 px-1">{submission.details.currency}</span>
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Edit Submission
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Update your submission for <span className="text-white font-medium">{submission?.details?.title || "Bounty"}</span>
          </p>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>

        {renderForm()}

        <DialogFooter className="sticky bottom-0 bg-[#09090B] p-6 border-t border-white/10 z-10">
          <Button
            className="w-full bg-[#0066CC] hover:bg-[#0066CC]/90 font-bold h-12 text-base rounded-lg flex items-center justify-center gap-2 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            Update Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
