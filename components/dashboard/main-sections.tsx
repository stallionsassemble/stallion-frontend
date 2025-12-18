"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseBusiness, CircleCheck, Gift, ListFilter, Timer, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock Data
const opportunities = [
  {
    id: 1,
    title: "React Dashboard UI Design",
    description: "Design a professional dashboard UI for a fintech platform...",
    tags: ["React", "Typescript", "UI/UX"],
    price: "$3,500",
    company: "Stallion Foundation",
    category: "Design",
    type: "bounty",
    logo: "/assets/icons/sdollar.png", // placeholder
  },
  {
    id: 2,
    title: "Smart Contract Audit Fix",
    description: "Audit and fix vulnerabilities in the staking contract...",
    tags: ["Solidity", "Security", "Audit"],
    price: "$5,000",
    company: "Stallion Foundation",
    category: "Development",
    type: "bounty",
    logo: "/assets/icons/sdollar.png",
  },
  {
    id: 3,
    title: "Marketing Campaign Manager",
    description: "Lead the marketing campaign for the Q4 product launch...",
    tags: ["Marketing", "Strategy", "Social"],
    price: "$2,000",
    company: "Stallion Foundation",
    category: "Marketing",
    type: "project",
    logo: "/assets/icons/sdollar.png",
  },
  {
    id: 4,
    title: "DeFi Protocol Research",
    description: "Research and analysis of current DeFi yield aggregation strategies...",
    tags: ["DeFi", "Research", "Finance"],
    price: "$1,500",
    company: "Stallion Foundation",
    category: "Research",
    type: "project",
    logo: "/assets/icons/sdollar.png",
  },
];

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

export function OpportunityList({ title = "Browse Opportunities", type = "bounties" }: { title?: string, type?: "bounties" | "grants" }) {
  const [activeTabs, setActiveTabs] = useState(["All"]);
  const [activeView, setActiveView] = useState("For you"); // "For you" | "Projects" | "Bounties"
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];

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

  const filteredOpportunities = opportunities.filter(opp => {
    // 1. Filter by View (Tab)
    if (activeView === "Projects" && opp.type !== "project") return false;
    if (activeView === "Bounties" && opp.type !== "bounty") return false;
    // "For you" shows all for now

    // 2. Filter by Category
    // If "All" is active, show everything. Otherwise, checking if the opp's category is in the active list.
    if (!activeTabs.includes("All") && !activeTabs.includes(opp.category)) return false;

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
          <h2 className="text-xl font-bold text-foreground shrink-0">{title}</h2>
          <div className="h-4 w-px bg-border"></div>
          <ul className="flex flex-row gap-4 text-sm font-medium text-muted-foreground overflow-x-auto no-scrollbar pb-1">
            {["For you", "Projects", "Bounties"].map((view) => (
              <li
                key={view}
                onClick={() => setActiveView(view)}
                className={`cursor-pointer transition-all pb-1 border-b-2 ${activeView === view
                  ? "text-foreground border-primary"
                  : "border-transparent hover:text-foreground hover:border-primary"
                  }`}
              >
                {view}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="default" size="icon" className="text-muted-foreground bg-transparent hover:text-foreground">
          <ListFilter className="h-4 w-4" />
        </Button>
      </div>

      {/* Categories Section */}
      {/* {type === "bounties" && ( */}
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
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
            >
              {/* Left Content Wrapper */}
              <div className="flex flex-1 items-center p-6 gap-6">
                {/* Logo */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white p-2 flex items-center justify-center">
                  <Image
                    src={opp.logo}
                    width={64}
                    height={64}
                    alt={opp.company}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Main Info */}
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl font-light">
                      {opp.description}
                    </p>
                  </div>

                  {/* Meta Row */}
                  <div className="flex wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-primary">
                        <BriefcaseBusiness />
                      </div>
                      <span className="text-foreground">{opp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>200</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <Timer className="w-3.5 h-3.5" />
                      </div>
                      <span>Due in 10d</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 text-primary">
                        <Gift className="w-3.5 h-3.5" />
                      </div>
                      <span className="capitalize">{opp.type || "Bounty"}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    {opp.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-xs text-primary border-[0.54px] border-primary/20 font-inter text-[8px] font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Info (Price) */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center p-6 sm:pr-24 gap-2 border-t sm:border-t-0 border-border bg-card sm:bg-transparent">
                <span className="text-3xl font-bold text-foreground tracking-tight">{opp.price}</span>
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-full px-4 py-0.5 text-xs font-semibold">
                  USDC
                </Badge>
              </div>

              {/* Far Right Action Bar (Desktop) */}
              <div className="hidden sm:flex absolute right-0 top-0 bottom-0 w-[65px] items-center justify-center cursor-pointer transition-colors bg-primary/70 hover:bg-primary/80">
                <ArrowRight className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm border border-border rounded-xl bg-muted/20">
            No opportunities found in this category.
          </div>
        )}
      </div>
      <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs h-9 rounded-lg mt-2 border border-primary/20">
        View All
      </Button>
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
