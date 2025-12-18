"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { BountyDetailsSidebar } from "@/components/bounties/bounty-details-sidebar";
import { DetailsHeader } from "@/components/bounties/details-header";
import { DetailsNavigation } from "@/components/bounties/details-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileUp, Gift, Image as ImageIcon, Info, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BountyDetailsPage() {
  const params = useParams();

  // Mock Similar Bounties
  const similarBounties = [
    {
      id: 101,
      title: "Solana Smart Contract Audit",
      description: "Ensure the security of our Solana-based DeFi protocol...",
      company: "Stallion Foundation",
      logo: "/assets/icons/sdollar.png",
      amount: "$5,000",
      type: "USDC" as const,
      tags: ["Rust", "Solana", "Audit"],
      participants: 12,
      dueDate: "5d"
    },
    {
      id: 102,
      title: "DeFi Protocol Security Review",
      description: "Looking for experts to review our yield farming mechanics...",
      company: "Stallion Foundation",
      logo: "/assets/icons/sdollar.png",
      amount: "$3,500",
      type: "USDC" as const,
      tags: ["Solidity", "Security", "DeFi"],
      participants: 8,
      dueDate: "10d"
    },
    {
      id: 103,
      title: "NFT Marketplace Vulnerability Assessment",
      description: "Comprehensive penetration testing for our new NFT platform...",
      company: "Stallion Foundation",
      logo: "/assets/icons/sdollar.png",
      amount: "$2,000",
      type: "USDC" as const,
      tags: ["Security", "PenTest", "NFT"],
      participants: 5,
      dueDate: "14d"
    }
  ];

  return (
    <div className="pb-20 space-y-8">
      {/* Top Navigation Bar */}
      <DetailsNavigation backLink="/dashboard/bounties" backText="Back to Bounties" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_454px] gap-8">
        {/* Main Content Column */}
        <div className="min-w-0 space-y-8">

          {/* Header Section */}
          <section className="rounded-xl border border-primary bg-card/30 p-6">
            <DetailsHeader
              type="BOUNTY"
              title="Smart Contract Security Audit"
              company="Stallion Foundation"
              logo="/assets/icons/sdollar.png"
              participants={12}
              dueDate="5d"
              tags={["Solidity", "Smart Contract", "Audit", "DeFi"]}
              status="Submission Open"
              commentsCount={2}
            />
          </section>

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Description */}
          <section className="space-y-4 rounded-xl border border-primary bg-card/30 p-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Description
            </h3>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed">
              <p className="mb-4">
                We are looking for an experienced smart contract security auditor to perform a comprehensive security audit of our protocol smart contracts.
                The protocol is built on custom Solidity contracts with heavy dependency on 3rd party oracles.
              </p>
              <p className="mb-2 font-medium text-white">The audit should cover:</p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-center gap-2"> <span className="text-primary text-lg">•</span> Reentrancy attacks</li>
                <li className="flex items-center gap-2"> <span className="text-primary text-lg">•</span> Oracle manipulation risks</li>
                <li className="flex items-center gap-2"> <span className="text-primary text-lg">•</span> Access control vulnerabilities</li>
                <li className="flex items-center gap-2"> <span className="text-primary text-lg">•</span> Gas optimization</li>
                <li className="flex items-center gap-2"> <span className="text-primary text-lg">•</span> Logic errors and edge cases</li>
              </ul>
            </div>
          </section>

          {/* Requirements */}
          <section className="space-y-4 rounded-xl border border-primary bg-card/30 p-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Requirements
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "3+ years of smart contract auditing experience",
                "Proven track record with DeFi protocols",
                "Familiarity with common attack vectors",
                "Experience with Foundry or Hardhat testing",
                "Ability to write detailed technical reports"
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Deliverables */}
          <section className="space-y-4 rounded-xl border border-primary bg-card/30 p-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Deliverables
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Comprehensive security audit report",
                "Severity classification for each finding",
                "Recommended fixes and code suggestions",
                "Executive summary for non-technical stakeholders",
                "Follow-up review after fixes are implemented"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 bg-blue-500/10 p-0.5 rounded px-1">
                    <span className="text-primary text-[10px]">✓</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Attachments */}
          <section className="space-y-4 p-6 border border-primary text-foreground">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Attachments
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-primary min-w-[240px]">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Contract_Sepc...pdf</span>
                  <span className="text-[10px] text-muted-foreground">2.4 MB</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-primary hover:text-primary hover:bg-transparent"><Download className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-primary min-w-[240px]">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Architecture_D...png</span>
                  <span className="text-[10px] text-gray-500">4.8 MB</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-primary hover:text-primary hover:bg-transparent"><Download className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border min-w-[240px]">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Protocol_Spec...docx</span>
                  <span className="text-[10px] text-muted-foreground">1.2 MB</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-primary hover:text-primary hover:bg-transparent"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          </section>



        </div>

        {/* Right Sidebar Column */}
        <div className="hidden lg:block space-y-8">
          <BountyDetailsSidebar />
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden block mt-8">
          <BountyDetailsSidebar />
        </div>
      </div>
      <div className="space-y-8">
        {/* Similar Bounties */}
        <section className="space-y-6 pt-8 border-t border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Similar Bounties
          </h3>
          <div className="flex overflow-x-auto pb-6 gap-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pl-1">
            {similarBounties.map((bounty) => (
              <BountyCard key={bounty.id} {...bounty} />
            ))}
          </div>
        </section>

        {/* Discussion */}
        <section className="space-y-6 pt-8 border-t  border border-primary p-6 h-auto w-full ">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Discussion <span className="text-xs text-muted-foreground ml-2">2 comments</span>
          </h3>

          {/* Comment Input */}
          <div className="relative">
            {/* Avatar Decoration */}
            <div className="h-10 w-10 absolute left-3 top-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 p-px">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                <span className="text-xs text-foreground">You</span>
              </div>
            </div>
            <textarea
              className="w-full bg-card border border-primary rounded-xl p-4 pl-16 min-h-[120px] text-sm text-foreground focus:outline-none focus:border-primary resize-none"
              placeholder="Ask a question or leave a comment..."
            />
            <Button className="absolute bottom-3 right-3 bg-primary hover:bg-primary/90 h-8 text-xs font-medium px-4">Post Comment</Button>
          </div>

          {/* Comment List */}
          <div className="space-y-8">
            {/* Comment 1 */}
            <div className="group">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500 overflow-hidden shrink-0">
                  <Image src="https://avatar.vercel.sh/alex" width={40} height={40} alt="User" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Alex Chen</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Is there any specific testing framework you prefer we use for the audit? I typically work with Foundry but can adapt to Hardhat if needed.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <button className="hover:text-foreground flex items-center gap-1 transition-colors"><span className="text-red-500">❤️</span> 42</button>
                    <button className="hover:text-foreground flex items-center gap-1 transition-colors">💬 Reply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 (Reply) */}
            <div className="group pl-14 relative">
              {/* Thread Line */}
              <div className="absolute left-[27px] -top-8 bottom-8 w-px bg-border -z-10 rounded-full"></div>

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                  <Image src="/assets/icons/sdollar.png" width={32} height={32} alt="Stallion" className="object-contain" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Solana Foundation</span>
                      <Badge className="bg-primary/30 text-foreground border-0 text-[10px] px-1.5 h-4">Author</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We prefer Foundry for this project, but Hardhat is acceptable if coverage is comprehensive.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <button className="hover:text-foreground flex items-center gap-1 transition-colors"><span className="text-red-500">❤️</span> 12</button>
                    <button className="hover:text-foreground flex items-center gap-1 transition-colors">💬 Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
