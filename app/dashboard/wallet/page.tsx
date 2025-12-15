"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddPaymentMethodModal } from "@/components/wallet/add-payment-method-modal";
import { ArrowDownLeft, ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Clock, DollarSign, Download, Search, Send, Wallet } from "lucide-react";
import { useState } from "react";

const assets = [
  {
    symbol: "USGLO",
    name: "USGLO",
    amount: "500 USGLO",
    value: "$5,590.90",
    icon: "/assets/icons/usglo.png",
    color: "bg-blue-500",
  },
  {
    symbol: "USDC",
    name: "USDC",
    amount: "3,240.5 USDC",
    value: "$5,590.90",
    icon: "/assets/icons/usdc.png",
    color: "bg-cyan-500",
  },
  {
    symbol: "XLM",
    name: "XLM",
    amount: "15,420 XLM",
    value: "$5,590.90",
    icon: "/assets/icons/xlm.png",
    color: "bg-white",
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
    currencyColor: "bg-blue-500",
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
    currencyColor: "bg-blue-600",
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
    currencyColor: "bg-white text-black",
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
    currencyColor: "bg-white text-black",
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
    currencyColor: "bg-white text-black",
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
    currencyColor: "bg-white text-black",
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
        {/* Total Balance */}
        <div className="rounded-2xl border border-white/10 bg-[#09090B] p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Total Balance</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-white">$22,960</h2>
            <p className="text-primary text-sm font-medium">Across all tokens</p>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-white/10 bg-[#09090B] p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Pending</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-white">$5,000</h2>
            <p className="text-[#FF9500] text-sm font-medium">Awaiting release</p>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-2xl border border-white/10 bg-[#09090B] p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">This Month</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-white">$4,300</h2>
            <p className="text-green-500 text-sm font-medium">+12% from last month</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-[#09090B] border border-white/10 rounded-lg">
          {["Assets", "Transactions", "Payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                ? "bg-[#1C1C1E] text-white"
                : "text-gray-400 hover:text-white"
                }`}
            >
              <span className="flex items-center gap-2">
                {tab === "Assets" && <Wallet className="w-3.5 h-3.5" />}
                {tab === "Transactions" && <ArrowUpRight className="w-3.5 h-3.5" />}
                {tab === "Payouts" && <ArrowDownLeft className="w-3.5 h-3.5" />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        <Button
          className="bg-primary hover:bg-[#0066CC] text-white font-medium rounded-lg px-6 gap-2"
          onClick={() => setShowWithdrawModal(true)}
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
                className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#050B1C] hover:bg-[#050B1C]/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center text-white/20 font-bold overflow-hidden`}>
                    <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-md">
                      <span className="text-white text-[10px] font-bold">{asset.symbol[0]}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{asset.symbol}</h4>
                    <p className="text-sm text-gray-400">{asset.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold block">{asset.value}</span>
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
            <div className="rounded-xl border border-white/10 bg-[#050B1C] overflow-hidden">
              {transactions.map((tx, i) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-white/10' : ''} hover:bg-white/5 transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm">{tx.title}</h4>
                        <Badge variant="secondary" className={`${tx.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'} text-[10px] h-5 px-1.5`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span>{tx.type}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-500" />
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{tx.amount}</span>
                    <Badge className={`${tx.currencyColor} text-[10px] px-1.5 h-5`}>{tx.currency}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 text-xs text-gray-400 py-2">
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-medium mb-1">No Payouts Yet</h3>
            <p className="text-gray-500 text-sm">Your payout history will appear here.</p>
          </div>
        )}
      </div>

      <AddPaymentMethodModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </div>
  );
}
