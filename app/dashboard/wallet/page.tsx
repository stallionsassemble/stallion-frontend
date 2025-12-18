"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/ui/kpi-card";
import { AddPaymentMethodModal } from "@/components/wallet/add-payment-method-modal";
import { WithdrawFundsModal } from "@/components/wallet/withdraw-funds-modal";
import { ArrowDownLeft, ArrowUpRight, BadgeDollarSign, Calendar, ChevronLeft, ChevronRight, Clock, Coins, DollarSign, History, Pencil, Plus, Search, Send, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const assets = [
  {
    symbol: "USGLO",
    name: "USGLO",
    amount: "500 USGLO",
    value: "$5,590.90",
    icon: "/assets/icons/usglo.png",
  },
  {
    symbol: "USDC",
    name: "USDC",
    amount: "3,240.5 USDC",
    value: "$5,590.90",
    icon: "/assets/icons/usdc.png",
  },
  {
    symbol: "XLM",
    name: "XLM",
    amount: "15,420 XLM",
    value: "$5,590.90",
    icon: "/assets/icons/xlm.png",
  },
];

const payoutMethods = [
  {
    id: 1,
    name: "Crypto Wallet",
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    type: "wallet",
  },
  {
    id: 2,
    name: "Crypto Wallet",
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    type: "wallet",
  },
  {
    id: 3,
    name: "Crypto Wallet",
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    type: "wallet",
  },
];

const transactions = [
  {
    id: 1,
    title: "Smart Contract Audit - DeFi Protocol",
    type: "Bounty Reward",
    date: "2024-01-12",
    status: "Paid",
    amount: "$3,500",
    currency: "USDC",
    icon: ArrowDownLeft,
  },
  {
    id: 2,
    title: "Frontend Development - Milestone 2",
    type: "Project Milestone",
    date: "2024-01-12",
    status: "Paid",
    amount: "$3,500",
    currency: "USGLO",
    icon: ArrowDownLeft,
  },
  {
    id: 3,
    title: "Withdrawal to External Wallet",
    type: "Project Milestone",
    date: "2024-01-12",
    status: "In Progress",
    amount: "$3,500",
    currency: "XLM",
    icon: ArrowUpRight,
  },
  {
    id: 4,
    title: "Bug Fix - Authentication Module",
    type: "Bounty Reward",
    date: "2024-01-12",
    status: "Paid",
    amount: "$3,500",
    currency: "XLM",
    icon: ArrowDownLeft,
  },
  {
    id: 5,
    title: "Bug Fix - Authentication Module",
    type: "Bounty Reward",
    date: "2024-01-12",
    status: "Paid",
    amount: "$3,500",
    currency: "XLM",
    icon: ArrowDownLeft,
  },
  {
    id: 6,
    title: "Withdrawal to External Wallet",
    type: "Project Milestone",
    date: "2024-01-12",
    status: "In Progress",
    amount: "$3,500",
    currency: "XLM",
    icon: ArrowUpRight,
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("Assets");
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [showWithdrawFundsModal, setShowWithdrawFundsModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Balance"
          value="$22,960"
          status="Across all tokens"
          statusColor="text-primary font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="Pending"
          value="$5,000"
          status="Awaiting release"
          statusColor="text-[#FF9500] font-medium text-sm"
          icon={Clock}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
        <KpiCard
          label="This Month"
          value="$4,300"
          status="+12% from last month"
          statusColor="text-green-500 font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-foreground"
          className="rounded-2xl border-border bg-card"
          layout="row"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-[12px] overflow-x-auto no-scrollbar max-w-full">
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

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "Assets" && (
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Image
                      src={asset.icon}
                      alt={asset.name}
                      className="w-6 h-6 object-contain"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold font-inter">{asset.symbol}</h4>
                    <p className="text-sm font-inter text-muted-foreground">{asset.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-foreground font-bold font-space-grotesk block">{asset.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Transactions" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h3 className="text-foreground font-bold">Transaction History</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search by title or skill..." className="pl-9 bg-card border-border h-9 w-full text-xs" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Button variant="outline" className="pl-9 bg-card border-border h-9 text-xs text-muted-foreground font-normal w-full sm:w-auto">Pick a date range</Button>
                  </div>
                  <Button variant="outline" className="bg-card border-border h-9 text-xs text-muted-foreground font-normal">Newest</Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-primary/10 overflow-hidden rounded-xl">
              {transactions.map((tx, i) => (
                <div key={tx.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors gap-4`}>
                  <div className="flex items-start sm:items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground shrink-0 mt-1 sm:mt-0">
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-foreground font-inter font-bold text-[16px] truncate">{tx.title}</h4>
                        <Badge variant="secondary" className={`${tx.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'} text-[10px] h-5 px-1.5 shrink-0`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col text-[12px] font-inter font-medium text-muted-foreground mt-0.5">
                        <span>{tx.type}</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className="text-foreground font-inter font-bold text-[24px]">{tx.amount}</span>
                    <Badge className="font-inter text-foreground text-[10px] px-1.5 h-5 bg-card border border-border shrink-0">{tx.currency}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-between sm:justify-end items-center gap-4 text-sm font-inter text-foreground py-4">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="text-muted-foreground whitespace-nowrap">Rows per page</span>
                <select className="bg-card border border-border rounded px-2 py-1 text-foreground text-xs">
                  <option>6</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-muted-foreground">Page 1 of 1</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="outline" className="h-8 w-8 border-border bg-transparent text-foreground" disabled><ChevronLeft className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" className="h-8 w-8 border-border bg-transparent text-foreground" disabled><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Payouts" && (
          <div className="space-y-6">
            <h3 className="text-foreground font-bold font-inter text-lg">Payout Methods</h3>

            <div className="space-y-3">
              {payoutMethods.map((method) => <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-primary/10 gap-4">
                <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground font-bold font-inter truncate">{method.name}</h4>
                    <p className="text-xs font-inter text-ring break-all leading-relaxed">{method.value}</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors ml-14 sm:ml-0">
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              )}
            </div>

            <Button
              variant="stallion-outline"
              className="w-full border-dashed border-[0.77px]  h-[52px] gap-2 rounded-xl text-foreground hover:text-foreground hover:bg-background/5 cursor-pointer"
              onClick={() => setShowAddMethodModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>

      <AddPaymentMethodModal isOpen={showAddMethodModal} onClose={() => setShowAddMethodModal(false)} />
      <WithdrawFundsModal isOpen={showWithdrawFundsModal} onClose={() => setShowWithdrawFundsModal(false)} />
    </div >
  );
}
