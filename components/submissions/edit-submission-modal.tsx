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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Plus, Save, Upload, X } from "lucide-react";
import { useState } from "react";

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

export function EditSubmissionModal({ isOpen, onClose, submission }: EditSubmissionModalProps) {
  // Mock initial state based on submission or defaults
  const [coverLetter, setCoverLetter] = useState("I am excited to submit my work for this bounty. I have extensive experience in React and UI design...");

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-3xl max-h-[90vh] overflow-y-auto block p-0 gap-0">
        <DialogHeader className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-1 mb-2 font-inter">
            <Badge className="bg-background hover:bg-background/90 text-white rounded-[13.7px] px-3 py-0.5 font-bold text-xs tracking-[-4%]">
              Bounty
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Edit Submission
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Update your submission for <span className="text-white font-medium">{submission?.title || "React Dashboard UI Design"}</span>
          </p>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-white text-[16px] font-medium font-inter">
                Cover Letter <span className="text-red-500">*</span>
              </Label>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="flex min-h-[140px] w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-inter font-normal"
              placeholder="Introduce yourself..."
            />
            <div className="flex justify-between text-[12px] font-inter text-white font-light">
              <span>Be specific about your experience and approach</span>
              <span>180 characters left</span>
            </div>
          </div>

          {/* Estimated Completion Time */}
          <div className="space-y-2">
            <Label className="text-white text-[16px] font-medium font-inter">
              Estimated Completion Time <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              <div className="flex-1 flex rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden focus-within:border-primary">
                <div className="px-3 py-2.5 flex items-center justify-center border-r border-[#E5E5E5]">
                  <Info className="h-4 w-4 text-white" />
                </div>
                <input
                  type="number"
                  defaultValue={3}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600 appearance-none"
                />
              </div>
              <Select defaultValue="weeks">
                <SelectTrigger className="w-[110px] bg-transparent border-[1.19px] border-[#E5E5E5] text-white h-[42px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="bg-[#09090B] border-[1.19px] border-[#E5E5E5] text-white">
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="space-y-1">
            <Label className="text-white text-[16px] font-medium font-inter">
              Portfolio Links <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3 items-center mt-2">
              <Input
                className="bg-transparent border-[1.19px] border-[#E5E5E5] text-white placeholder:text-gray-600 h-[42px] flex-1"
                placeholder="Link title"
                defaultValue="My Portfolio"
              />
              <div className="flex-1 flex rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden focus-within:border-primary h-[42px]">
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  defaultValue="https://dribbble.com/donvicks"
                />
              </div>
              <Button variant="secondary" className="h-[42px] w-[42px] p-0 bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional Attachments */}
          <div className="space-y-1">
            <Label className="text-white text-[16px] font-medium">
              Additional Attachments <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2 flex h-[98px] items-center gap-4 rounded-lg border border-dashed border-[#E5E5E5] bg-transparent px-6 transition-colors hover:bg-white/5 cursor-pointer group">
              <div className="h-12 w-12 rounded-xl bg-background text-white flex items-center justify-center group-hover:bg-[#0066CC] shrink-0">
                <Upload className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[14px] text-gray-300 font-medium font-inter">
                  Choose or drag and drop media
                </div>
                <div className="text-[12px] text-gray-500 font-inter font-light">
                  Maximum size 5 MB
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-[#09090B] p-6 border-t border-white/10 z-10">
          <Button
            className="w-full bg-background hover:bg-[#0066CC] font-bold h-12 text-base rounded-lg flex items-center justify-center gap-2 text-white"
            onClick={handleSave}
          >
            <Save className="h-5 w-5" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
