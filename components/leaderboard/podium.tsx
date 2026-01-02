"use client";

import { LeaderboardEntry } from "@/lib/types/reputation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PodiumProps {
  topUsers: LeaderboardEntry[];
}

export function Podium({ topUsers }: PodiumProps) {
  // Ensure strict order: 2nd, 1st, 3rd
  const sorted = [...topUsers].sort((a, b) => a.rank - b.rank);
  const first = sorted.find(u => u.rank === 1);
  const second = sorted.find(u => u.rank === 2);
  const third = sorted.find(u => u.rank === 3);

  const PodiumCard = ({ user, position }: { user: LeaderboardEntry; position: number }) => {
    const isFirst = position === 1;
    const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username;
    const earnedAmount = user.earnedAmount || 0.00

    // Config based on position
    const cardBg = isFirst ? "bg-[#3B82F6]" : "bg-primary/21";

    const medalImage = isFirst
      ? "/assets/icons/gold-medal.png"
      : (position === 2 ? "/assets/icons/silver-medal.png" : "/assets/icons/bronze-medal.png");

    // Uniform sizes for all cards
    const cardSize = "w-[164px] h-[147px]";
    const avatarSize = "w-10 h-10"; // Fits nicely in 147px height with text

    // Stagger vertically by changing string length
    // Rank 1 is "far downward" (Winner hangs lower) -> Longer string.
    // Rank 2/3 are "at the top" -> Shorter string.
    const stringHeight = isFirst ? "h-[65px]" : "h-[25px]";

    return (
      <div className="flex flex-col items-center group">
        {/* Hanging String - Solid Line */}
        <div className={cn("w-px border-l border-primary/30", stringHeight)} />

        {/* Card - Uniform Layout */}
        <div className={cn(
          "relative flex flex-col items-center justify-center rounded-[3.6px] p-2 text-center transition-transform hover:scale-105 duration-300",
          cardBg,
          cardSize
        )}>
          {/* Medal - Absolute on top edge */}
          <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-8 h-8 drop-shadow-md z-20">
            <Image
              src={medalImage}
              alt={`Rank ${position} Medal`}
              fill
              className="object-contain" // object-contain ensures it fits in 32x32
            />
          </div>

          {/* Avatar */}
          <div className={cn("relative rounded-full overflow-hidden border border-white/10 mb-1 shrink-0 mt-4",
            avatarSize
          )}>
            <Image
              src={user.profilePicture && user.profilePicture.startsWith("http")
                ? user.profilePicture
                : `https://avatar.vercel.sh/${user.username}`}
              alt={fullName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <h3 className="text-white font-inter font-bold text-[13px] leading-tight truncate w-full px-1">{fullName}</h3>
          <p className="text-white/60 text-[11px] mb-1 truncate w-full px-1">@{user.username}</p>

          {/* Amount */}
          <div className="text-[25px] font-inter font-bold text-white tracking-tight leading-none">
            ${earnedAmount.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-start justify-center gap-4 mx-auto w-[517px] h-[212px] scale-[0.55] xs:scale-[0.75] sm:scale-100 origin-top">
      {/* Order: 2 - 1 - 3 */}
      {second && <PodiumCard user={second} position={2} />}
      {first && <PodiumCard user={first} position={1} />}
      {third && <PodiumCard user={third} position={3} />}
    </div>
  );
}
