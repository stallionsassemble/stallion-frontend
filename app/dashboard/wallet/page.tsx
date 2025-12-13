"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, Clock, DollarSign, Send, Wallet } from "lucide-react";
import { useState } from "react";

const assets = [
  {
    symbol: "USGLO",
    name: "USGLO",
    amount: "500 USGLO",
    value: "$5,590.90",
    icon: "/assets/icons/usglo.png", // Placeholder path
    color: "bg-blue-500",
  },
  {
    symbol: "USGLO",
    name: "USGLO",
    amount: "500 USGLO",
    value: "$5,590.90",
    icon: "/assets/icons/usglo.png",
    color: "bg-blue-500",
  },
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

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("Assets");

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
            <p className="text-[#007AFF] text-sm font-medium">Across all tokens</p>
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
              {/* Add icons if needed but design shows text buttons with slight background for active? 
                    Actually checking design: It matches a segmented control or tabs style.
                    "Assets" has icon, "Transactions" has icon.
                */}
              <span className="flex items-center gap-2">
                {tab === "Assets" && <Wallet className="w-3.5 h-3.5" />}
                {tab === "Transactions" && <ArrowUpRight className="w-3.5 h-3.5" />}
                {tab === "Payouts" && <ArrowDownLeft className="w-3.5 h-3.5" />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        <Button className="bg-[#007AFF] hover:bg-[#0066CC] text-white font-medium rounded-lg px-6 gap-2">
          <Send className="w-4 h-4" /> Withdraw Fund
        </Button>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#050B1C] hover:bg-[#050B1C]/80 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Icon Placeholder or Image */}
              <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center text-white/20 font-bold overflow-hidden`}>
                {/* Using a simple fallback if image missing, or Image component */}
                {/* For visual accuracy I'll putting a generic icon if I don't have the assets */}
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
    </div>
  );
}
