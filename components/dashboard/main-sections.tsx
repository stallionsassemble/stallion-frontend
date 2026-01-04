"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseBusiness, CircleCheck, Gift, ListFilter, Timer, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [activeView, setActiveView] = useState(type === 'grants' ? "Grants" : "For you"); // "For you" | "Projects" | "Bounties" | "Grants"

  // Fetch Data
  const { data: bountiesData, isLoading: isLoadingBounties } = useGetAllBounties({});
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects({});

  const toggleCategory = (cat: string) => {
    if (cat === "All") {
      setActiveTabs(["All"]);
      return;
    }
    setActiveTabs((prev) => {
      // If "All" was selected, clear it and start fresh with the new category
      let newTabs = prev.includes("All") ? [] : [...prev];

      if (newTabs.includes(cat)) {
        newTabs = newTabs.filter((t) => t !== cat);
      } else {
        newTabs.push(cat);
      }

      // If nothing left selected, default back to "All"
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
      company: b.owner?.username || 'Stallion', // Fallback if owner not populated
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
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Determine source based on prop type or active view
  const isGrantsSection = type === 'grants';
  const opportunities = isGrantsSection ? mockGrants : realOpportunities;

  // Derive categories from opportunities tags (Dynamic Skills)
  const categories = useMemo(() => {
    const allTags = opportunities.flatMap(opp => opp.tags);
    const uniqueTags = Array.from(new Set(allTags.map(tag => tag.trim()))).filter(Boolean).sort();
    // Optional: Filter out tags that are too rare? For now show all unique ones up to a limit? 
    // Let's just show top 10 appearing items maybe? 
    // Or just all. Horizontal scroll handles it.
    return ["All", ...uniqueTags];
  }, [opportunities]);

  const filteredOpportunities = opportunities.filter((opp) => {
    // 1. Filter by View
    if (!isGrantsSection) {
      if (activeView === "Projects" && opp.type !== "project") return false;
      if (activeView === "Bounties" && opp.type !== "bounty") return false;
    }

    // 2. Filter by Category (Active Tabs match Tags)
    if (!activeTabs.includes("All")) {
      // Check if ANY selected category matches ANY of the opportunity's tags
      const hasCategory = activeTabs.some(cat =>
        opp.tags.some((tag: string) => tag.toLowerCase() === cat.toLowerCase())
      );
      if (!hasCategory) return false;
    }

    return true;
  });

  const isLoading = !isGrantsSection && (isLoadingBounties || isLoadingProjects);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading opportunities...</div>;
  }

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Title Row (Mobile: Title + Filter) */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground shrink-0">{title}</h2>

            {/* Mobile Filter Button */}
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

        {/* Desktop Filter Button */}
        <Button variant="default" size="icon" className="hidden sm:flex text-muted-foreground bg-transparent hover:text-foreground">
          <ListFilter className="h-4 w-4" />
        </Button>
      </div>

      {/* Categories Section */}
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
        {/* Gradient Fade for scroll indication on mobile */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>

      <div className="grid gap-3">
        {filteredOpportunities.length > 0 ? (
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

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[36px] top-2 bottom-4 w-px bg-border" />

        <div className="flex flex-col gap-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 group relative z-10">
              {/* Leff Side - Avatar(s) */}
              <div className="relative shrink-0 w-[70px] h-[40px] flex items-center justify-center">

                {activity.type === 'awarded' ? (
                  <>
                    {/* User Avatar (Back) */}
                    <div className="absolute left-0 z-10 w-10 h-10 rounded-[10.28px] border-2 border-background bg-muted overflow-hidden">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Target/App Logo (Front) */}
                    <div className="absolute left-6 z-20 w-10 h-10 rounded-[10.28px] border-2 border-background bg-card flex items-center justify-center overflow-hidden shadow-lg">
                      <div className="w-6 h-6 text-foreground">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Shared Activity - Single Centered Icon */
                  <div className="absolute left-0 z-10 w-10 h-10 rounded-[10.28px] bg-primary flex items-center justify-center border-2 border-background shadow-lg">
                    <span className="text-primary-foreground font-bold text-sm">ts</span>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-wrap items-center gap-x-1.5 text-[13px] font-inter leading-relaxed">
                <span className="text-foreground font-medium">{activity.user}</span>
                <span className="text-muted-foreground">
                  {activity.action}
                </span>

                {activity.type === 'awarded' && (
                  <>
                    <span className="text-foreground font-medium">
                      {activity.target}
                    </span>
                    <span className="text-muted-foreground">a</span>
                  </>
                )}

                <span className="text-primary font-bold">
                  {activity.amount}
                </span>
                <span className="text-muted-foreground text-xs ml-1">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
