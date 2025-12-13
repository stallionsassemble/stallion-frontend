"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    logo: "/assets/icons/sdollar.png", // placeholder
  },
  {
    id: 2,
    title: "Smart Contract Audit Fix",
    description: "Audit and fix vulnerabilities in the staking contract...",
    tags: ["Solidity", "Security", "Audit"],
    price: "$5,000",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
  },
  {
    id: 3,
    title: "Marketing Campaign Manager",
    description: "Lead the marketing campaign for the Q4 product launch...",
    tags: ["Marketing", "Strategy", "Social"],
    price: "$2,000",
    company: "Stallion Foundation",
    logo: "/assets/icons/sdollar.png",
  },
];

const activities = [
  {
    id: 1,
    user: "Odrant",
    action: "awarded",
    target: "Denizhan Dakilir",
    amount: "$200 bounty",
    time: "2 mins ago",
    avatar: "https://avatar.vercel.sh/odrant",
  },
  {
    id: 3,
    user: "Stallion",
    action: "awarded",
    target: "Olamide Olutekunbi",
    amount: "$250 bounty",
    time: "2 days ago",
    avatar: "https://avatar.vercel.sh/stallion",
  },
  {
    id: 2,
    user: "Stallion",
    action: "awarded",
    target: "Olamide Olutekunbi",
    amount: "$250 bounty",
    time: "2 days ago",
    avatar: "https://avatar.vercel.sh/stallion",
  },
  {
    id: 4,
    user: "tscircuit",
    action: "shared a",
    target: "$200 bounty",
    amount: "",
    time: "2 mins ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
  {
    id: 5,
    user: "tscircuit",
    action: "shared a",
    target: "$400 bounty",
    amount: "",
    time: "1 month ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
  {
    id: 6,
    user: "tscircuit",
    action: "shared a",
    target: "$200 bounty",
    amount: "",
    time: "1 month ago",
    avatar: "https://avatar.vercel.sh/tscircuit",
  },
];

export function OpportunityList({ title = "Browse Opportunities", type = "bounties" }: { title?: string, type?: "bounties" | "grants" }) {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];

  const filteredOpportunities = activeTab === "All"
    ? opportunities
    : opportunities.filter(opp => opp.category === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-white shrink-0">{title}</h2>

        {type === "bounties" && (
          <div className="relative sm:flex-1 sm:min-w-0 group flex justify-end">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full mask-linear-fade max-w-full">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={activeTab === cat ? "default" : "ghost"}
                  onClick={() => setActiveTab(cat)}
                  className={`h-7 text-xs whitespace-nowrap shrink-0 ${activeTab === cat
                    ? "bg-[#007AFF] hover:bg-[#007AFF]/80 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
            {/* Gradient Fade for scroll indication on mobile */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-[#04020E] to-transparent pointer-events-none sm:hidden" />
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#09090B] p-4 transition-all hover:border-[#007AFF] hover:bg-[#007AFF]/5"
            >
              {/* ... existing card content ... */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/5 p-2">
                  <Image
                    src={opp.logo}
                    width={48}
                    height={48}
                    alt={opp.company}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{opp.title}</h3>
                  <p className="hidden text-xs text-gray-400 md:block max-w-md line-clamp-1">{opp.description}</p>
                  <div className="mt-2 flex gap-2">
                    {opp.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 text-[10px] text-gray-400 hover:bg-white/10 hover:text-white border-0 font-normal py-0.5 h-auto rounded-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-1 block text-[10px] text-gray-500 md:hidden line-clamp-1">{opp.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-lg font-bold text-white">{opp.price}</span>
                <Button size="icon" className="h-8 w-8 shrink-0 rounded-full bg-[#007AFF] text-white hover:bg-[#0066CC]">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm border border-white/5 rounded-xl bg-white/2">
            No opportunities found in this category.
          </div>
        )}
      </div>
      <Button className="w-full bg-[#007AFF]/20 text-[#007AFF] hover:bg-[#007AFF]/30 text-xs h-9 rounded-lg mt-2">
        View All
      </Button>
    </div>
  );
}

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-blue/20 flex items-center justify-center font-bold text-blue-400 text-xs">
              {activity.user[0]}
            </div>
            <div className="flex-1">
              <p className="text-gray-300">
                <span className="font-semibold text-white">{activity.user}</span> {activity.action} <span className="font-semibold text-white">{activity.target}</span> <span className="text-[#007AFF]">{activity.amount}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
