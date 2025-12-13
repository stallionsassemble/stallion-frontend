"use client";

import { SubmitBountyModal } from "@/components/bounties/submit-bounty-modal";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, ShieldCheck, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function BountyDetailsSidebar() {
  return (
    <div className="space-y-6 w-full">
      {/* Prize Card */}
      <div className="rounded-xl border border-white/10 bg-[#09090B] overflow-hidden">
        <div className="p-6 text-center border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Prizes</p>
          <h2 className="text-4xl font-bold text-white">$10,000</h2>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🥇</span>
              <span className="text-sm font-medium text-gray-300">Winner</span>
            </div>
            <span className="font-bold text-white">$5,000</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🥈</span>
              <span className="text-sm font-medium text-gray-300">1st Runner up</span>
            </div>
            <span className="font-bold text-white">$3,000</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🥉</span>
              <span className="text-sm font-medium text-gray-300">Second Runner up</span>
            </div>
            <span className="font-bold text-white">$1,000</span>
          </div>
        </div>

        <div className="p-4 pt-0">
          <SubmitBountyModal>
            <Button className="w-full bg-[#007AFF] hover:bg-[#0066CC] font-bold h-11">
              Apply for Project
            </Button>
          </SubmitBountyModal>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-orange-400 bg-orange-500/10 py-2 rounded-lg border border-orange-500/20">
            <Clock className="h-3.5 w-3.5" />
            <span>Applications close in 5d:16h:32m</span>
          </div>
        </div>
      </div>

      {/* About Organization */}
      <div className="rounded-xl border border-white/10 bg-[#09090B] p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-white/5 p-1.5 shrink-0 overflow-hidden">
            <Image src="/assets/icons/sdollar.png" width={40} height={40} alt="Stallion" className="object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-white">Stallion Foundation</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-[#007AFF]" />
              <span>Verified Organization</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Stallion Foundation is dedicated to building the fastest layer-1 network for mass adoption. We support developers building on the Stallion ecosystem.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Bounties Posted</span>
            <span className="text-white font-medium">15</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Total Paid</span>
            <span className="text-white font-medium">$45,000</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Member Since</span>
            <span className="text-white font-medium">2023</span>
          </div>
        </div>

        <Link href="#" className="flex items-center gap-1 text-xs text-[#007AFF] hover:underline pt-2">
          View Profile <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Footer Info */}
      <div className="text-[10px] text-gray-600 px-2">
        <p className="font-bold text-gray-500 uppercase mb-1">Winner Announcement By</p>
        <p>December 20, 2025 - as scheduled by the project owner</p>
      </div>
    </div>
  );
}
