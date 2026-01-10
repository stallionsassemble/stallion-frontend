"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetMyBounties } from "@/lib/api/bounties/queries";
import { useGetProjects } from "@/lib/api/projects/queries";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, Send, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Contributor } from "./contributor-card";

interface InviteItem {
  id: string;
  type: "Project" | "Bounty";
  title: string;
  description: string;
  reward: number;
  currency: string;
  tags: string[];
  stats: {
    applicants: number;
    submissions: number;
    date: string; // e.g. "3/12/2024"
  };
}

// Mock data for invite items (projects/bounties to invite TO)
const MOCK_INVITE_ITEMS: InviteItem[] = [
  {
    id: "1",
    type: "Project",
    title: "Smart Contract Audit for Escrow System",
    description: "Create comprehensive API documentation and TypeScript SDK for third-party integrations.",
    reward: 3500,
    currency: "USDC",
    tags: ["React", "TypeScript", "UI/UX"],
    stats: { applicants: 200, submissions: 20, date: "3/12/2024" }
  },
  {
    id: "2",
    type: "Bounty",
    title: "Frontend Dashboard Implementation",
    description: "Implement the project owner dashboard with high fidelity to the provided Figma designs.",
    reward: 1200,
    currency: "USDC",
    tags: ["React", "Tailwind", "Next.js"],
    stats: { applicants: 45, submissions: 5, date: "3/14/2024" }
  },
  {
    id: "3",
    type: "Bounty",
    title: "Solana Wallet Integration",
    description: "Integrate Solana wallet adapter for user authentication and payments.",
    reward: 2000,
    currency: "USDC",
    tags: ["Solana", "Web3", "Rust"],
    stats: { applicants: 120, submissions: 15, date: "3/15/2024" }
  }
];

interface InviteContributorModalProps {
  contributor: Contributor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteContributorModal({ contributor, open, onOpenChange }: InviteContributorModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { user } = useAuth();

  // Real Data Fetching
  const { data: bounties } = useGetMyBounties();
  const { data: projectsData } = useGetProjects({ ownerId: user?.id });
  const projects = projectsData?.projects || [];

  // Invitation Sending
  const { sendMessage } = useChatSocket();

  const inviteItems: InviteItem[] = [
    ...(bounties || []).filter(b => b.status === 'ACTIVE').map(b => ({
      id: b.id,
      type: "Bounty" as const,
      title: b.title,
      description: b.description || "",
      reward: Number(b.reward || 0),
      currency: b.rewardCurrency || "USDC",
      tags: b.skills || [],
      stats: {
        applicants: b.applicationCount || 0,
        submissions: 0, // Not directly in Bounty list object usually, need separate fetch or approximation
        date: b.createdAt ? format(new Date(b.createdAt), 'MM/dd/yyyy') : ''
      }
    })),
    ...(projects || []).filter(p => p.status === 'ACTIVE').map(p => ({
      id: p.id,
      type: "Project" as const,
      title: p.title,
      description: p.description,
      reward: Number(p.budget?.min || 0), // Using min budget as reward proxy
      currency: p.budget?.currency || "USDC",
      tags: p.skills || [],
      stats: {
        applicants: 0, // Projects might handle this differently
        submissions: 0,
        date: p.createdAt ? format(new Date(p.createdAt), 'MM/dd/yyyy') : ''
      }
    }))
  ];

  if (!contributor) return null;

  const handleSendInvite = async () => {
    if (!selectedItemId || !contributor) return;

    const selectedItem = inviteItems.find(item => item.id === selectedItemId);
    if (!selectedItem) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const routeType = selectedItem.type === 'Project' ? 'projects' : 'bounties';
    // Assuming the public/shared link structure fits /dashboard/projects/[id] for now, or adapt if there's a specific public route
    const link = `${baseUrl}/dashboard/${routeType}/${selectedItem.id}`;

    const content = `Hi, I would like to invite you to check out this ${selectedItem.type.toLowerCase()}: ${link}`;

    try {
      const response = await sendMessage({
        recipientId: contributor.id,
        content: content,
      });

      if (response?.success) {
        toast.success(`Invitation sent to ${contributor.name}`);
        onOpenChange(false);
        setSelectedItemId(null);
      } else {
        toast.error("Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("An error occurred while sending the invitation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#030303] border-white/10 text-white p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Grid Background Effect using utility classes if available, or inline style. 
            Using a subtle radial gradient to mimic the glow/grid effect in the dark theme. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <DialogHeader className="p-8 pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight mb-2">Invite {contributor.name}</DialogTitle>
              <p className="text-foreground text-sm">Select a bounty or project to invite them to</p>
            </div>
            {/* Close button is automatically added by DialogContent, but we can customize or leave it */}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Avatar className="h-14 w-14 border-2 border-white/10 shadow-lg">
              <AvatarImage src={contributor.avatar} />
              <AvatarFallback>{contributor.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="w-fit bg-[#FF9100] text-black hover:bg-[#FF9100]/90 border-0 text-[10px] px-2 py-0.5 font-bold">
                <Users className="w-3 h-3 mr-1" />
                Fair Payer
              </Badge>
              <span className="font-bold text-xl text-white">{contributor.name}</span>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] px-8 py-2 relative z-10">
          <div className="space-y-2 pb-4">
            {inviteItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    "group relative border rounded-lg p-3 cursor-pointer transition-all duration-200",
                    isSelected
                      ? "bg-[#050F27] border-primary ring-1 ring-primary" // Selected
                      : "bg-[#050F27] border-primary/40 hover:border-primary hover:bg-[#050F27]/80" // Unselected
                  )}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <Badge variant="secondary" className={cn(
                      "border-0 text-[9px] px-1.5 py-0 h-4 font-medium",
                      item.type === "Project" ? "bg-blue-900/40 text-blue-300" : "bg-slate-800 text-slate-400"
                    )}>
                      {item.type}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1 tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mb-2 leading-relaxed line-clamp-1">{item.description}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white tracking-tight">${item.reward.toLocaleString()}</span>
                    <Badge variant="secondary" className="bg-primary/90 text-white border-0 text-[9px] h-4 px-1.5 hover:bg-primary">
                      {item.currency}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-background border-white/10 text-slate-400 text-[9px] px-1 py-0 h-auto hover:bg-slate-800/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[9px] text-slate-500 font-medium pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {item.stats.applicants}</span>
                    <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {item.stats.submissions} Submissions</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {item.stats.date}</span>
                  </div>
                </div>
              );
            })}

            {inviteItems.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No active projects or bounties found to invite to.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-8 border-t border-white/5 bg-[#0A0A0A] flex items-center justify-end gap-3 relative z-10">
          <Button
            variant="stallion-outline"
            className="border-white/10 text-white bg-transparent hover:bg-white/5 h-12 px-8 rounded-lg text-sm font-medium"
            onClick={() => {
              setSelectedItemId(null);
              onOpenChange(false);
            }}
          >
            <div className="mr-1">
              <X className="h-4 w-4" />
            </div>
            Cancel Selection
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20"
            disabled={!selectedItemId}
            onClick={handleSendInvite}
          >
            <div className="mr-1">
              <Send className="h-4 w-4" />
            </div>
            <span className="mr-2">Send Invitation</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
