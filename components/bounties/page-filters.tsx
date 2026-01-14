import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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

  // Local state for active sort label if needed, but we rely on parent usually.
  // Actually, we don't know the current sort value passed in props (it's not passed!).
  // So we can't show "Checkmark" on the correct sort unless we add `activeSort` prop.
  // But `BountiesPage` passes `onSortChange` but NOT `activeSort`.
  // Wait, I strictly need to know the current sort to show it or at least just offer the options.
  // I'll update `PageFiltersProps` to include `activeSort`, `activeStatus`, `activeType` if I want to show current state.
  // Inspecting `BountiesPage` call:
  /*
  <PageFilters
        activeTab={activeTab}
        onTabChange...
        onSearch...
        onSortChange...
        onStatusChange...
        type="BOUNTY"
        count...
        availableSkills...
  />
  */
  // It checks `activeTab`, but doesn't pass `activeSort` etc.
  // I should probably add `activeSort` etc to props to fully support UI state.
  // I will update the interface (optional) and assume specific values if invalid.

  const [currentSort, setCurrentSort] = useState("newest");

  const handleSort = (val: string) => {
    setCurrentSort(val);
    onSortChange?.(val);
  }

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Sort & Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('newest')}>
                  Newest First {currentSort === 'newest' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('reward_desc')}>
                  Highest Price {currentSort === 'reward_desc' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('ending_soon')}>
                  Ending Soon {currentSort === 'ending_soon' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('oldest')}>
                  Oldest First {currentSort === 'oldest' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Sub-header / Filters */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-4">
        <span>Showing {count} {typeLabel}</span>

        <div className="flex items-center gap-4">
          {/* Project Type Filter (Only for Projects) */}
          {type === "PROJECT" && (
            <div className="flex items-center gap-2">
              <span>Type:</span>
              <Select onValueChange={onTypeChange} defaultValue="ALL">
                <SelectTrigger className="h-8 w-[100px] border-none bg-transparent p-0 text-xs font-medium text-foreground hover:bg-transparent focus:ring-0">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="GIG">Gigs</SelectItem>
                  <SelectItem value="JOB">Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Select onValueChange={onStatusChange} defaultValue="ACTIVE">
              <SelectTrigger className="h-8 w-[100px] border-none bg-transparent p-0 text-xs font-medium text-foreground hover:bg-transparent focus:ring-0">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                {type === "BOUNTY" && <SelectItem value="CLOSED">Closed</SelectItem>}
                {type === "PROJECT" && <SelectItem value="CANCELLED">Cancelled</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
