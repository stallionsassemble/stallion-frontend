"use client";

import { LeaderboardEntry } from "@/lib/types/reputation";
import { LeaderboardRow } from "./leaderboard-row";

interface LeaderboardListProps {
  users: LeaderboardEntry[];
}

export function LeaderboardList({ users }: LeaderboardListProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px] flex flex-col gap-3">
        {users.map((user) => (
          <LeaderboardRow key={user.rank} user={user} />
        ))}
      </div>
    </div>
  );
}
