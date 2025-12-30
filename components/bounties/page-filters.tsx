"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface PageFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  type?: "BOUNTY" | "PROJECT";
  count?: number;
}

export function PageFilters({ activeTab, onTabChange, type = "BOUNTY", count = 8 }: PageFiltersProps) {
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];
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
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select className="bg-transparent text-foreground font-medium focus:outline-none">
            <option>Newest First</option>
            <option>Highest Price</option>
            <option>Ending Soon</option>
          </select>
        </div>
      </div>
    </div>
  )
}
