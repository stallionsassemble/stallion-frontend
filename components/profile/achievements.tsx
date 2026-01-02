import { EmptyState } from "@/components/ui/empty-state";
import { useMyReputation, useUserReputation } from "@/lib/api/reputation/queries";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

export function Achievements({ userId, publicMode = false }: { userId?: string, publicMode?: boolean }) {
  const { data: myReputation } = useMyReputation();
  const { data: userReputation } = useUserReputation(userId || "");

  const reputation = userId ? userReputation : myReputation;
  const badges = reputation?.badges || [];

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Achievements</h3>

      {badges.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Achievements Yet"
          description={publicMode ? "This user has not earned any badges yet." : "Complete bounties and projects to earn badges and climb the leaderboard."}
          className="min-h-[200px] border-0"
        />
      ) : (
        <div className="flex gap-3 flex-wrap">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-3 text-center group cursor-default">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110",
                "bg-primary/10 text-primary border-primary/20"
              )}>
                {/* Assuming icon is an emoji or text for now based on types */}
                <span className="text-2xl">{badge.icon}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2 truncate max-w-[100px]">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
