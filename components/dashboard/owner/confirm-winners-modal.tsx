'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSelectWinners } from "@/lib/api/bounties/queries";
import { useCreateReview } from "@/lib/api/reviews/queries";
import { Winner } from "@/lib/hooks/use-bounty-winners";
import { Loader2, Trophy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ConfirmWinnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  bountyId: string;
  bountyTitle: string;
  currency?: string;
  winners: Winner[];
  onConfirmed?: () => void;
}

const POSITION_MEDALS = ['🥇', '🥈', '🥉'];

export function ConfirmWinnersModal({
  isOpen,
  onClose,
  bountyId,
  bountyTitle,
  currency = "USDC",
  winners,
  onConfirmed,
}: ConfirmWinnersModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutateAsync: selectWinners } = useSelectWinners();
  const { mutateAsync: createReview } = useCreateReview();

  const handleConfirm = async () => {
    if (winners.length === 0) {
      toast.error("No winners selected");
      return;
    }

    setIsConfirming(true);

    try {
      // 1. Call selectWinners API with user IDs (not submission IDs)
      const userIds = winners.sort((a, b) => a.position - b.position).map((w) => w.userId);
      await selectWinners({ id: bountyId, payload: { winners: userIds } });

      // 2. Create reviews for each winner with rating/feedback
      const reviewPromises = winners
        .filter((w) => w.rating && w.rating > 0)
        .map((w) =>
          createReview({
            userId: w.userId,
            payload: { rating: w.rating!, message: w.feedback || "" },
          })
        );

      await Promise.allSettled(reviewPromises);

      toast.success("Winners confirmed and prizes distributed!");
      onConfirmed?.();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to confirm winners");
    } finally {
      setIsConfirming(false);
    }
  };

  const sortedWinners = [...winners].sort((a, b) => a.position - b.position);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-background border-border text-foreground p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 px-8 border-b border-white/5 bg-background">

          <h1 className="text-2xl font-bold text-white mb-1">Confirm Winners & Distribute Prizes</h1>
          <p className="text-sm text-slate-500">Choose a prize for {bountyTitle}.</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-[#09090b]/50">
          <p className="text-sm text-slate-400">
            You're about to confirm the final winners for this bounty and distribute the prize funds as follows:
          </p>

          <div className="space-y-3">
            {sortedWinners.map((winner) => {
              const medal = POSITION_MEDALS[winner.position - 1] || '🏅';
              const currencySymbol = currency === 'XLM' ? '' : '$';

              return (
                <div
                  key={winner.userId}
                  className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{medal}</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={winner.avatar} />
                        <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">
                          {winner.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">{winner.name}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {currencySymbol}{winner.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-background grid grid-cols-2 gap-4">
          <Button
            variant="stallion-outline"
            className="h-12 border-primary hover:bg-background/60 w-full rounded-lg font-medium flex items-center justify-center gap-2"
            onClick={onClose}
            disabled={isConfirming}
          >
            <X className="h-4 w-4" /> Cancel Selection
          </Button>
          <Button
            variant="stallion"
            className="h-12 w-full rounded-lg font-bold flex items-center justify-center gap-2"
            onClick={handleConfirm}
            disabled={isConfirming || winners.length === 0}
          >
            {isConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trophy className="h-4 w-4" />
            )}
            Confirm Winners
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
