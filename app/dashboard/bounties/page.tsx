"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { BountyFilters } from "@/components/bounties/bounty-filters";
import { useState } from "react";

// Mock Data
const bounties = [
  {
    id: 1,
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. React Dashboard UI Design. The high-performance blockchain for mass adoption...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    tags: ["React", "TypeScript", "UI/UX"],
    participants: 236,
    dueDate: "10d",
  },
  {
    id: 2,
    title: "Smart Contract Security Audit",
    description: "Audit and fix vulnerabilities in the staking contract. Ensure comprehensive test coverage and documentation...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$5,000",
    type: "USDC",
    tags: ["Solidity", "Security", "Audit"],
    participants: 12,
    dueDate: "5d",
  },
  {
    id: 3,
    title: "Marketing Campaign Manager",
    description: "Lead the marketing campaign for the Q4 product launch. Develop strategy and manage social media channels...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$2,000",
    type: "USDC",
    tags: ["Marketing", "Strategy", "Social"],
    participants: 45,
    dueDate: "20d",
  },
  {
    id: 4,
    title: "Rust Backend Developer",
    description: "Build high-performance backend services using Rust. Integrate with Solana blockchain and optimize for minimal latency...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$8,000",
    type: "SOL",
    tags: ["Rust", "Backend", "Solana"],
    participants: 8,
    dueDate: "15d",
  },
  {
    id: 5,
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. React Dashboard UI Design. The high-performance blockchain for mass adoption...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    tags: ["React", "TypeScript", "UI/UX"],
    participants: 236,
    dueDate: "10d",
  },
  {
    id: 6,
    title: "Smart Contract Security Audit",
    description: "Audit and fix vulnerabilities in the staking contract. Ensure comprehensive test coverage and documentation...",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    amount: "$5,000",
    type: "USDC",
    tags: ["Solidity", "Security", "Audit"],
    participants: 12,
    dueDate: "5d",
  },
];

export default function BountiesPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredBounties = activeTab === "All"
    ? bounties
    : bounties.filter(b => b.tags.some(tag => tag.includes(activeTab) || tag === activeTab) || b.title.includes(activeTab) || b.description.includes(activeTab)); // Simple loose matching for demo

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Browse Bounties</h1>
      </div>

      <BountyFilters activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredBounties.map((bounty) => (
          <BountyCard
            key={bounty.id}
            {...bounty}
            // fix type mismatch if any, mock data aligns with interface
            type={bounty.type as any}
          />
        ))}
      </div>

      {/* Pagination Mock */}
      <div className="flex justify-end pt-4 border-t border-white/5">
        <div className="flex gap-2 text-sm text-gray-400">
          <span>Rows per page: 10</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
