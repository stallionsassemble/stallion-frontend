import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="bg-[#030309] border-none sm:max-w-[600px] p-0 overflow-hidden text-white gap-0">

        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Insufficient Wallet Balance</h2>
            <p className="text-xs text-foreground mt-1">Transfer funds to your preferred payout method</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center p-12 py-16">
          <div className="space-y-6 w-full">
            <h2 className="text-3xl font-syne font-extrabold text-foreground leading-tight font-wide tracking-wider">
              Fund Your Wallet to Continue
            </h2>

            <div className="text-foreground text-sm font-light leading-relaxed">
              <p>You need to fund your wallet before creating a project or bounty.</p>
            </div>

            <div className="pt-4">
              <Button
                asChild
                onClick={onClose}
                variant={'stallion'}
                className="w-[200px] h-10 rounded-lg text-sm font-semibold text-foreground border-0"
              >
                <Link href="/dashboard/owner/wallet">
                  Fund Wallet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
