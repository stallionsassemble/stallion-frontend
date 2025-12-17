"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/ui/kpi-card";
import { AddPaymentMethodModal } from "@/components/wallet/add-payment-method-modal";
import { ArrowDownLeft, ArrowUpRight, BadgeDollarSign, Calendar, ChevronLeft, ChevronRight, Clock, Coins, DollarSign, History, Pencil, Plus, Search, Wallet } from "lucide-react";
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
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
          className="rounded-2xl border-white/10 bg-[#09090B]"
          layout="row"
        />
        <KpiCard
          label="Pending"
          value="$5,000"
          status="Awaiting release"
          statusColor="text-[#FF9500] font-medium text-sm"
          icon={Clock}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-white/10 bg-[#09090B]"
          layout="row"
        />
        <KpiCard
          label="This Month"
          value="$4,300"
          status="+12% from last month"
          statusColor="text-green-500 font-medium text-sm"
          icon={DollarSign}
          valueClassName="text-4xl text-white"
          className="rounded-2xl border-white/10 bg-[#09090B]"
          layout="row"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-[#18181B] rounded-[12px]">
          {["Assets", "Transactions", "Payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-inter font-normal rounded-md transition-colors ${activeTab === tab
                ? "bg-background text-white"
                : "text-gray-400 hover:text-white"
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

        {/* <Button
          className="bg-primary hover:bg-[#0066CC] text-white font-medium rounded-lg px-6 gap-2"
          onClick={() => setShowWithdrawModal(true)}
        >
          <Send className="w-4 h-4" /> Withdraw Fund
        </Button> */}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "Assets" && (
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-[#0C62C024] hover:bg-[#0C62C024] transition-colors"
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
                    <h4 className="text-white font-bold font-inter">{asset.symbol}</h4>
                    <p className="text-sm font-inter text-[#737373]">{asset.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold font-space-grotesk block">{asset.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Transactions" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Transaction History</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input placeholder="Search by title or skill..." className="pl-9 bg-[#09090B] border-white/10 h-9 w-64 text-xs" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Button variant="outline" className="pl-9 bg-[#09090B] border-white/10 h-9 text-xs text-gray-400 font-normal">Pick a date range</Button>
                </div>
                <Button variant="outline" className="bg-[#09090B] border-white/10 h-9 text-xs text-gray-400 font-normal">Newest</Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0C62C024] overflow-hidden">
              {transactions.map((tx, i) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-[#007AFF]' : ''} hover:bg-white/5 transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#007AFF7A] flex items-center justify-center text-white">
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-inter font-bold text-[16px]">{tx.title}</h4>
                        <Badge variant="secondary" className={`${tx.status === 'Paid' ? 'bg-[#30A46C80] text-white' : 'bg-[#A47230AB] text-white'} text-[10px] h-5 px-1.5`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col text-[12px] font-inter font-medium text-muted-foreground mt-0.5">
                        <span>{tx.type}</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-inter font-bold text-[24px]">{tx.amount}</span>
                    <Badge className="font-inter text-white text-[10px] px-1.5 h-5">{tx.currency}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 text-sm font-inter text-foreground py-2">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select className="bg-[#09090B] border border-white/10 rounded px-2 py-1">
                  <option>6</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <span>Page 1 of 1</span>
              <div className="flex gap-1">
                <Button size="icon" variant="outline" className="h-7 w-7 border-white/10 bg-transparent" disabled><ChevronLeft className="w-4 h-4" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 border-white/10 bg-transparent" disabled><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Payouts" && (
          <div className="space-y-6">
            <h3 className="text-white font-bold font-inter text-lg">Payout Methods</h3>

            <div className="space-y-3">
              {payoutMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0C62C024]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#007AFF7A] flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-inter">{method.name}</h4>
                      <p className="text-xs font-inter text-ring">{method.value}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-white hover:text-white transition-colors">
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="stallion-outline"
              className="w-full border-dashed border-[0.77px]  h-[52px] gap-2 rounded-xl text-foreground hover:text-foreground hover:bg-[#007AFF]/5 cursor-pointer"
              onClick={() => setShowWithdrawModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>

      <AddPaymentMethodModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </div>
  );
}
