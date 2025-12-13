"use client";

import { BountyDetailsSidebar } from "@/components/bounties/bounty-details-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Bookmark, Download, FileText, Image as ImageIcon, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BountyDetailsPage() {
  const params = useParams(); // In a real app we'd fetch data based on this ID

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      {/* Main Content Column */}
      <div className="min-w-0 space-y-8">

        {/* Back Link */}
        <Link href="/dashboard/bounties" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Bounties
        </Link>

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full bg-white/5 p-3 border border-white/10">
              <Image src="/assets/icons/sdollar.png" width={80} height={80} alt="Logo" className="object-contain h-full w-full" />
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">React Dashboard UI Design</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active
                </span>
                <span>•</span>
                <span>Posted 2 days ago</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  {["React", "Design", "UI/UX"].map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-400 border-0 h-5 text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="icon" className="border-white/10 bg-transparent text-gray-400 hover:text-white">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/10 bg-transparent text-gray-400 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10" />

        {/* Description */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#007AFF]" />
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed">
            <p>
              We are looking for an experienced UI/UX designer to create a comprehensive dashboard layout for our fintech platform.
              The dashboard should be modern, responsive, and user-friendly.
            </p>
            <p className="mt-2">Key requirements include:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Dark mode centered design</li>
              <li>Financial data visualization charts</li>
              <li>Responsive navigation sidebar</li>
              <li>User profile and settings pages</li>
            </ul>
            <p className="mt-4">
              See the attached screenshots for inspiration styling. We expect the deliverables to be in Figma format with a complete design system.
            </p>
          </div>
        </section>

        {/* Requirements */}
        <section className="space-y-4 rounded-xl border border-white/10 bg-[#09090B]/50 p-6">
          <h3 className="text-base font-bold text-[#007AFF]">Requirements</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] mt-1">•</span>
              3+ years of smart contract auditing experience
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] mt-1">•</span>
              Proven track record with DeFi protocols
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] mt-1">•</span>
              Familiarity with common attack vectors
            </li>
          </ul>
        </section>

        {/* Deliverables */}
        <section className="space-y-4 rounded-xl border border-white/10 bg-[#09090B]/50 p-6">
          <h3 className="text-base font-bold text-[#007AFF]">Deliverables</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="text-blue-400 flex items-center gap-2">
              <span className="bg-blue-500/10 p-1 rounded-sm">✓</span> Detailed Audit Report
            </li>
            <li className="text-blue-400 flex items-center gap-2">
              <span className="bg-blue-500/10 p-1 rounded-sm">✓</span> Severity classification for each finding
            </li>
            <li className="text-blue-400 flex items-center gap-2">
              <span className="bg-blue-500/10 p-1 rounded-sm">✓</span> Recommended fixes and code suggestions
            </li>
            <li className="text-gray-400 flex items-center gap-2">
              <span className="bg-blue-500/10 p-1 rounded-sm text-blue-400">✓</span> Executive summary for non-technical stakeholders
            </li>
            <li className="text-gray-400 flex items-center gap-2">
              <span className="bg-blue-500/10 p-1 rounded-sm text-blue-400">✓</span> Follow-up review after fixes are implemented
            </li>
          </ul>
        </section>

        {/* Payment Milestones */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#007AFF]">Payment Milestones</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#050B1C] border border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-mono">1</div>
                <div>
                  <p className="text-sm font-bold text-white">Detailed Audit Report</p>
                  <p className="text-[10px] text-gray-500">Due: Dec 8, 2024</p>
                </div>
              </div>
              <span className="text-white font-bold">$1,000</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#050B1C] border border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-mono">2</div>
                <div>
                  <p className="text-sm font-bold text-white">Detailed Audit Report</p>
                  <p className="text-[10px] text-gray-500">Due: Dec 8, 2024</p>
                </div>
              </div>
              <span className="text-white font-bold">$1,000</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#050B1C] border border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-mono">3</div>
                <div>
                  <p className="text-sm font-bold text-white">Detailed Audit Report</p>
                  <p className="text-[10px] text-gray-500">Due: Dec 8, 2024</p>
                </div>
              </div>
              <span className="text-white font-bold">$1,000</span>
            </div>
          </div>
        </section>

        {/* Attachments */}
        <section className="space-y-4 border rounded-xl border-blue-900/30 bg-[#050B1C] p-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#007AFF]">Attachments</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 p-2 pr-4 rounded bg-[#09090B] border border-white/10">
              <div className="h-8 w-8 bg-blue-500/10 flex items-center justify-center rounded">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Contract_Specifications.pdf</span>
                <span className="text-[10px] text-gray-500">2.4 MB</span>
              </div>
              <Link href="#" className="ml-2 text-blue-500 hover:text-blue-400"><Download className="h-3 w-3" /></Link>
            </div>

            <div className="flex items-center gap-3 p-2 pr-4 rounded bg-[#09090B] border border-white/10">
              <div className="h-8 w-8 bg-blue-500/10 flex items-center justify-center rounded">
                <ImageIcon className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Architecture_Diagram.png</span>
                <span className="text-[10px] text-gray-500">2.4 MB</span>
              </div>
              <Link href="#" className="ml-2 text-blue-500 hover:text-blue-400"><Download className="h-3 w-3" /></Link>
            </div>

            <div className="flex items-center gap-3 p-2 pr-4 rounded bg-[#09090B] border border-white/10">
              <div className="h-8 w-8 bg-blue-500/10 flex items-center justify-center rounded">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Contract_Specifications_Product...</span>
                <span className="text-[10px] text-gray-500">2.4 MB</span>
              </div>
              <Link href="#" className="ml-2 text-blue-500 hover:text-blue-400"><Download className="h-3 w-3" /></Link>
            </div>
          </div>
        </section>

        {/* Similar Projects */}
        <section className="space-y-6 pt-8 border-t border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#007AFF]">Similar Projects</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#09090B] p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Image src="/assets/icons/sdollar.png" width={40} height={40} alt="Logo" className="rounded-full bg-white/5 p-1" />
                  <div>
                    <p className="text-xs text-gray-400">Stallion Foundation</p>
                    <h4 className="font-bold text-white text-base">React Dashboard UI Design</h4>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2">
                  The high-performance blockchain for mass adoption. Building the fastest layer-1 network...
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">$3,500</span>
                    <Badge className="bg-[#007AFF] text-white text-[10px] px-1 h-5 rounded-sm">USDC</Badge>
                  </div>
                  <Button size="icon" className="h-8 w-8 rounded-full bg-[#007AFF] text-white">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Right Sidebar Column */}
      <div className="hidden lg:block space-y-8">
        <BountyDetailsSidebar />
      </div>

      {/* Mobile Footer/Drawer replacement could go here specifically for this page if needed, 
          or we rely on the main layout's responsive handling. 
          For now, sidebar info might drop to bottom on mobile or be distinct.
      */}
      <div className="lg:hidden block mt-8">
        <BountyDetailsSidebar />
      </div>
    </div>
  );
}
