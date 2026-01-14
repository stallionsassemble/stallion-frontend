"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BriefcaseBusiness, CircleCheck, Gift, ListFilter, Timer, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllBounties } from "@/lib/api/bounties/queries";
import { useGetProjects } from "@/lib/api/projects/queries";
import { formatDistanceToNow } from "date-fns";

// Activities Data
const activities = [
  {
    id: 1,
    type: "awarded",
    user: "Odrant",
    action: "awarded",
    target: "Denizhan Dakilir",
    amount: "$200 bounty",
    time: "3 hours ago",
    avatar: "https://avatar.vercel.sh/odrant",
  },
  {
    id: 3, // Keep ID 3 to minimize diff confusion if keeping previous state
    type: "awarded",
    user: "Stallion",
    action: "awarded",
    target: "Olamide Olutekunbi",
    amount: "$250 bounty",
    time: "2 days ago",
    avatar: "https://avatar.vercel.sh/stallion",
  },
  {
    id: 4,
    type: "shared",
    user: "tscircuit",
    action: "shared a",
    target: "", // Implicit
    amount: "$200 bounty",
    time: "2 months ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
  {
    id: 5,
    type: "shared",
    user: "tscircuit",
    action: "shared a",
    target: "",
    amount: "$400 bounty",
    time: "2 months ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
  {
    id: 6,
    type: "shared",
    user: "tscircuit",
    action: "shared a",
    target: "",
    amount: "$200 bounty",
    time: "2 months ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
];

// Mock Grants Data (as requested to remain)
const mockGrants = [
  {
    id: 1,
    title: "Open Source Grant 2024",
    description: "Funding for innovative open source projects in the ecosystem...",
    tags: ["Open Source", "Grant", "Funding"],
    price: "$10,000",
    currency: "USDC",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    type: "grant",
    applicants: 50,
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days
  },
  {
    id: 2,
    title: "DeFi Innovation Fund",
    description: "Support for new DeFi protocols building on our chain...",
    tags: ["DeFi", "Grant", "Innovation"],
    price: "$25,000",
    currency: "USDC",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
    type: "grant",
    applicants: 12,
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString(),
  }
];

export function OpportunityList({ title = "Browse Opportunities", type = "bounties" }: { title?: string, type?: "bounties" | "projects" | "grants" }) {
  const [activeTabs, setActiveTabs] = useState(["All"]);
  const [activeView, setActiveView] = useState(type === 'grants' ? "Grants" : "For you");
  const [sortOrder, setSortOrder] = useState('newest');

  // Fetch Data
  const { data: bountiesData, isLoading: isLoadingBounties } = useGetAllBounties({});
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects({});

  const toggleCategory = (cat: string) => {
    // ... (logic unchanged)
    if (cat === "All") {
      setActiveTabs(["All"]);
      return;
    }
    setActiveTabs((prev) => {
      let newTabs = prev.includes("All") ? [] : [...prev];
      if (newTabs.includes(cat)) {
        newTabs = newTabs.filter((t) => t !== cat);
      } else {
        newTabs.push(cat);
      }
      return newTabs.length === 0 ? ["All"] : newTabs;
    });
  };

  // Combine and Normalize Data
  const realOpportunities = [
    ...(bountiesData?.data || []).map((b: any) => ({
      id: b.id,
      title: b.title,
      description: b.shortDescription,
      tags: b.skills || [],
      price: b.reward,
      currency: b.rewardCurrency || 'USDC',
      company: b.owner?.username || 'Stallion',
      logo: b.owner?.profilePicture || '/assets/icons/sdollar.png',
      type: 'bounty',
      createdAt: b.createdAt,
      dueDate: b.submissionDeadline,
      applicants: b.applicationCount || 0
    })),
    ...(projectsData?.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.shortDescription,
      tags: p.skills || [],
      price: p.reward,
      currency: p.currency || 'USDC',
      company: p.owner?.companyName || p.owner?.username || 'Stallion',
      logo: p.owner?.companyLogo || p.owner?.profilePicture || '/assets/icons/sdollar.png',
      type: 'project',
      createdAt: p.createdAt,
      dueDate: p.deadline,
      applicants: p.applications?.length || 0
    })) || [])
  ].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOrder === 'reward') return (Number(b.price) || 0) - (Number(a.price) || 0);
    return 0;
  });

  // Determine source based on prop type or active view
  const isGrantsSection = type === 'grants';
  const opportunities = isGrantsSection ? mockGrants : realOpportunities;

  // Derive categories from opportunities tags
  const categories = useMemo(() => {
    const allTags = opportunities.flatMap(opp => opp.tags);
    const uniqueTags = Array.from(new Set(allTags.map(tag => tag.trim()))).filter(Boolean).sort();
    return ["All", ...uniqueTags];
  }, [opportunities]);

  const filteredOpportunities = opportunities.filter((opp) => {
    // 1. Filter by View
    if (!isGrantsSection) {
      if (activeView === "Projects" && opp.type !== "project") return false;
      if (activeView === "Bounties" && opp.type !== "bounty") return false;
    }

    // 2. Filter by Category
    if (!activeTabs.includes("All")) {
      const hasCategory = activeTabs.some(cat =>
        opp.tags.some((tag: string) => tag.toLowerCase() === cat.toLowerCase())
      );
      if (!hasCategory) return false;
    }

    return true;
  });

  const isLoading = !isGrantsSection && (isLoadingBounties || isLoadingProjects);

  // REMOVED EARLY RETURN HERE

  const handleViewAll = () => {
    if (activeView === 'Projects') return '/dashboard/projects';
    if (activeView === 'Bounties') return '/dashboard/bounties';
    if (activeView === 'Grants') return '/dashboard/grants';
    return '/dashboard/bounties';
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* ... Header Content ... */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground shrink-0">{title}</h2>
            <Button variant="default" size="icon" className="sm:hidden text-muted-foreground bg-transparent hover:text-foreground h-auto p-0">
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>

          {!isGrantsSection && (
            <>
              <div className="hidden sm:block h-4 w-px bg-border"></div>
              <ul className="flex flex-row gap-4 text-sm font-medium text-muted-foreground overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
                {["For you", "Projects", "Bounties"].map((view) => (
                  <li
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`cursor-pointer transition-all pb-1 border-b-2 whitespace-nowrap ${activeView === view
                      ? "text-foreground border-primary"
                      : "border-transparent hover:text-foreground hover:border-primary"
                      }`}
                  >
                    {view}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ListFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                Newest First {sortOrder === 'newest' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                Oldest First {sortOrder === 'oldest' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('reward')}>
                Highest Reward {sortOrder === 'reward' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Categories Section */}
      {!isLoading && (
        <div className="relative w-full group">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar w-full mask-linear-fade max-w-full">
            {categories.map((cat) => {
              const isActive = activeTabs.includes(cat);
              return (
                <Button
                  key={cat}
                  size="sm"
                  variant={isActive ? "default" : "secondary"}
                  onClick={() => toggleCategory(cat)}
                  className={`h-8 text-xs px-4 whitespace-nowrap rounded-md shrink-0 transition-all ${isActive
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20"
                    : "bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {isActive && <CircleCheck className="h-4 w-4 mr-2 text-primary-foreground" />}
                  {cat}
                </Button>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-2 w-12 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
      )}

      {/* Loading Skeletons for Categories (Optional - or just hide categories when loading which is done above) */}
      {isLoading && (
        <div className="flex gap-2 overflow-hidden pb-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      )}

      <div className="grid gap-3">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl border border-border bg-card p-4 gap-4">
              <div className="flex flex-1 items-start md:items-center gap-3 md:gap-4">
                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <Skeleton className="h-5 w-1/3 md:w-1/4" />
                  <Skeleton className="h-4 w-full md:w-2/3" />
                  <div className="flex gap-2 mt-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2 justify-center pl-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          ))
        ) : filteredOpportunities.length > 0 ? (
          filteredOpportunities.slice(0, 5).map((opp) => (

            <Link
              key={`${opp.type}-${opp.id}`}
              href={`/dashboard/${opp.type === 'project' ? 'projects' : 'bounties'}/${opp.id}`}
              className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
            >
              {/* Left Content Wrapper */}
              <div className="flex flex-1 items-start md:items-center p-4 gap-3 md:gap-4">
                {/* Logo */}
                <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 overflow-hidden rounded-full bg-white p-0 flex items-center justify-center mt-1 md:mt-0">
                  <Image
                    src={opp.logo}
                    width={48}
                    height={48}
                    alt={opp.company}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>

                {/* Main Info */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-1 leading-tight">{opp.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl font-light">
                      {opp.description}
                    </p>
                  </div>

                  {/* Meta Row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 md:gap-4 text-[10px] md:text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-primary">
                        <BriefcaseBusiness className="w-full h-full" />
                      </div>
                      <span className="text-foreground truncate max-w-[100px] md:max-w-none">{opp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{opp.applicants}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <Timer className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">
                        {opp.dueDate ? `Due in ${formatDistanceToNow(new Date(opp.dueDate))}` : 'No deadline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <Gift className="w-3.5 h-3.5" />
                      </div>
                      <span className="capitalize">{opp.type}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {opp.tags.slice(0, 3).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-xs text-primary border-[0.54px] border-primary/20 font-inter text-[8px] font-medium px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {opp.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-primary/10 text-xs text-primary border-[0.54px] border-primary/20 font-inter text-[8px] font-medium px-2 py-0.5 rounded-full">
                        +{opp.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Info (Price) */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 md:p-6 sm:pr-24 lg:pr-6 gap-2 border-t sm:border-t-0 border-border bg-card sm:bg-transparent md:mr-[68px]">
                <span className="text-xl md:text-3xl font-bold text-foreground tracking-tight whitespace-nowrap">
                  {/* Handle range or string price? Assuming number or string. Format if number. */}
                  {isNaN(Number(opp.price)) ? opp.price : Number(opp.price).toLocaleString()}
                </span>
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-full px-4 py-0.5 text-xs font-semibold">
                  {opp.currency || 'USDC'}
                </Badge>
              </div>

              {/* Far Right Action Bar (Desktop) */}
              <div className="hidden sm:flex absolute right-0 top-0 bottom-0 w-[65px] items-center justify-center cursor-pointer transition-colors bg-primary/70 hover:bg-primary/80">
                <ArrowRight className="h-8 w-8 text-primary-foreground" />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm border border-border rounded-xl bg-muted/20">
            No opportunities found in this category.
          </div>
        )}
      </div>
      <Link href={handleViewAll()} passHref className="w-full">
        <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs h-9 rounded-lg mt-2 border border-primary/20">
          View All
        </Button>
      </Link>
    </div>
  );
}

import { useGetActivities } from "@/lib/api/activities/queries";

// ... (keep previous imports)

export function ActivityFeed() {
  const { data: activitiesData, isLoading } = useGetActivities({
    page: '1',
    limit: '10',
  });

  const activities = activitiesData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
        <div className="flex justify-center p-8">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  // Fallback empty state
  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
        <div className="relative pl-4">
          <div className="absolute left-[36px] top-2 bottom-4 w-px bg-border" />
          <p className="text-muted-foreground text-sm py-4">No recent activities.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
      <div className="relative pl-2">
        {/* Vertical Line */}
        <div className="absolute left-[7px] top-2 bottom-4 w-px bg-border hidden sm:block" />

        <div className="flex flex-col gap-6">
          {activities.map((activity) => {
            // Basic determining of "Won" status for styling, though simplified
            const isWon = activity.type.includes('WON') || activity.type === 'BOUNTY_COMPLETED';

            return (
              <div key={activity.id} className="flex items-start gap-4 group relative z-10 pl-6">
                {/* Timeline Dot */}
                <div className="absolute left-[2px] top-[6px] w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors ring-4 ring-background z-20" />

                {/* Text Content */}
                <div className="flex flex-col gap-1 pt-0.5 min-w-0 flex-1">
                  <div className="text-[13px] font-inter leading-relaxed text-foreground">
                    {activity.message}
                  </div>

                  {/* Optional Meta Info */}
                  {(activity.metadata?.reward) && (
                    <span className="text-primary font-bold text-xs">
                      Reward: {activity.metadata.reward} {activity.metadata.currency}
                    </span>
                  )}

                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
