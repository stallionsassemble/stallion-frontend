import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target: string;
  targetHighlight?: boolean; // If the target should be bold/highlighted
  meta?: string; // e.g., "for API"
  time: string;
  type: "submission" | "payment" | "award";
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Alex Chen", avatar: "https://avatar.vercel.sh/alex", initials: "AC" },
    action: "submitted a milestone for",
    target: "Custodial Wallet System",
    targetHighlight: true,
    time: "2 hours ago",
    type: "submission"
  },
  {
    id: "2",
    user: { name: "", avatar: "https://avatar.vercel.sh/jordan", initials: "JL" }, // Avatar is for Jordan? Or System? Text says "Released... to Jordan Lee"
    // Based on image, it looks like a user avatar on the left. Let's assume it's the recipient or a system avatar.
    // The text is "Released $800 USGLO to Jordan Lee for API"
    // Let's structure the rendering to handle this specific sentence construction.
    action: "Released",
    target: "$800 USGLO", // Highlighted
    meta: "to **Jordan Lee** for **API**", // We'll parse this for bolding
    time: "2 hours ago",
    type: "payment"
  },
  {
    id: "3",
    user: { name: "Sarah Chen", avatar: "https://avatar.vercel.sh/sarah", initials: "SC" },
    action: "submitted \"Detailed Audit Report\" for",
    target: "Smart Contract Audit for Escrow System",
    targetHighlight: true,
    time: "2 hours ago",
    type: "submission"
  },
  {
    id: "4",
    user: { name: "Priya Sharma", avatar: "https://avatar.vercel.sh/priya", initials: "PS" },
    action: "won",
    target: "1st place",
    targetHighlight: true,
    meta: "in **Stellar Ecosystem**",
    time: "2 hours ago",
    type: "award"
  },
  {
    id: "5",
    user: { name: "Priya Sharma", avatar: "https://avatar.vercel.sh/priya", initials: "PS" },
    action: "won",
    target: "1st place",
    targetHighlight: true,
    meta: "in **Stellar Ecosystem**",
    time: "2 hours ago",
    type: "award"
  },
  {
    id: "6",
    user: { name: "Priya Sharma", avatar: "https://avatar.vercel.sh/priya", initials: "PS" },
    action: "won",
    target: "1st place",
    targetHighlight: true,
    meta: "in **Stellar Ecosystem**",
    time: "2 hours ago",
    type: "award"
  },
  {
    id: "7",
    user: { name: "Priya Sharma", avatar: "https://avatar.vercel.sh/priya", initials: "PS" },
    action: "won",
    target: "1st place",
    targetHighlight: true,
    meta: "in **Stellar Ecosystem**",
    time: "2 hours ago",
    type: "award"
  }
];

export function OwnerRecentActivities() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recent Activities</h2>

      <div className="relative flex flex-col gap-8">
        {/* Vertical linking line */}
        {/* We position it absolute relative to the container. It should align with the center of the avatars (w-10). Center is 20px (1.25rem could differ). width of avatar is 40px (10). */}
        {/* Tailwind: left-[20px] top-[20px] bottom-[20px] w-px bg-slate-800 */}
        <div className="absolute left-[20px] top-4 bottom-4 w-px bg-white/10" />

        {activities.map((item, index) => (
          <div key={item.id} className="relative flex items-center gap-4 z-10">
            {/* Avatar */}
            <Avatar className="h-10 w-10 rounded-xl border-background shadow-sm shrink-0">
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
              <AvatarFallback>{item.user.initials}</AvatarFallback>
            </Avatar>

            {/* Content & Time */}
            <div className="flex flex-1 items-start justify-between min-w-0">
              <div className="text-[15px] leading-relaxed text-slate-300">
                {/* Special case for Payment which has complex bolding: Released $800... to Jordan... for API */}
                {item.type === 'payment' ? (
                  <>
                    Released <span className="text-white font-bold">{item.target}</span> to <span className="text-white font-bold">Jordan Lee</span> for <span className="text-white font-bold">API</span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-bold">{item.user.name}</span> {item.action} <span className={cn(item.targetHighlight ? "text-white font-bold" : "")}>{item.target}</span>
                    {/* Handle "in **Stellar Ecosystem**" or similar suffix meta */}
                    {item.meta && (
                      <span> {item.meta.split('**').map((part, i) =>
                        i % 2 === 1 ? <span key={i} className="text-white font-bold">{part}</span> : part
                      )}</span>
                    )}
                  </>
                )}
              </div>

              <span className="text-xs text-slate-500 whitespace-nowrap ml-4 pt-1">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
