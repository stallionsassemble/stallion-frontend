"use client";

import { LeaderboardUser } from "@/app/dashboard/leaderboard/types";
import { LeaderboardRow } from "./leaderboard-row";

interface LeaderboardListProps {
  users: LeaderboardUser[];
}

export function LeaderboardList({ users }: LeaderboardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <LeaderboardRow key={user.rank} user={user} />
      ))}
    </div>
  );
}
