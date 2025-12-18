"use client";

import { ForumPostContent } from "@/components/forum/forum-post-content";
import { ForumReplies } from "@/components/forum/forum-replies";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Undo2 } from "lucide-react";
import Link from "next/link";

const postData = {
  title: "Best Practices for Soroban Smart Contract Security",
  category: "Smart Contracts",
  author: "stellar-dev",
  timeAgo: "2h ago",
  views: 458,
  likes: 46,
  replies: 23,
  content: (
    <>
      <div className="space-y-4 text-[14px] font-inter">
        <p>
          I&apos;ve been working with Soroban for a few months now and wanted to share some security practices I&apos;ve learned along the way.
        </p>

        <h3 className="text-foreground font-bold text-lg mt-6">1. Input Validation</h3>
        <p>Always validate all inputs to your contract functions. Never trust external data.</p>
        <pre className="bg-primary/5 p-4 rounded-lg text-xs overflow-x-auto text-primary border border-primary/20 font-mono">
          {`fn transfer(env: Env, from: Address, to: Address, amount: i128) {
  assert!(amount > 0, "Amount must be positive");
  from.require_auth();
  // ... rest of the logic
}`}
        </pre>

        <h3 className="text-foreground font-bold text-lg mt-6">2. Access Control</h3>
        <p>Implement proper access control mechanisms. Use <code className="text-primary bg-primary/10 px-1 rounded">require_auth()</code> appropriately.</p>

        <h3 className="text-foreground font-bold text-lg mt-6">3. Reentrancy Guards</h3>
        <p>While Soroban has some built-in protections, it&apos;s still good practice to be mindful of reentrancy patterns.</p>

        <h3 className="text-foreground font-bold text-lg mt-6">4. Testing</h3>
        <p>Write comprehensive tests for all edge cases. Use fuzzing when possible.</p>

        <h3 className="text-foreground font-bold text-lg mt-6">5. Audits</h3>
        <p>Before deploying to mainnet, consider getting a professional audit.</p>
        <p>What other practices do you all follow?</p>
      </div>
    </>
  ),
};

const ForumDetailPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Column */}
        <div className="flex-1 space-y-6 max-w-4xl">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard/forums">
              <Button variant="outline" className="h-8 px-4 border-border bg-card text-foreground gap-2 rounded-lg text-xs font-inter font-medium hover:bg-card/80">
                <Undo2 className="h-3.5 w-3.5" />
                Back to discussion
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <ForumPostContent {...postData} />
          <ForumReplies />
        </div>

        {/* Sidebar Column */}
        <ForumSidebar />
      </div>
    </div>
  );
};

export default ForumDetailPage;