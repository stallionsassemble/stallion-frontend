"use client";

import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { Podium } from "@/components/leaderboard/podium";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeaderboard } from "@/lib/api/reputation/queries";
import { LeaderboardEntry } from "@/lib/types/reputation";
import { Loader2, Search, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all-time");

  const { data: leaderboardData, isLoading } = useLeaderboard({
    page,
    limit,
    category: skillFilter !== "all" ? skillFilter : undefined,
  });

  const leaderboard = leaderboardData?.data || [];
  const pagination = leaderboardData?.pagination;

  // Reset page when filters change
  const handleSkillFilterChange = (value: string) => {
    setSkillFilter(value);
    setPage(1);
  };

  const handleLimitChange = (val: number) => {
    setLimit(val);
    setPage(1);
  };

  const filteredLeaderboard = useMemo(() => {
    let result = leaderboard;

    // 1. Search Filter (Client-side for now as backend param unknown)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user: LeaderboardEntry) =>
          user.username.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query)
      );
    }

    // 2. Skill Filter (Handled by backend param 'category', but keeping client fallback or additional filtering if needed)
    // If backend handles it, we might not need this client-side filter unless backend 'category' mapping is different.
    // For safety, and since we pass it to backend, let's trust backend results for category, but we can verify.
    // Actually, let's rely on backend for category if provided, but if we search, we search within the result.

    return result;
  }, [leaderboard, searchQuery]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground font-inter">Leaderboard</h1>
        <p className="text-sm text-muted-foreground font-inter">Top contributors in the community</p>
      </div>

      {isLoading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : leaderboard.length === 0 && !searchQuery ? (
        <EmptyState
          icon={Trophy}
          title="No Leaderboard Data"
          description="There are currently no users on the leaderboard. Be the first to earn reputation!"
        />
      ) : (
        <>
          {/* Podium Section - Only show on first page and if no search query */}
          {page === 1 && !searchQuery && (
            <div className="w-full flex justify-center -mb-12 sm:mb-0 overflow-x-hidden sm:overflow-visible">
              <Podium topUsers={leaderboard.slice(0, 3)} />
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-lg border-[0.69px] border-primary">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search by name or handle..."
                className="pl-9 bg-background/50 border-border text-muted placeholder:text-muted"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to page 1 on search (though it searches current page data currently)
                }}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto text-muted">
              <Select value={skillFilter} onValueChange={handleSkillFilterChange}>
                <SelectTrigger className="w-[150px] bg-background/50 border-border text-muted">
                  <SelectValue placeholder="Select Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[180px] bg-background/50 border-border text-muted">
                  <SelectValue placeholder="Select Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List Section */}
          <LeaderboardList
            users={filteredLeaderboard}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </div>
  );
}
