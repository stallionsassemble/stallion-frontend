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
      <DialogContent className="bg-background border-border sm:max-w-md p-0 overflow-hidden flex flex-col items-center justify-center text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-muted-foreground hover:text-foreground z-50"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>

        <div className="pt-12 pb-10 px-6 flex flex-col items-center w-full">
          {/* Logo Cluster */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* User Avatar (Front/Left) */}
            <div className="h-20 w-20 rounded-full overflow-hidden border-[3px] border-background relative z-20 -mr-4">
              <Image
                src="https://avatar.vercel.sh/john"
                width={80}
                height={80}
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Stallion Logo (Back/Right) */}
            <div className="h-20 w-20 rounded-full overflow-hidden border-[3px] border-background bg-card relative z-10 flex items-center justify-center">
              <Image
                src="https://avatar.vercel.sh/shadcn"
                width={80}
                height={80}
                alt="Stallion"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Congratulations Pill */}
          <div className="relative w-full max-w-sm mb-6">
            <div className="bg-background rounded-[1666.13px] py-4 px-2 w-[392px] h-[69px] flex items-center justify-center shadow-lg">
              <h2 className="text-3xl md:text-3xl font-extrabold leading-[68.18px] text-foreground italic -tracking-[1.55px] font-syne">
                Congratulations
              </h2>
            </div>
          </div>

          <div className="space-y-1 mb-10">
            <p className="text-muted-foreground tracking-[4%] font-light text-xs">Your application has been successfully submitted.
              <br />
              We'll notify you once it's been reviewed.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[300px]">
            <Button
              className="w-full bg-primary hover:bg-primary/95 h-12 rounded-[10px] font-medium font-inter leading-[23px] text-primary-foreground text-base"
              onClick={() => {
                onClose();
                router.push("/dashboard/bounties");
              }}
            >
              Browse Bounties
            </Button>
            <Button
              variant="outline"
              className="w-full bg-background hover:bg-muted border-[1.19px] border-border text-foreground h-12 rounded-[10px] leading-[23px text-base font-normal shadow-sm"
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
