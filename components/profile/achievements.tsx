// @ts-nocheck
import { EmptyState } from "@/components/ui/empty-state";
import { useMyReputation, useUserReputation } from "@/lib/api/reputation/queries";
import { cn } from "@/lib/utils";
import { Award, AlertCircle, Loader2 } from "lucide-react";

export function Achievements({ userId, publicMode = false }: { userId?: string, publicMode?: boolean }) {
  const myReputationQuery = useMyReputation();
  const userReputationQuery = useUserReputation(userId || "");

  const { data: reputation, isLoading, isError } = userId ? userReputationQuery : myReputationQuery;
  const badges = (reputation?.badges || [] as string[]) || [];

  const formatBadgeName = (badge: string) => {
    return badge.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Achievements</h3>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Achievements"
          description="We couldn't load the achievements at this time. Please try again later."
          className="min-h-[200px] border-0"
        />
      ) : badges.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Achievements Yet"
          description={publicMode ? "This user has not earned any badges yet." : "Complete bounties and projects to earn badges and climb the leaderboard."}
          className="min-h-[200px] border-0"
        />
      ) : (
        <div className="flex gap-6 flex-wrap">
          {badges.map((badge) => (
            <div key={badge} className="flex flex-col items-center gap-3 text-center group cursor-default">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110",
                "bg-primary/10 text-primary border-primary/20"
              )}>
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2 truncate max-w-[100px]">
                {formatBadgeName(badge)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
