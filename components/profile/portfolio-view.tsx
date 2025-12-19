"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Briefcase, Calendar as CalendarIcon, Gift, Search } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

const portfolioItems = [
  {
    title: "Smart Contract Audit for DeFi Protocol",
    description: "Conducted comprehensive security audit for a lending protocol with $5M TVL.",
    date: "Dec 2024",
    org: "Stallion Foundation",
    type: "Projects",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    description: "Conducted comprehensive security audit for a lending protocol with $5M TVL.",
    date: "Dec 2024",
    org: "Stallion Foundation",
    type: "Projects",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    description: "Conducted comprehensive security audit for a lending protocol with $5M TVL.",
    date: "Dec 2024",
    org: "Stallion Foundation",
    type: "Projects",
    amount: "$3,500",
    token: "USGLO",
  },
  {
    title: "Smart Contract Audit for DeFi Protocol",
    description: "Conducted comprehensive security audit for a lending protocol with $5M TVL.",
    date: "Dec 2024",
    org: "Stallion Foundation",
    type: "Projects",
    amount: "$3,500",
    token: "USGLO",
  }
];

export function PortfolioView() {
  const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-9 bg-background border-border w-[322px] h-[36px] shadow-none"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              className={cn(
                "w-[322px] h-[36px] justify-start text-left font-normal bg-background border border-border rounded-md px-3 text-sm hover:bg-background hover:text-foreground shadow-none",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Choose a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select defaultValue="newest">
          <SelectTrigger className="w-[121px] h-[36px] bg-background border-border shadow-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recent Activity / Portfolio List */}
      <div className="border-[0.68px] border-primary/20 rounded-xl p-6 bg-background">
        <h3 className="text-lg font-bold font-inter mb-6">Recent Activity</h3>
        <div>
          {portfolioItems.map((item, i) => (
            <div
              key={i}
              className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal font-inter text-foreground">
                  {item.title}
                </p>
                <p className="text-sm font-normal font-inter text-muted-foreground/80">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/60">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 text-primary" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-primary" /> {item.org}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3 text-primary" /> {item.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold font-inter text-foreground text-base">
                  {item.amount}
                </span>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] px-2 py-0.5 h-auto rounded-full font-bold border-0">
                  {item.token}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
