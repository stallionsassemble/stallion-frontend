import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyBounties } from "@/lib/api/bounties/queries";
import { useGetProjects } from "@/lib/api/projects/queries";
import { useAuth } from "@/lib/store/use-auth";
import { ChevronRight, CircleCheck, Clock, User, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface WorkItem {
  id: string;
  type: "Bounty" | "Project";
  status: string;
  title: string;
  description: string;
  reward: string;
  currency: "USDC";
  skills: string[];
  applicants: number;
  submissions: number;
  timeLeft?: string;
  hired?: boolean;
  totalMilestones?: number;
  completedMilestones?: number;
  acceptedCount?: number;
  createdAt?: string;
}



export function OwnerActiveWorks() {
  const { user } = useAuth()
  const { data: ownerBounties, isLoading: isBountiesLoading } = useGetMyBounties()
  const { data: ownerProjects, isLoading: isProjectsLoading } = useGetProjects({ ownerId: user?.id || '' })

  const isLoading = isBountiesLoading || isProjectsLoading;

  console.log('DEBUG: OwnerActiveWorks', {
    userId: user?.id,
    ownerBounties,
    ownerProjects,
    isBountiesLoading,
    isProjectsLoading,
    activeWorksListLength: ownerBounties?.length
  });

  const [filterType, setFilterType] = useState<"All" | "Project" | "Bounty">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const activeWorksList = [
    ...(ownerBounties?.map((b) => ({
      ...b,
      type: "Bounty" as const,
      // Map Bounty Status
      status: b.status === 'ACTIVE' ? "ACTIVE" : b.status === 'COMPLETED' ? "Completed" : "Closed",
      currency: b.rewardCurrency,
      applicants: b.applicationCount || 0,
      submissions: b.applicationCount || 0,
      totalMilestones: 0,
      completedMilestones: 0,
      acceptedCount: 0,
      createdAt: b.createdAt
    })) ?? []),
    ...((ownerProjects as any)?.projects?.map((p: any) => {
      // Map Project Status
      let status = "OPEN";
      if (p.status === 'IN_PROGRESS') status = "In Progress";
      else if (p.status === 'COMPLETED') status = "Completed";
      else if (p.status === 'CANCELLED') status = "Cancelled";
      else if (p.status === 'CLOSED') status = "Closed";

      return {
        ...p,
        type: "Project" as const,
        status,
        applicants: p.applications?.length || 0,
        submissions: p.applications?.length || 0,
        totalMilestones: p.milestones?.length || 0,
        // Safely access milestone status if available, otherwise 0
        completedMilestones: p.milestones?.filter((m: any) => m.status === 'PAID' || m.status === 'COMPLETED').length || 0,
        acceptedCount: p.acceptedCount || 0,
        createdAt: p.createdAt
      };
    }) ?? []),
  ];

  // Extract unique skills from all works
  const allSkills = activeWorksList.flatMap(work => work.skills);
  const uniqueSkills = Array.from(new Set(allSkills)).sort();

  const filteredAndSortedWorks = activeWorksList
    .filter((work) => {
      // Type Filter
      if (filterType !== "All" && work.type !== filterType) return false;

      // Category/Skill Filter
      if (filterCategory !== "All") {
        return work.skills.some(skill =>
          skill.toLowerCase() === filterCategory.toLowerCase()
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return sortOrder === 'desc'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-white">Active Works</h2>
          <div className="flex items-center h-5 text-sm font-medium text-slate-400 gap-4 border-l border-slate-700 pl-6">
            <button
              onClick={() => setFilterType("All")}
              className={`${filterType === "All" ? "text-white border-b-2 border-primary pb-0.5" : "hover:text-white transition-colors"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("Project")}
              className={`${filterType === "Project" ? "text-white border-b-2 border-primary pb-0.5" : "hover:text-white transition-colors"}`}
            >
              Projects
            </button>
            <button
              onClick={() => setFilterType("Bounty")}
              className={`${filterType === "Bounty" ? "text-white border-b-2 border-primary pb-0.5" : "hover:text-white transition-colors"}`}
            >
              Bounties
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-[calc(100vw-300px)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterCategory("All")}
            className={`h-8 text-xs border whitespace-nowrap ${filterCategory === "All" ? "bg-primary/20 border-primary text-white" : "bg-background border-border text-foreground"}`}
          >
            All
          </Button>

          {uniqueSkills.map(skill => (
            <Button
              key={skill}
              variant="ghost"
              size="sm"
              onClick={() => setFilterCategory(skill)}
              className={`h-8 text-xs border gap-2 whitespace-nowrap ${filterCategory === skill ? "bg-primary/20 border-primary text-white" : "bg-background border-border text-foreground"}`}
            >
              <CircleCheck className="h-3.5 w-3.5" /> {skill}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="h-8 text-xs bg-background border-border text-foreground gap-2"
        >
          {sortOrder === 'desc' ? "Newest First" : "Oldest First"} <ChevronRight className={`h-3 w-3 rotate-90 transition-transform ${sortOrder === 'asc' ? '-rotate-90' : ''}`} />
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-background border-border overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-5 w-16 rounded-md bg-slate-800" />
                  <Skeleton className="h-5 w-12 rounded-md bg-slate-800" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-full mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-2/3 mb-5 bg-slate-800" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-8 w-24 rounded-full bg-slate-800" />
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-6 w-16 rounded-md bg-slate-800" />
                  <Skeleton className="h-6 w-20 rounded-md bg-slate-800" />
                  <Skeleton className="h-6 w-14 rounded-md bg-slate-800" />
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24 bg-slate-800" />
                    <Skeleton className="h-3 w-20 bg-slate-800" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAndSortedWorks.slice(0, 6).map((work) => (
            <Card key={work.id} className="bg-background border-primary overflow-hidden relative group hover:border-primary/50 transition-all rounded-xl">
              <CardContent className="p-6 flex flex-col h-full relative z-10">

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-[#1E1E1E] text-[#9CA3AF] hover:bg-[#2A2A2A] border-0 rounded-md text-[10px] font-medium px-2 py-0.5 uppercase tracking-wide">
                    {work.status}
                  </Badge>
                  <Badge className="bg-[#0F2942] text-blue-400 hover:bg-[#0F2942] border-0 rounded-md text-[10px] font-medium px-2 py-0.5 uppercase tracking-wide">
                    {work.type}
                  </Badge>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-[19px] leading-tight mb-2 text-white">{work.title}</h3>
                <p className="text-[#64748B] text-[13px] leading-relaxed mb-5 line-clamp-3">{work.description}</p>

                {/* Price Row */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[26px] font-bold text-white tracking-tight">
                    {work?.currency === 'XLM' ? '' : '$'}{work.reward}
                  </span>
                  <Badge className="bg-blue-600/90 text-white hover:bg-blue-600 border-0 rounded-full text-[10px] font-bold px-2.5 py-0.5">
                    {work?.currency || ''}
                  </Badge>
                </div>

                {/* Progress Bar (Only for In Progress) */}
                {work.status === 'In Progress' && work.totalMilestones && work.completedMilestones && (
                  <div className="w-full mb-4">
                    <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((work.completedMilestones / work.totalMilestones) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-foreground/50 font-medium">
                      Milestone {work.completedMilestones} of {work.totalMilestones}
                    </div>
                  </div>
                )}
                {!(work.status === 'In Progress') && <div className="mb-4"></div>}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {work.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground hover:bg-primary/30 text-[10px] px-2 py-0.5 transition-colors border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4 text-[11px] text-[#64748B] font-medium">
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" /> <span className="text-white">{work.applicants}</span></span>
                      <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> <span className="text-white">{work.submissions} Submissions</span></span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-medium mt-1">
                      <span className="text-red-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Ended
                      </span>
                      {work.type === "Project" && (work.acceptedCount || 0) > 0 && (
                        <div className="flex items-center gap-1.5">
                          <div className="relative h-4 w-4 rounded-full overflow-hidden border border-slate-700">
                            <Image src="https://avatar.vercel.sh/james" alt="hired" fill className="object-cover" />
                          </div>
                          <span className="text-green-500">Hired</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button size="icon" className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 shrink-0">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

