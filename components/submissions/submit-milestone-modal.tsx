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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitMilestone } from "@/lib/api/projects/queries";
import { uploadService } from "@/lib/api/upload";
import { Loader2, Plus, Send, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Attachment {
  filename: string;
  url?: string;
  size: number;
}

interface SubmitMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: any[];
  projectId: string;
  applicationId?: string;
  projectTitle: string;
  milestoneAmount: string;
  milestoneCurrency: string;
}

export function SubmitMilestoneModal({ isOpen, onClose, milestones, projectId, applicationId, projectTitle, milestoneAmount, milestoneCurrency }: SubmitMilestoneModalProps) {
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneLink, setMilestoneLink] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: submitMilestone, isPending: isSubmitting } = useSubmitMilestone();
  // const { data: projectMilestones } = useGetMyMilestones(projectId); // Removed redundant fetch

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter for pending milestones
  const pendingMilestones = milestones?.filter((m: any) => m.status === 'PENDING') || [];

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
            [{ filename: img.originalName, url: img.url, size: img.size }]
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
            [{ filename: doc.originalName, url: doc.url, size: doc.size }]
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

  const handleSubmit = async () => {
    if (!selectedMilestone) {
      toast.error("Please select a milestone");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!milestoneLink.trim()) {
      toast.error("Milestone link is required");
      return;
    }
    // Links and Attachments might be optional depending on strictness, but let's assume one is needed or just description is enough.

    submitMilestone({
      id: selectedMilestone,
      payload: {
        description: description,
        links: [milestoneLink],
        attachments: attachments.map(a => ({
          filename: a.filename,
          url: a.url || "",
          size: a.size,
          mimetype: "application/octet-stream" // Default mimetype if not tracked locally, or update upload to track it.
        }))
      }
    }, {
      onSuccess: () => {
        toast.success("Milestone submitted successfully!");
        onClose();

        // Reset form
        setSelectedMilestone("");
        setDescription("");
        setMilestoneLink("");
        setAttachments([]);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to submit milestone");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-[550px] max-h-[90vh] overflow-y-auto block p-0 gap-0">
        <DialogHeader className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-1 mb-2 font-inter">
            <Badge className="bg-[#0066CC] hover:bg-[#0066CC]/90 text-white rounded-[13.7px] px-3 py-0.5 font-bold text-xs tracking-[-4%]">
              {milestoneAmount} <span className="text-[8px] bg-white/20 ml-1 px-1 rounded-sm">{milestoneCurrency}</span>
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Submit Milestone
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Submit your milestone for <span className="text-white font-medium">{projectTitle}</span>
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Milestone Select */}
          <div className="space-y-2">
            <Label className="text-white text-[16px] font-medium font-inter">
              Milestone
            </Label>
            <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
              <SelectTrigger className="w-full bg-transparent border-[1.19px] border-[#333] text-white h-[42px]">
                <SelectValue placeholder="Choose a milestone.." />
              </SelectTrigger>
              <SelectContent className="bg-[#09090B] border-[1.19px] border-[#333] text-white">
                {pendingMilestones.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="font-bold">{m.milestone.title}</span>
                    <span className="text-gray-400 ml-2 text-xs">({m.milestone.amount} {m.milestone.project.currency})</span>
                  </SelectItem>
                ))}
                {pendingMilestones.length === 0 && (
                  <SelectItem value="none" disabled>No pending milestones</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white text-[16px] font-medium font-inter">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[140px] w-full rounded-lg border-[1.19px] border-[#333] bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0066CC] font-inter font-normal"
              placeholder="Milestone Description"
            />
          </div>

          {/* Links */}
          <div className="space-y-1">
            <Label className="text-white text-[16px] font-medium font-inter">
              Milestone Links <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3 items-center mt-2">
              <input
                className="bg-transparent border-[1.19px] border-[#333] text-white placeholder:text-gray-600 h-[42px] px-3 rounded-lg flex-[0.7] text-sm focus:outline-none focus:border-[#0066CC]"
                placeholder="Link title"
              />
              <div className="flex-1 flex rounded-lg border-[1.19px] border-[#333] bg-transparent overflow-hidden focus-within:border-[#0066CC] h-[42px]">
                <input
                  value={milestoneLink}
                  onChange={(e) => setMilestoneLink(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="https://"
                />
              </div>
              <Button variant="secondary" className="h-[42px] w-[42px] p-0 bg-[#333] text-white hover:bg-[#444]">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-1">
            <Label className="text-white text-[16px] font-medium">
              Additional Attachments (Optional)
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex h-[98px] items-center gap-4 rounded-lg border border-dashed border-[#333] bg-[#0F0F11] px-6 transition-colors hover:bg-white/5 cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-xl bg-[#0066CC] text-white flex items-center justify-center group-hover:bg-[#0066CC]/90 shrink-0">
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[14px] text-gray-300 font-medium font-inter">
                  Choose or drag and drop media
                </div>
                <div className="text-[12px] text-gray-500 font-inter font-light">
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
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.url ? (
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm truncate max-w-[200px] hover:underline text-[#0066CC]">
                          {file.filename}
                        </a>
                      ) : (
                        <span className="text-sm truncate max-w-[200px] text-white">{file.filename}</span>
                      )}
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

        <DialogFooter className="sticky bottom-0 bg-[#09090B] p-6 border-t border-white/10 z-10">
          <Button
            variant="stallion"
            size="lg"
            className="w-full gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            Submit Milestone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
