"use client";

import { SubmitBountyModal } from "@/components/bounties/submit-bounty-modal";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeDollarSign, Calendar, Gift, InfoIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BountyDetailsSidebarProps {
  type?: "BOUNTY" | "PROJECT";
}

export function BountyDetailsSidebar({ type = "BOUNTY" }: BountyDetailsSidebarProps) {
  const isProject = type === "PROJECT";

  return (
    <div className="space-y-6 w-full">
      {/* Prize/Budget Card */}
      <div className="rounded-xl border-[0.69px] border-primary bg-[#09090B] overflow-hidden font-inter">
        <div className="p-6 text-center border-b border-[1.16px] border-[#007AFF5C] bg-[#007AFF14]">
          <div className="flex justify-center mb-2">
            <BadgeDollarSign className="h-5 w-5" color="white" />
          </div>
          <p className="text-sm text-gray-400 mb-1">{isProject ? "Project Budget" : "Total Prizes"}</p>
          <h2 className="text-4xl font-bold text-white">$10,000</h2>
        </div>

        <div className="p-4 space-y-3">
          {isProject ? (
            // Project specific content or simply nothing if just budget
            // Maybe a simplified text or just skip the breakdown
            <div className="p-2 text-center text-sm text-gray-400">
              Fixed price project
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0C62C024]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥇</span>
                  <span className="text-sm font-medium text-gray-300">Winner</span>
                </div>
                <span className="font-bold text-white">$5,000</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0C62C024]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥈</span>
                  <span className="text-sm font-medium text-gray-300">1st Runner up</span>
                </div>
                <span className="font-bold text-white">$3,000</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0C62C024]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🥉</span>
                  <span className="text-sm font-medium text-gray-300">Second Runner up</span>
                </div>
                <span className="font-bold text-white">$1,000</span>
              </div>
            </>
          )}
        </div>

        <div className="p-4 pt-0">
          <SubmitBountyModal type={type}>
            <Button className="w-full bg-primary hover:bg-[#007AFF/95] text-white font-bold h-11">
              {isProject ? "Apply for Project" : "Submit Bounty"}
            </Button>
          </SubmitBountyModal>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/70 py-4 rounded-lg border-[1.16px] border-[#75A3FFB2]">
            <InfoIcon className="h-5 w-5" color="white" />
            <span>Applications close in 5d:16h:32m</span>
          </div>
        </div>
      </div>

      {/* About Organization */}
      <div className="w-full rounded-[13.97px] border-[1.16px] border-primary bg-[#020617] p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-[53px] w-[53px] rounded-full bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
            <Image src="/assets/icons/sdollar.png" width={53} height={53} alt="Stallion" className="object-contain" />
          </div>
          <div className="space-y-1 font-inter">
            <h3 className="text-[16px] font-medium text-white">Stallion Foundation</h3>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-[14px] text-white font-medium">4.8</span>
            </div>
          </div>
        </div>

        <p className="font-light text-[11px] text-gray-400 leading-relaxed">
          A leading project in the Web3 ecosystem focused on building innovative solutions for creators. A leading project in the Web3 ecosystem focused on building innovative solutions for creators.
        </p>

        <div className="space-y-3 font-inter">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-normal text-[12px] tracking-[-2%]">Total Bounties</span>
              <span className="font-extralight text-[12px] tracking-[-2%] text-center">:</span>
              <span className="text-white font-bold text-[12px] tracking-[-2%]">15</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-normal text-[12px] tracking-[-2%]">Total Paid</span>
              <span className="text-white font-bold text-[12px] tracking-[-2%]">$45,000</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-normal text-[12px] tracking-[-2%]">Member Since:</span>
              <span className="text-white font-bold text-[12px] tracking-[-2%]">2005</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <Link href="#" className="flex items-center gap-2 text-primary text-[12px] font-semibold transition-all">
            View Profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="font-medium font-inter px-2">
        <p className="text-[16px] text-white uppercase mb-1">{isProject ? "Project Owner" : "Winner Announcement By"}</p>
        <p className="text-[14px] text-white">December 20, 2025 - as scheduled by the project owner</p>
      </div>
    </div>
  );
}
