import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Link from "next/link";

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredAmount: string; // e.g. "2000"
  currency: string; // e.g. "USDC"
}

export function InsufficientBalanceModal({
  isOpen,
  onClose,
  requiredAmount,
  currency,
}: InsufficientBalanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-none sm:max-w-[600px] flex flex-col items-center justify-center text-center p-12 [&>button]:hidden">

        {/* Close Button manually placed to match design */}
        <div className="absolute right-6 top-6 z-50">
          <button
            onClick={onClose}
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <DialogHeader className="mb-8 space-y-2">
          <DialogTitle className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Insufficient Wallet Balance
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Transfer funds to your preferred payout method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-w-[400px]">
          <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight font-wide tracking-wide uppercase">
            Fund Your Wallet to Continue
          </h2>

          <div className="text-muted-foreground text-sm font-light space-y-1">
            <p>You need to fund your wallet before creating a project</p>
            <p>Please add funds to continue and publish your bounty project.</p>
          </div>

          <div className="pt-4">
            <Button
              asChild
              onClick={onClose}
              variant="stallion"
              className="w-full h-12 rounded-lg text-base font-bold"
            >
              <Link href="/dashboard/wallet">
                Fund Wallet
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
