"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface BountyFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BountyFilters({ activeTab, onTabChange }: BountyFiltersProps) {
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];

  return (
    <div className="space-y-6">
      {/* Search and Main Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-10 bg-[#09090B] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#007AFF]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mask-linear-fade">
          {categories.map((cat, i) => (
            <Button
              key={cat}
              size="sm"
              variant={activeTab === cat ? "default" : "outline"}
              onClick={() => onTabChange(cat)}
              className={`h-9 text-xs whitespace-nowrap px-4 ${activeTab === cat
                ? "bg-[#007AFF] hover:bg-[#007AFF]/90 text-white border-0"
                : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {cat}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 bg-transparent text-gray-400 hover:text-white hover:bg-white/5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            More Filter
          </Button>
        </div>
      </div>

      {/* Sub-header / Sort */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-b border-white/10 pb-4">
        <span>Showing 8 Bounties</span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select className="bg-transparent text-white font-medium focus:outline-none">
            <option>Newest First</option>
            <option>Highest Price</option>
            <option>Ending Soon</option>
          </select>
        </div>
      </div>
    </div>
  )
}
