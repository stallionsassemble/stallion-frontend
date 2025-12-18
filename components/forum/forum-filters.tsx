"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";

export function ForumFilters() {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Announcement", "Smart Contracts", "Development", "Getting Started", "Tip & Tricks", "Collaboration", "Other"];

  return (
    <div className="space-y-4 border-[0.69px] border-primary p-5 rounded-[8.24px]">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-9"
          />
        </div>

        {/* Date & Sort */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card border-border text-muted-foreground h-9 gap-2 whitespace-nowrap">
            <Calendar className="h-4 w-4" />
            Choose a date range
          </Button>

          <Select defaultValue="newest">
            <SelectTrigger className="w-[140px] h-9 bg-card border-border text-muted-foreground">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-muted-foreground">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="active">Recently Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={activeTab === cat ? "default" : "secondary"}
            onClick={() => setActiveTab(cat)}
            className={`h-8 font-inter font-medium text-xs whitespace-nowrap px-4 rounded-md transition-all ${activeTab === cat
              ? "bg-primary border hover:bg-primary/90 text-primary-foreground font-semibold"
              : "bg-secondary border border-border text-foreground"
              }`}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
