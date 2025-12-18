"use client";

import { ForumDiscussionCard } from "@/components/forum/forum-discussion-card";
import { ForumFilters } from "@/components/forum/forum-filters";
import { ForumStats } from "@/components/forum/forum-stats";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";

const discussions = [
  {
    id: 1,
    title: "Best practices for Soroban smart contract security",
    description: "I've been working with Soroban for a few months now and wanted to share some security practices I've learned. These include resource management, authorization best practices, and avoiding common pitfalls like reentrancy...",
    author: "stellar-dev",
    timeAgo: "2h ago",
    replies: 23,
    views: 458,
    likes: 46,
    category: "Smart Contracts",
    isPinned: true,
  },
  {
    id: 2,
    title: "How to optimize gas consumption in complex DeFi protocols?",
    description: "When building deep liquidity pools, gas costs can skyrocket. I found that using bitmasks and packing variables can save up to 15% on storage costs. Thoughts on this approach?",
    author: "gas-wizard",
    timeAgo: "5h ago",
    replies: 12,
    views: 890,
    likes: 132,
    category: "Development",
    isPinned: true,
  },
  {
    id: 3,
    title: "Integrating Stallion with legacy systems: A guide",
    description: "Transitioning to decentralized infra doesn't happen overnight. Here is how we connected our traditional PostgreSQL backend to listen for Stallion events in real-time.",
    author: "infra-master",
    timeAgo: "1d ago",
    replies: 45,
    views: 1200,
    likes: 89,
    category: "Getting Started",
  },
  {
    id: 4,
    title: "Community Town Hall: Q1 Roadmap & Governance",
    description: "Join us this Friday for our quarterly town hall. We'll be discussing the latest governance proposals and the upcoming v2.0 release. Your feedback is crucial!",
    author: "stallion-team",
    timeAgo: "2d ago",
    replies: 156,
    views: 3400,
    likes: 450,
    category: "Announcement",
  },
  {
    id: 5,
    title: "Looking for collaborators: New NFT Marketplace on Stallion",
    description: "Starting a project to build a zero-fee NFT marketplace focused on digital art. Need specialized React devs and smart contract auditors. DM if interested!",
    author: "art-block",
    timeAgo: "3d ago",
    replies: 8,
    views: 230,
    likes: 12,
    category: "Collaboration",
  },
];

export default function ForumPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[36px] md:text-4xl font-inter -tracking-[4%] font-bold text-foreground">Community Forum</h1>
          <p className="text-foreground font-medium font-inter text-[14px]">Discuss, share, and learn with the community</p>
        </div>
        <Button variant={'stallion'}>
          <Send className="h-4 w-4 rotate-0" />
          New Discussion
        </Button>
      </div>

      {/* Stats */}
      <ForumStats />

      {/* Filters & Content Container */}
      <div className="space-y-6">
        <ForumFilters />

        {/* Discussions List */}
        <div className="overflow-hidden">
          {discussions.map((discussion) => (
            <Link href={`/dashboard/forums/${discussion.id}`}>
              <ForumDiscussionCard key={discussion.id} {...discussion} />
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {/* <div className="flex justify-center pt-4">
          <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/10 h-10 px-8 rounded-lg uppercase text-xs font-bold tracking-widest">
            Load More Discussions
          </Button>
        </div> */}
      </div>
    </div>
  );
}