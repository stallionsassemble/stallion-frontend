"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CongratulationsModal({ isOpen, onClose }: CongratulationsModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#02010A] border-white/10 sm:max-w-md p-0 overflow-hidden flex flex-col items-center justify-center text-center [&>button]:hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-50"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>

        <div className="pt-12 pb-6 px-6 flex flex-col items-center w-full">
          {/* Logo Cluster */}
          <div className="relative mb-8">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-[#02010A] relative z-10 -mr-6 inline-block">
              <Image
                src="https://avatar.vercel.sh/john"
                width={96}
                height={96}
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-[#02010A] bg-white relative z-0 inline-flex items-center justify-center">
              <Image
                src="/assets/icons/sdollar.png"
                width={60}
                height={60}
                alt="Stallion"
                className="object-contain"
              />
            </div>
          </div>

          {/* Text */}
          <div className="relative w-full mb-4">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-12 bg-primary blur-2xl opacity-40 rounded-full pointer-events-none" />
            <h2 className="relative text-4xl md:text-5xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
              Congratulations
            </h2>
            {/* Text Outline/Stroke workaround if needed, but font-black usually sufficient */}
          </div>

          <p className="text-gray-400 text-sm mb-1">Your application has been successfully submitted.</p>
          <p className="text-gray-400 text-sm mb-8">We'll notify you once it's been reviewed.</p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              className="w-full bg-primary hover:bg-[#0066CC] h-11 font-medium text-white"
              onClick={() => {
                onClose();
                router.push("/dashboard/bounties");
              }}
            >
              Browse Bounties
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent border-white/20 text-white h-11 hover:bg-white/5"
              onClick={() => {
                onClose();
                router.push("/dashboard/submissions");
              }}
            >
              Check Submission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
