"use client";

import { Button } from "@/components/ui/button";
import { WithdrawFundsModal } from "@/components/wallet/withdraw-funds-modal";
import { useCryptoPrice } from "@/lib/api/pricing/queries";
import { useGetWalletBalances } from "@/lib/api/wallet/queries";
import { BadgeDollarSign, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// Vertical Marquee Component (CSS Animation)
function VerticalMarquee({
  children,
  height = "h-[200px]",
  duration = "30s",
  reverse = false,
}: {
  children: React.ReactNode;
  height?: string;
  duration?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${height}`}>
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex flex-col gap-3 w-full hover:paused"
        style={{
          animation: `verticalMarquee ${duration} linear infinite ${reverse ? 'reverse' : 'normal'}`
        }}
      >
        {children}
        {children} {/* Duplicate content for seamless loop */}
      </div>
      <style jsx>{`
        @keyframes verticalMarquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}

const topEarners = [
  { name: "Emmanuel Malik", role: "FC2 Front-end Engineer", amount: "$200,800", avatar: "https://avatar.vercel.sh/emmanuel" },
  { name: "Sarah Jenkins", role: "UI Designer", amount: "$180,500", avatar: "https://avatar.vercel.sh/sarah" },
  { name: "David Chen", role: "Smart Contract Dev", amount: "$150,000", avatar: "https://avatar.vercel.sh/david" },
  { name: "Maria Garcia", role: "Product Manager", amount: "$120,800", avatar: "https://avatar.vercel.sh/maria" },
  { name: "James Smith", role: "Backend Engineer", amount: "$110,000", avatar: "https://avatar.vercel.sh/james" },
  { name: "Linda Kim", role: "Full Stack Dev", amount: "$95,000", avatar: "https://avatar.vercel.sh/linda" },
];

export function DashboardRightSidebar() {
  const { data: walletData, isLoading: isLoadingWallet } = useGetWalletBalances();

  const balance = walletData?.balances?.[0]?.availableBalance || 0;
  const currency = walletData?.balances?.[0]?.currency || 'USDC';

  const { data: price = 1 } = useCryptoPrice(currency);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const totalUsd = useMemo(() => {
    return balance * price;
  }, [balance, price]);

  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalUsd);

  // Helper to choose icon based on currency
  const getCurrencyIcon = (curr: string) => {
    switch (curr.toUpperCase()) {
      case 'XLM': return "/assets/icons/xlm.png";
      case 'USGLO': return "/assets/icons/usglo.png";
      default: return "/assets/icons/usdc.png";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <WithdrawFundsModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={balance}
        currency={currency}
      />

      {/* Top Earners */}
      <div className="flex flex-col justify-center items-start gap-[10px] relative h-[200px]">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-medium flex items-center gap-1 text-foreground uppercase tracking-wider">
            <Crown className="h-4 w-4 text-foreground" />
            Top Earners
          </h3>
          <button className="text-[12px] text-foreground hover:underline"><Link href="/dashboard/leaderboard">Leaderboard &gt;</Link></button>
        </div>

        {/* Vertical Marquee Top Earners */}
        <VerticalMarquee height="h-full" duration="40s">
          {topEarners.map((earner, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-1 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                  <Image src={earner.avatar} width={32} height={32} alt={earner.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{earner.name}</p>
                  <p className="text-[10px] text-muted-foreground">{earner.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-xs font-extrabold text-foreground">{earner.amount}</p>
                  <div className="w-[36px] h-[26px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium font-inter">USDC</div>
                </div>
                <p className="text-[10px] text-muted-foreground text-right">#{i + 1}</p>
              </div>
            </div>
          ))}
        </VerticalMarquee>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-[20px] border border-border bg-card relative overflow-hidden group shadow-2xl">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>

        {/* Total Balance Header Card */}
        <div className="flex flex-col items-center justify-center mb-4 relative z-10 w-full bg-primary/5 border-b border-border pt-3 pb-3 px-4">
          <div className="mb-0.5 text-muted-foreground text-center">
            <BadgeDollarSign className="w-4 h-4 mx-auto mb-0.5 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-inter font-medium text-foreground">Total Balance</span>
          </div>
          {isLoadingWallet ? (
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <h2 className="text-2xl font-inter font-bold leading-tight text-foreground tracking-tight text-center">
              {formattedTotal}
              {!['USD', 'USDC', 'USGLO'].includes(currency) && (
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  (~{balance} {currency})
                </span>
              )}
            </h2>
          )}
        </div>

        <div className="space-y-2 mb-4 px-4">
          {/* Only showing the actual held asset since API doesn't give breakdown */}
          {!isLoadingWallet && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  <img
                    src={getCurrencyIcon(currency)}
                    alt={currency}
                    className="w-4 h-4 object-contain"
                    onError={(e) => e.currentTarget.src = "/assets/icons/usdc.png"}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-foreground">{currency}</span>
                  <span className="text-[9px] font-inter text-muted-foreground">{balance} {currency}</span>
                </div>
              </div>
              <span className="text-base font-space-grotesk leading-tight font-bold text-foreground">{formattedTotal}</span>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <Button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-xl font-medium font-inter text-sm transition-all shadow-lg shadow-primary/20"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Recent Earners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-1 uppercase tracking-wider">
            <BadgeDollarSign className="w-4 h-4 text-primary" />
            Recent Earners</h3>
          <button className="text-[12px] text-foreground hover:underline"><Link href="/dashboard/leaderboard">Leaderboard &gt;</Link></button>
        </div>

        {/* Vertical Marquee Recent Earners */}
        <VerticalMarquee height="h-[160px]" duration="25s" reverse={true}>
          {topEarners.map((earner, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-1 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                  <Image src={earner.avatar} width={32} height={32} alt={earner.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{earner.name}</p>
                  <p className="text-[10px] text-muted-foreground">{earner.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-xs font-extrabold text-foreground">{earner.amount}</p>
                  <div className="w-[36px] h-[26px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium font-inter">USDC</div>
                </div>
              </div>
            </div>
          ))}
        </VerticalMarquee>
      </div>
    </div>
  );
}
