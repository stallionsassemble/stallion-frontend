"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, UserStar } from "lucide-react";
import Image from "next/image";

export function ProfileHeader() {
  return (
    <div className="relative w-full mb-8">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden relative bg-[#0066FF]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)",
            backgroundSize: "24px 24px"
          }}
        />
        {/* Blue gradient overlay if needed, or stick to solid color pattern */}
      </div>

      {/* Profile Info Section */}
      <div className="px-6 relative">
        <div className="flex flex-col md:flex-row items-start -mt-16 md:-mt-[100px] mb-4 gap-6">
          {/* Avatar */}
          <div className="relative h-32 w-32 md:h-[200px] md:w-[200px] rounded-full bg-background shrink-0 border-[4px] border-background">
            <Image
              src="https://avatar.vercel.sh/tunde"
              alt="Tunde Ojo"
              fill
              className="rounded-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 pt-2 md:pt-[110px] mb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-foreground">Tunde Ojo</h1>
                  <Badge className="bg-[#FFE500] text-black hover:bg-[#FFE500]/90 border-none px-2 py-0.5 h-6 text-xs gap-1 font-inter font-medium rounded-full">
                    <UserStar className="w-3 h-3 fill-current" />
                    Verified Builder
                  </Badge>
                </div>
                <p className="text-muted-foreground font-inter mb-4">@johndoe</p>
                <p className="text-sm text-foreground/80 max-w-2xl font-inter leading-relaxed">
                  Full-stack Web3 developer specializing in smart contracts and DeFi protocols. 3+ years of experience building secure and scalable blockchain applications.
                </p>
              </div>

              {/* Edit Profile Button (Desktop) */}
              <div className="flex md:flex-col md:items-end justify-start md:justify-start mt-4 md:mt-0">
                <Button variant="outline" className="hidden md:flex gap-2 border-white/20 hover:bg-white/10 text-white hover:text-white bg-transparent h-9 px-4 text-xs font-medium transition-colors">
                  <Edit className="w-3 h-3" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row - Underneath Info */}
        <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 md:gap-20 mt-4 md:pl-[224px]">
          {/* Bounties */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] md:text-[24px] font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">24</span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Bounties</span>
          </div>

          {/* Earned */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] md:text-[24px] font-bold font-inter text-[#0066FF] leading-none tracking-[-0.57px] text-center">$45,800</span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Earned</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] md:text-[24px] font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">4.9</span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Rating</span>
          </div>

          {/* Member Since */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] md:text-[24px] font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">March 2023</span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Member Since</span>
          </div>
        </div>
      </div>
    </div>
  );
}
