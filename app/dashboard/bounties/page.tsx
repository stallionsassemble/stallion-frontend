"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { PageFilters } from "@/components/bounties/page-filters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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

  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter first
  const filteredList = activeTab === "All"
    ? bounties
    : bounties.filter(b => b.tags.some(tag => tag.includes(activeTab) || tag === activeTab) || b.title.includes(activeTab) || b.description.includes(activeTab));

  const totalPages = Math.ceil(filteredList.length / Number(rowsPerPage));
  const paginatedBounties = filteredList.slice((currentPage - 1) * Number(rowsPerPage), currentPage * Number(rowsPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex-1 items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Browse Bounties</h1>
        <p className="text-muted-foreground">Browse and manage available bounties.</p>
      </div>

      <PageFilters
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        type="BOUNTY"
        count={paginatedBounties.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedBounties.map((bounty) => (
          <BountyCard
            key={bounty.id}
            {...bounty}
            className="w-full min-w-0 md:w-full md:min-w-0"
            // fix type mismatch if any, mock data aligns with interface
            type={bounty.type as any}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-6 gap-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>Rows per page</span>
          <Select value={rowsPerPage} onValueChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 px-2 w-[60px] rounded-md bg-card border border-border text-foreground focus:ring-0 focus:ring-offset-0 gap-1">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-muted-foreground mr-2">Page {currentPage} of {totalPages || 1}</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-md bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-md bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
