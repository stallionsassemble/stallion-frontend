"use client";

import { LeaderboardUser } from "@/app/dashboard/leaderboard/types";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { Podium } from "@/components/leaderboard/podium";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock Data
const MOCK_LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Alex Chen",
    handle: "alexchen",
    avatar: "alex",
    isVerified: true,
    rating: 4.98,
    completedTasks: 78,
    earnedAmount: 52340,
    successRate: 99,
    category: "React",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    handle: "sarahc",
    avatar: "sarah",
    isVerified: true,
    rating: 4.95,
    completedTasks: 65,
    earnedAmount: 48000,
    successRate: 98,
  },
  {
    rank: 3,
    name: "Mike Ross",
    handle: "mross",
    avatar: "mike",
    isVerified: false,
    rating: 4.90,
    completedTasks: 60,
    earnedAmount: 45000,
    successRate: 97,
  },
  {
    rank: 4,
    name: "Jessica Pearson",
    handle: "jpearson",
    avatar: "jessica",
    isVerified: true,
    rating: 4.88,
    completedTasks: 55,
    earnedAmount: 42000,
    successRate: 96,
  },
  {
    rank: 5,
    name: "Harvey Specter",
    handle: "hspecter",
    avatar: "harvey",
    isVerified: false,
    rating: 4.85,
    completedTasks: 50,
    earnedAmount: 40000,
    successRate: 95,
  },
  {
    rank: 6,
    name: "Louis Litt",
    handle: "llitt",
    avatar: "louis",
    isVerified: true,
    rating: 4.82,
    completedTasks: 48,
    earnedAmount: 38000,
    successRate: 94,
  },
  {
    rank: 7,
    name: "Donna Paulsen",
    handle: "dpaulsen",
    avatar: "donna",
    isVerified: true,
    rating: 4.99,
    completedTasks: 45,
    earnedAmount: 35000,
    successRate: 100,
  }
];

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground font-inter">Leaderboard</h1>
        <p className="text-sm text-muted-foreground font-inter">Top contributors in the community</p>
      </div>

      {/* Podium Section */}
      <div className="w-full flex justify-center -mb-12 sm:mb-0 overflow-x-hidden sm:overflow-visible">
        <Podium topUsers={MOCK_LEADERBOARD_DATA.slice(0, 3)} />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-lg border-[0.69px] border-primary">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-9 bg-background/50 border-border text-muted placeholder:text-muted"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto text-muted">
          <Select>
            <SelectTrigger className="w-[150px] bg-background/50 border-border text-muted">
              <SelectValue placeholder="Select Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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
      <LeaderboardList users={MOCK_LEADERBOARD_DATA} />
    </div>
  );
}
