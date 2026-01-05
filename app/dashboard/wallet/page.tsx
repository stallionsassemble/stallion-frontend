"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/ui/kpi-card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddPaymentMethodModal } from "@/components/wallet/add-payment-method-modal";
import { WithdrawFundsModal } from "@/components/wallet/withdraw-funds-modal";
import { useGetSupportedCurrencies } from "@/lib/api/bounties/queries";
import { toast } from "sonner";

import { useGetPrices } from "@/lib/api/prices/queries";
import { walletService } from "@/lib/api/wallet";
import { useDeletePayoutMethod, useGetDepositAddress, useGetPayoutMethods, useSetTrustline, useSyncWallet, useUnsetTrustline } from "@/lib/api/wallet/queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn, getCurrencyIcon } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, BadgeDollarSign, CheckCircle2, ChevronLeft, ChevronRight, Clock, Coins, Copy, DollarSign, History, Info, Loader2, Plus, RefreshCcw, Search, Send, Trash2, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DateRange } from "react-day-picker";




function WalletStats({ balances }: { balances: any }) {
  // balances is now { balances: [], totalAssets: number }
  const assets = balances?.balances || [];

  // Extract currency codes to fetch prices for
  const currencies = assets.map((a: any) => a.currency);
  const { data: prices = {} } = useGetPrices(currencies);

  // Calculate Total Value
  const totalValue = assets.reduce((sum: number, asset: any) => {
    // If USD/USDC, price is 1 (or close to it via API). If API fails, default to 0 for volatile, 1 for stable if known.
    // Our service defaults to 1 for 'usd'.
    const price = prices[asset.currency] || (['usdc', 'usd'].includes(asset.currency.toLowerCase()) ? 1 : 0);
    return sum + (asset.balance * price);
  }, 0);

  // Calculate Pending Value (using same logic)
  const pendingValue = assets.reduce((sum: number, asset: any) => {
    const price = prices[asset.currency] || (['usdc', 'usd'].includes(asset.currency.toLowerCase()) ? 1 : 0);
    const pending = asset.balance - asset.availableBalance;
    return sum + (pending * price);
  }, 0);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (e) {
      return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} ${currency}`;
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Balance"
          value={formatCurrency(totalValue, "USD")}
          status={`${assets.length} Assets Held`}
          statusColor="text-primary font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="Pending"
          value={formatCurrency(pendingValue, "USD")}
          status="Awaiting release"
          statusColor="text-[#FF9500] font-medium text-sm"
          icon={Clock}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="This month"
          value={formatCurrency(totalValue, "USD")} // Placeholder: Real monthly gain needs history API
          status="Total account value"
          statusColor="text-green-500 font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-foreground"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
      </div>

      <WithdrawFundsModal
        isOpen={false}
        onClose={() => { }}
        availableBalance={totalValue} // Allow withdraw check against total USD value? Or specific asset?
      // Note: Withdraw modal usually needs specific asset. For now, this prop might be unused or just indicative.
      />
    </>
  );
}

function WalletAssetList({ balances }: { balances: any }) {
  // balances is { balances: [...], ... }
  const assets = balances?.balances || [];
  const { mutate: unsetTrustline, isPending } = useUnsetTrustline();

  const formatCurrency = (amount: number, currency: string = "USD") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (e) {
      return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} ${currency}`;
    }
  };

  const handleRemove = (currency: string) => {
    unsetTrustline(currency);
  };

  return (
    <div className="space-y-3 min-h-[400px]">
      {assets.map((asset: any, i: number) => (
        <div
          key={asset.currency + i}
          className="flex items-center justify-between p-4 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Image
                src={getCurrencyIcon(asset.currency)}
                alt={asset.currency}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h4 className="text-foreground font-bold font-inter">{asset.currency}</h4>
              <p className="text-sm font-inter text-muted-foreground">{asset.asset_type === 'native' ? 'Native Token' : 'Asset'}</p>
            </div>
          </div>
          <div className="text-right flex items-center gap-4">
            <div>
              <span className="text-foreground font-bold font-space-grotesk block">{formatCurrency(asset.availableBalance, asset.currency)}</span>
              {asset.balance !== asset.availableBalance && (
                <span className="text-xs text-muted-foreground">Total: {formatCurrency(asset.balance, asset.currency)}</span>
              )}
            </div>
            {asset.asset_type !== 'native' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(asset.currency)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WalletTransactions({ transactions }: { transactions: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Client-side filtering
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.type.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      tx.currency.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      tx.amount.toString().includes(debouncedSearchQuery);

    if (!matchesSearch) return false;

    if (dateRange?.from) {
      const txDate = new Date(tx.createdAt);
      const start = startOfDay(dateRange.from);
      const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

      return isWithinInterval(txDate, { start, end });
    }

    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  return (
    <div className="space-y-4 min-h-[400px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-foreground font-bold">Transaction History</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or skill..."
              className="pl-9 bg-card border-border h-9 w-full text-xs"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
              className="w-full sm:w-auto"
            />
            <Button
              variant="outline"
              className="bg-card border-border h-9 text-xs text-muted-foreground font-normal min-w-[80px]"
              onClick={toggleSortOrder}
            >
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 overflow-hidden rounded-xl">
        {paginatedTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No transactions found</div>
        ) : (
          paginatedTransactions.map((tx, i) => (
            <div key={tx.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 ${i !== paginatedTransactions.length - 1 ? 'border-b border-border' : ''} gap-4`}>
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground shrink-0 mt-1 sm:mt-0">
                  {tx.type.toLowerCase().includes('withdraw') ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-foreground font-inter font-bold text-[16px] truncate">{tx.type}</h4>
                    <Badge variant="secondary" className={`${tx.state === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'} text-[10px] h-5 px-1.5 shrink-0`}>
                      {tx.state}
                    </Badge>
                  </div>
                  <div className="flex flex-col text-[12px] font-inter font-medium text-muted-foreground mt-0.5">
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <span className="text-foreground font-inter font-bold text-[24px]">{parseFloat(tx.amount).toLocaleString()}</span>
                <Badge className="font-inter text-foreground text-[10px] px-1.5 h-5 bg-card border border-border shrink-0">{tx.currency}</Badge>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap justify-between sm:justify-end items-center gap-4 text-sm font-inter text-foreground py-4">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <span className="text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            className="bg-card border border-border rounded px-2 py-1 text-foreground text-xs"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-border bg-transparent text-foreground"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-border bg-transparent text-foreground"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletStatsSkelton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

function PayoutsContent({ setShowAddMethodModal }: { setShowAddMethodModal: (val: boolean) => void }) {
  const { data: methods = [], isLoading } = useGetPayoutMethods();
  const { mutate: deleteMethod, isPending: isDeleting } = useDeletePayoutMethod();

  const handleDelete = (id: string) => {
    deleteMethod(id);
  };

  return (
    <div className="space-y-6 min-h-[400px]">
      <h3 className="text-foreground font-bold font-inter text-lg">Payout Methods</h3>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : methods.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-xl border border-dashed border-primary/20">
          <Wallet className="h-10 w-10 text-primary/40 mb-3" />
          <p className="text-muted-foreground text-sm">No payout methods added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-primary/10 gap-4 group">
              <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground font-bold font-inter truncate">{method.name}</h4>
                    {method.isDefault && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Default</Badge>}
                  </div>
                  <p className="text-xs font-inter text-ring break-all leading-relaxed">{method.publicKey}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-14 sm:ml-0">
                {/* Edit button could open a modal, skipping for now unless user asks, focusing on delete which is clearer action */}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors p-2 rounded-md hover:bg-destructive/10"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span className="sr-only sm:not-sr-only">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="stallion-outline"
        className="w-full border-dashed border-[0.77px]  h-[52px] gap-2 rounded-xl text-foreground hover:text-foreground hover:bg-background/5 cursor-pointer"
        onClick={() => setShowAddMethodModal(true)}
      >
        <Plus className="w-5 h-5" />
        Add Payout Method
      </Button>
    </div>
  );
}

function BalancesConsumerModal({ isOpen, onClose, availableBalance, currency }: { isOpen: boolean; onClose: () => void, availableBalance: number, currency: string }) {
  return <WithdrawFundsModal isOpen={isOpen} onClose={onClose} availableBalance={availableBalance} currency={currency} />;
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("Assets");
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [showWithdrawFundsModal, setShowWithdrawFundsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTrustlineModal, setShowTrustlineModal] = useState(false);
  const { mutate: syncWallet, isPending: isSyncing } = useSyncWallet();

  // Fetch all data upfront to avoid suspense during tab switching and ensure instant access
  const { data: balances, isLoading: isBalancesLoading } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: async () => {
      try {
        return await walletService.getWalletBalances();
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            balances: []
          };
        }
        throw error;
      }
    },
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      try {
        return await walletService.getTransactions();
      } catch (error: any) {
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
  });

  const isLoading = isBalancesLoading || isTransactionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ... (Stats) */}
      <WalletStats balances={balances} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-[12px] overflow-x-auto no-scrollbar max-w-full">
          {/* ... (Tabs) */}
          {["Assets", "Transactions", "Payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-inter font-normal rounded-md transition-colors ${activeTab === tab
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span className="flex items-center gap-2">
                {tab === "Assets" && <Coins className="w-3.5 h-3.5 text-primary" />}
                {tab === "Transactions" && <History className="w-3.5 h-3.5 text-primary" />}
                {tab === "Payouts" && <BadgeDollarSign className="w-3.5 h-3.5 text-primary" />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {activeTab === "Assets" && (
            <Button
              variant="outline"
              className="border-border bg-card text-foreground hover:bg-muted h-11 sm:h-12 w-full sm:w-auto gap-2"
              onClick={() => setShowTrustlineModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </Button>
          )}

          <Button
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-muted h-11 sm:h-12 w-full sm:w-auto gap-2"
            onClick={() => syncWallet()}
            disabled={isSyncing}
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            Sync
          </Button>

          <Button
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-muted h-11 sm:h-12 w-full sm:w-auto gap-2"
            onClick={() => setShowDepositModal(true)}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 text-sm sm:text-[16px] text-primary-foreground font-medium font-inter rounded-lg px-6 gap-2 w-full sm:w-auto h-11 sm:h-12"
            onClick={() => setShowWithdrawFundsModal(true)}
          >
            <Send className="w-4 h-4" /> Withdraw
          </Button>
        </div>
      </div>

      {/* ... (Tab Content) */}
      {activeTab === "Assets" && (
        balances && balances.balances && balances.balances.length > 0 ? <WalletAssetList balances={balances} /> : (
          <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-xl border border-dashed border-primary/20 min-h-[400px]">
            <Coins className="h-10 w-10 text-primary/40 mb-3" />
            <p className="text-muted-foreground text-sm">No assets found.</p>
            <Button variant="link" onClick={() => setShowTrustlineModal(true)} className="mt-2 text-primary">
              Add your first asset (Trustline)
            </Button>
          </div>
        )
      )}

      {activeTab === "Transactions" && (
        <WalletTransactions transactions={transactions || []} />
      )}

      {activeTab === "Payouts" && (
        <PayoutsContent setShowAddMethodModal={setShowAddMethodModal} />
      )}

      <AddPaymentMethodModal isOpen={showAddMethodModal} onClose={() => setShowAddMethodModal(false)} />

      {showWithdrawFundsModal && (
        <BalancesConsumerModal
          isOpen={showWithdrawFundsModal}
          onClose={() => setShowWithdrawFundsModal(false)}
          availableBalance={balances?.balances?.[0]?.availableBalance || 0}
          currency={balances?.balances?.[0]?.currency || "USD"}
        />
      )}

      {/* Modals */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <SetTrustlineModal isOpen={showTrustlineModal} onClose={() => setShowTrustlineModal(false)} />
    </div>
  );
}

// ... New Modal Components (Add these above WalletPage or in separate files, I will inline for now as requested by 'implement it')


function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: addressData, isLoading } = useGetDepositAddress();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (addressData?.address) {
      navigator.clipboard.writeText(addressData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-background p-0 gap-0 border-none sm:max-w-[500px]")}>
        <DialogHeader className="p-4 sm:p-6 flex flex-col items-start justify-center w-full shrink-0">
          <div>
            <DialogTitle className="text-[24px] sm:text-[32px] font-inter font-bold text-foreground tracking-[4%] text-left flex items-center gap-2">
              Deposit Funds
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Send Stellar-based assets (USDC, XLM) to this address. Ensure you include a Memo if required by your exchange, though for this non-custodial wallet it's usually direct.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTitle>
            <p className="text-muted-foreground font-inter font-medium text-[12px] mt-1 text-left">
              Transfer funds to your Stellar wallet
            </p>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label className="text-foreground font-bold text-base">Wallet Address (Stellar)</Label>
            </div>
            <div className="flex items-center justify-between gap-2 pl-4 pr-1 py-1 rounded-lg border border-border bg-background h-12">
              <div className="flex-1 min-w-0 font-mono text-sm text-foreground truncate select-all">
                {isLoading ? "Loading..." : addressData?.address || "Address not available"}
              </div>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0" onClick={handleCopy}>
                {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-blue-500/10 p-4 text-xs text-blue-200 border border-blue-500/20 flex gap-3 items-start">
            <Info className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
            <span className="leading-relaxed text-muted-foreground">Only send Stellar network assets (XLM, USDC on Stellar). Sending other assets may result in permanent loss.</span>
          </div>

          <Button
            onClick={onClose}
            className="w-full h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-bold text-medium rounded-lg font-inter"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SetTrustlineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: currencies = [], isLoading } = useGetSupportedCurrencies();
  const { mutate: setTrustline, isPending } = useSetTrustline();
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const handleSubmit = () => {
    if (!selectedCurrency) return;
    setTrustline(selectedCurrency, {
      onSuccess: () => {
        onClose();
        setSelectedCurrency("");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-background p-0 gap-0 border-none sm:max-w-[500px]")}>
        <DialogHeader className="p-4 sm:p-6 flex flex-col items-start justify-center w-full shrink-0">
          <div>
            <DialogTitle className="text-[24px] sm:text-[32px] font-inter font-bold text-foreground tracking-[4%] text-left flex items-center gap-2">
              Add Asset
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>On Stellar, you must establish a "Trustline" to hold a specific asset (like USDC). This requires a small reserve of XLM.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTitle>
            <p className="text-muted-foreground font-inter font-medium text-[12px] mt-1 text-left">
              Enable a new asset for your wallet
            </p>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6 pt-0">
          <div className="space-y-2">
            <Label className="text-foreground font-bold text-base">Select Asset</Label>
            <div className="relative">
              <select
                className="w-full h-12 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer appearance-none"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                style={{ backgroundImage: 'none' }}
              >
                <option value="" disabled>Select currency...</option>
                {currencies.map((c: any) => (
                  <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                ))}
              </select>
            </div>
            <p className="text-[12px] text-muted-foreground pt-1">
              Adding an asset (Trustline) requires a small XLM reserve.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!selectedCurrency || isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold text-medium rounded-lg font-inter gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Asset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


