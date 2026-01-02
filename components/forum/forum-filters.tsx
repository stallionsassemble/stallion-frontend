"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Tag } from "@/lib/types/forum";
import { Search } from "lucide-react";
import { DateRange } from "react-day-picker";

interface ForumFiltersProps {
  categories: Category[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onSearch: (query: string) => void;
  onSortChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  tags?: Tag[];
  activeTag?: string;
  onTagChange?: (slug: string) => void;
}

export function ForumFilters({
  categories,
  activeTab,
  onTabChange,
  onSearch,
  onSortChange,
  dateRange,
  onDateRangeChange,
  tags = [],
  activeTag,
  onTagChange
}: ForumFiltersProps) {
  return (
    <div className="space-y-4 border-[0.69px] border-primary p-5 rounded-[8.24px]">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:flex-1 lg:max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10 w-full bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-start sm:items-center gap-3">
          <div className="flex w-full sm:w-auto gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {/* Tags Select */}
            {onTagChange && (
              <Select value={activeTag || "all"} onValueChange={(val) => onTagChange(val === "all" ? "" : val)}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 bg-card border-border text-muted-foreground shrink-0">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-muted-foreground">
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.slug || tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex w-full sm:w-auto gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <div className="shrink-0">
              <DatePickerWithRange
                date={dateRange}
                setDate={onDateRangeChange}
              />
            </div>

            <Select defaultValue="latest" onValueChange={onSortChange}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 bg-card border-border text-muted-foreground shrink-0">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-muted-foreground">
                <SelectItem value="latest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="active">Recently Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
        <Button
          size="sm"
          variant={activeTab === 'all' ? "default" : "secondary"}
          onClick={() => onTabChange('all')}
          className={`h-8 font-inter font-medium text-xs whitespace-nowrap px-4 rounded-md transition-all ${activeTab === 'all'
            ? "bg-primary border hover:bg-primary/90 text-primary-foreground font-semibold"
            : "bg-secondary border border-border text-foreground"
            }`}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeTab === cat.id ? "default" : "secondary"}
            onClick={() => onTabChange(cat.id)}
            className={`h-8 font-inter font-medium text-xs whitespace-nowrap px-4 rounded-md transition-all ${activeTab === cat.id
              ? "bg-primary border hover:bg-primary/90 text-primary-foreground font-semibold"
              : "bg-secondary border border-border text-foreground"
              }`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div >
  );
}
