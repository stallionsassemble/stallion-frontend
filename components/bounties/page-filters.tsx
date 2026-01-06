"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, Search, SlidersHorizontal } from "lucide-react";

interface PageFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (term: string) => void;
  onSortChange?: (sort: string) => void;
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
  type?: "BOUNTY" | "PROJECT";
  count?: number;
  availableSkills?: string[];
}

export function PageFilters({
  activeTab,
  onTabChange,
  onSearch,
  onSortChange,
  onStatusChange,
  onTypeChange,
  type = "BOUNTY",
  count = 8,
  availableSkills = []
}: PageFiltersProps) {
  // Use dynamic skills if provided, otherwise default to a basic list or empty + All
  const categories = ["All", ...availableSkills].filter((v, i, a) => a.indexOf(v) === i); // Ensure unique just in case
  const typeLabel = type === "PROJECT" ? "Projects" : "Bounties";

  return (
    <div className="space-y-6">
      <div className="flex bg-background min-h-[78px] h-auto py-4 items-center border border-primary/30 rounded-[10px]">
        {/* Search and Main Filters */}
        <div className="w-full px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${typeLabel.toLowerCase()}...`}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              onChange={(e) => onSearch?.(e.target.value)}
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
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
              >
                {activeTab === cat && (
                  <CircleCheck className="mr-2 h-4 w-4 fill-white text-primary" />
                )}
                {cat}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              More Filter
            </Button>
          </div>
        </div>
      </div>
      {/* Sub-header / Sort */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-4">
        <span>Showing {count} {typeLabel}</span>

        <div className="flex items-center gap-4">
          {/* Project Type Filter (Only for Projects) */}
          {type === "PROJECT" && (
            <div className="flex items-center gap-2">
              <span>Type:</span>
              <select
                className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
                onChange={(e) => onTypeChange?.(e.target.value)}
                defaultValue="ALL"
              >
                <option value="ALL" className="bg-card">All Types</option>
                <option value="GIG" className="bg-card">Gigs</option>
                <option value="JOB" className="bg-card">Jobs</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <select
              className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
              onChange={(e) => onStatusChange?.(e.target.value)}
              defaultValue="ACTIVE"
            >
              <option value="ALL" className="bg-card">All Status</option>
              <option value="ACTIVE" className="bg-card">Active</option>
              <option value="OPEN" className="bg-card">Open</option>
              <option value="IN_PROGRESS" className="bg-card">In Progress</option>
              <option value="COMPLETED" className="bg-card">Completed</option>
              {type === "BOUNTY" && <option value="CLOSED" className="bg-card">Closed</option>}
              {type === "PROJECT" && <option value="CANCELLED" className="bg-card">Cancelled</option>}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
              onChange={(e) => onSortChange?.(e.target.value)}
              defaultValue="newest"
            >
              <option value="newest" className="bg-card">Newest First</option>
              <option value="reward_desc" className="bg-card">Highest Price</option>
              <option value="ending_soon" className="bg-card">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
