"use client";

import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { WithdrawFundsModal } from "@/components/wallet/withdraw-funds-modal";
import { useProjectOwnerStatsQuery } from "@/lib/api/dashboard/queries";
import { useGetPrices } from "@/lib/api/prices/queries";
import { useGetWalletBalances } from "@/lib/api/wallet/queries";
import { getCurrencyIcon } from "@/lib/utils";
import { DollarSign, FileText, Timer, Users, Wallet } from "lucide-react";
import { useState } from "react";

export function OwnerRightSidebar() {
  const { data: walletData, isLoading: isLoadingWallet } = useGetWalletBalances();
  const { data: ownerStats, isLoading: isLoadingStats } = useProjectOwnerStatsQuery();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const assets = walletData?.balances || [];
  const topAssets = assets.slice(0, 3);

  // Extract currency codes to fetch prices for
  const currencies = assets.map((a: any) => a.currency);
  const { data: prices = {} } = useGetPrices(currencies);

  const totalBalance = assets.reduce((sum: number, asset: any) => {
    const price = prices[asset.currency] || (['usdc', 'usd'].includes(asset.currency.toLowerCase()) ? 1 : 0);
    return sum + (asset.availableBalance * price);
  }, 0);

  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance);

  return (
    <div className="space-y-6 w-full">
      <WithdrawFundsModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={assets[0]?.availableBalance || 0}
        currency={assets[0]?.currency || 'USDC'}
        balances={walletData}
      />

      {/* Total Balance Card */}
      <div className="rounded-[20px] border border-border bg-card relative overflow-hidden group shadow-2xl">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>

        {/* Total Balance Header Card */}
        <div className="flex flex-col items-center justify-center mb-4 relative z-10 w-full bg-primary/5 border-b border-border pt-3 pb-3 px-4">
          <div className="mb-0.5 text-muted-foreground text-center">
            <Wallet className="w-4 h-4 mx-auto mb-0.5 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-inter font-medium text-foreground">Total Balance</span>
          </div>
          {isLoadingWallet ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <h2 className="text-2xl font-inter font-bold leading-tight text-foreground tracking-tight text-center">
              {formattedTotal}
            </h2>
          )}
        </div>

        <div className="space-y-2 mb-4 px-4">
          {!isLoadingWallet && topAssets.map((asset: any, idx: number) => {
            const price = prices[asset.currency] || (['usdc', 'usd'].includes(asset.currency.toLowerCase()) ? 1 : 0);
            const usdValue = (asset.availableBalance || 0) * price;

            return (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    <img
                      src={getCurrencyIcon(asset.currency)}
                      width={16}
                      height={16}
                      onError={(e) => e.currentTarget.src = "/assets/icons/usdc.png"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-foreground">{asset.currency}</span>
                    <span className="text-[9px] font-inter text-muted-foreground">{asset.availableBalance} {asset.currency}</span>
                  </div>
                </div>
                <span className="text-sm font-space-grotesk leading-tight font-bold text-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdValue)}
                </span>
              </div>
            );
          })}
          {!isLoadingWallet && topAssets.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">No assets found</p>
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

      {/* Owner Stats Stacked */}
      <div className="space-y-4">
        {/* Total Paid Out */}
        <KpiCard
          layout="row"
          iconAlignment="center"
          label="Total Paid Out"
          value={ownerStats?.totalPaidOut}
          valuePrefix="$"
          icon={DollarSign}
          borderColor="hover:border-blue-500/50"
          className="bg-background border-[1.17px] border-border h-full"
          iconClassName="text-white"
          iconContainerClassName="bg-white/5 border-white/5"
        />

        {/* Pending Payments */}
        <KpiCard
          layout="row"
          iconAlignment="center"
          label="Pending Payments"
          value={ownerStats?.pendingPayments}
          valuePrefix="$"
          icon={Timer}
          borderColor="hover:border-blue-500/50"
          className="bg-background border-[1.17px] border-border h-full"
          iconClassName="text-white"
          iconContainerClassName="bg-white/5 border-white/5"
        />

        {/* Total Bounties */}
        <KpiCard
          layout="row"
          iconAlignment="center"
          label="Total Bounties"
          value={ownerStats?.totalBountiesCreated}
          icon={FileText}
          borderColor="hover:border-blue-500/50"
          className="bg-background border-[1.17px] border-border h-full"
          iconClassName="text-white"
          iconContainerClassName="bg-white/5 border-white/5"
        />

        {/* Total Contributors */}
        <KpiCard
          layout="row"
          iconAlignment="center"
          label="Contributors"
          value={ownerStats?.totalContributors || 0}
          icon={Users}
          borderColor="hover:border-blue-500/50"
          className="bg-background border-[1.17px] border-border h-full"
          iconClassName="text-white"
          iconContainerClassName="bg-white/5 border-white/5"
        />
      </div>


    </div>
  );
}
