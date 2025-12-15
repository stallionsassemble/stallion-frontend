import { CongratulationsModal } from "@/components/bounties/congratulations-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Send, Upload } from "lucide-react";
import { useState } from "react";

export function SubmitBountyModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSubmit = () => {
    setOpen(false);
    setShowCongrats(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="bg-[#09090B] border-white/10 sm:max-w-3xl max-h-[90vh] overflow-y-auto block p-0 gap-0">
          <DialogHeader className="p-6 border-b border-white/10 relative">
            <div className="flex items-center gap-1 mb-2 font-inter">
              <Badge className="bg-[#007AFF78] hover:bg-[#007AFF78] text-white rounded-[13.7px] px-2 py-0.5 font-bold text-xs tracking-[-4%]">
                $3,500
                <span className="text-[8px] font-medium opacity-80 bg-primary text-center rounded-[3422.21px]">USDC</span>
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">Bounty Submission</DialogTitle>
            <p className="text-sm text-gray-400 mt-1">
              Submit your application for <span className="text-white font-medium">React Dashboard UI Design</span>
            </p>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Main Project URL */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Main Project URL <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] text-gray-500">Share the primary link where your project can be viewed or accessed.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* X (Twitter) Post URL */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                X (Twitter) Post URL
              </Label>
              <p className="text-[10px] text-gray-500">Optional: Add the link to your X post about this project to help others discover it.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* GitHub link */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Provide a public GitHub link to your project repository <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] text-gray-500">Provide the public link to your codebase or repository.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Project Social Handle */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Project Social Handle (Twitter/X) <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] text-gray-500">Drop the link to your project's official social profile.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Showcase Video */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Showcase Video
              </Label>
              <p className="text-[10px] text-gray-500">Insert a link to a short demo or trailer (YouTube, Vimeo, etc.) that highlights what your project does.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Project Link (If live) */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Project Link (If live) <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] text-gray-500">If your project is already deployed, share the live link here.</p>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Description of project (250 characters or less) <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Interesting/Different */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                What makes your project interesting/different (1000 characters or less) <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-lg border border-white/10  bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Team member Twitter */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Team member Twitter account(s) <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-lg border border-white/10 bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Any useful link */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Any useful link <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-lg border border-white/10 bg-transparent overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-white border-r border-[#404040] bg-muted">https://</span>
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
                  placeholder="Submission Link"
                />
              </div>
            </div>

            {/* Additional Attachments */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">
                Additional Attachments (Optional) <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] text-gray-500">Attach relevant documents, screenshots, or files (max 5 files)</p>
              <div className="mt-2 flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-white/20  bg-transparent transition-colors hover:bg-white/5 cursor-pointer group">
                <div className="h-12 w-12 rounded-lg bg-primary text-white flex items-center justify-center mb-3 group-hover:bg-[#0066CC]">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Choose or drag and drop media
                </div>
                <div className="text-[10px] text-gray-600 mt-1">
                  Maximum size 5 MB
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-[#09090B] p-6 border-t border-white/10 z-10">
            <Button
              className="w-full bg-primary hover:bg-[#0066CC] font-bold h-12 text-base rounded-lg flex items-center justify-center gap-2 text-white"
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5" color="white" /> Submit Application
            </Button>
          </DialogFooter>
          <div className="px-6 pb-6 text-center text-[10px] text-gray-500">
            By submitting/applying to this listing, you agree to our <span className="underline cursor-pointer hover:text-white">Terms of Use</span>.
          </div>
        </DialogContent>
      </Dialog>

      <CongratulationsModal isOpen={showCongrats} onClose={() => setShowCongrats(false)} />
    </>
  );
}

