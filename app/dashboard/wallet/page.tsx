"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPaymentMethodModal } from "@/components/wallet/add-payment-method-modal";
import { WithdrawFundsModal } from "@/components/wallet/withdraw-funds-modal";
import { walletService } from "@/lib/api/wallet";
import { useDeletePayoutMethod, useGetPayoutMethods } from "@/lib/api/wallet/queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, BadgeDollarSign, ChevronLeft, ChevronRight, Clock, Coins, DollarSign, History, Loader2, Plus, Search, Send, Trash2, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const payoutMethods = [
  {
    id: 1,
    name: "Crypto Wallet",
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    type: "wallet",
  },
];

const getCurrencyIcon = (currency: string) => {
  const code = currency.toLowerCase();
  switch (code) {
    case 'usdc':
      return '/assets/icons/usdc.png';
    case 'usglo':
      return '/assets/icons/usglo.png';
    case 'xlm':
      return '/assets/icons/xlm.png';
    default:
      return '/assets/icons/dollar.png'; // Fallback
  }
};

// ... imports

function WalletStats({ balances }: { balances: any }) { // Type this properly
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const pendingAmount = balances ? balances.balance - balances.availableBalance : 0;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Balance"
          value={formatCurrency(balances?.availableBalance || 0, balances?.currency || "USD")}
          status="Available to withdraw"
          statusColor="text-primary font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="Pending"
          value={formatCurrency(pendingAmount, balances?.currency || "USD")}
          status="Awaiting release"
          statusColor="text-[#FF9500] font-medium text-sm"
          icon={Clock}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="Estimated Value"
          value={formatCurrency(balances?.balance || 0, balances?.currency || "USD")}
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
        availableBalance={balances.availableBalance}
      />
    </>
  );
}

function WalletAssetList({ balances }: { balances: any }) {
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-3 min-h-[400px]">
      <div
        className="flex items-center justify-between p-4 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <Image
              src={getCurrencyIcon(balances.currency)}
              alt={balances.currency}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h4 className="text-foreground font-bold font-inter">{balances.currency}</h4>
            <p className="text-sm font-inter text-muted-foreground">Available</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-foreground font-bold font-space-grotesk block">{formatCurrency(balances.availableBalance, balances.currency)}</span>
        </div>
      </div>
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
            <div key={tx.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 ${i !== paginatedTransactions.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors gap-4`}>
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

  // Fetch all data upfront to avoid suspense during tab switching and ensure instant access
  const { data: balances, isLoading: isBalancesLoading } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: async () => {
      try {
        return await walletService.getWalletBalances();
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            balance: 0,
            availableBalance: 0,
            currency: 'USD',
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
      {/* 
          Stats are always visible.
          We now pass balances props.
      */}
      <WalletStats balances={balances} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-[12px] overflow-x-auto no-scrollbar max-w-full">
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

        <Button
          className="bg-primary hover:bg-primary/90 text-sm sm:text-[16px] text-primary-foreground font-medium font-inter rounded-lg px-6 gap-2 w-full sm:w-auto h-11 sm:h-12"
          onClick={() => setShowWithdrawFundsModal(true)}
        >
          <Send className="w-4 h-4" /> Withdraw Fund
        </Button>
      </div>

      {/* Tab Content Areas */}
      {/* 
          Directly rendering components.
          Since data is already fetched in Page (and suspended there via loading.tsx), 
          switching tabs is now instant and sync.
      */}

      {activeTab === "Assets" && (
        balances && balances.balance > 0 ? <WalletAssetList balances={balances} /> : (
          <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-xl border border-dashed border-primary/20 min-h-[400px]">
            <Coins className="h-10 w-10 text-primary/40 mb-3" />
            <p className="text-muted-foreground text-sm">No assets found.</p>
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
        <BalancesConsumerModal isOpen={showWithdrawFundsModal} onClose={() => setShowWithdrawFundsModal(false)} availableBalance={balances?.availableBalance || 0} currency={balances?.currency || "USD"} />
      )}
    </div>
  );
}


