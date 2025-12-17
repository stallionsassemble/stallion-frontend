"use client";

import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Crown } from "lucide-react";
import Image from "next/image";

// Vertical Marquee Component (CSS Animation)
function VerticalMarquee({
  children,
  height = "h-[200px]",
  duration = "30s",
  reverse = false,
}: {
  children: React.ReactNode;
  height?: string;
  duration?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${height}`}>
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-[#04020E] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#04020E] to-transparent z-10 pointer-events-none" />

      <div
        className="flex flex-col gap-3 w-full hover:paused"
        style={{
          animation: `verticalMarquee ${duration} linear infinite ${reverse ? 'reverse' : 'normal'}`
        }}
      >
        {children}
        {children} {/* Duplicate content for seamless loop */}
      </div>
      <style jsx>{`
        @keyframes verticalMarquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}


const topEarners = [
  { name: "Emmanuel Malik", role: "FC2 Front-end Engineer", amount: "$200,800", avatar: "https://avatar.vercel.sh/emmanuel" },
  { name: "Sarah Jenkins", role: "UI Designer", amount: "$180,500", avatar: "https://avatar.vercel.sh/sarah" },
  { name: "David Chen", role: "Smart Contract Dev", amount: "$150,000", avatar: "https://avatar.vercel.sh/david" },
  { name: "Maria Garcia", role: "Product Manager", amount: "$120,800", avatar: "https://avatar.vercel.sh/maria" },
  { name: "James Smith", role: "Backend Engineer", amount: "$110,000", avatar: "https://avatar.vercel.sh/james" },
  { name: "Linda Kim", role: "Full Stack Dev", amount: "$95,000", avatar: "https://avatar.vercel.sh/linda" },
];

const recentEarners = [
  { name: "Emmanuel Malik", role: "award paid from...", amount: "$2,800", bg: "bg-purple-500/10", text: "text-purple-400" },
  { name: "John Doe", role: "award paid from...", amount: "$3,800", bg: "bg-blue-500/10", text: "text-blue-400" },
  { name: "Alice Wonderland", role: "award paid from...", amount: "$1,200", bg: "bg-purple-500/10", text: "text-purple-400" },
  { name: "Bob Builder", role: "award paid from...", amount: "$500", bg: "bg-green-500/10", text: "text-green-400" },
  { name: "Charlie Brown", role: "award paid from...", amount: "$4,100", bg: "bg-blue-500/10", text: "text-blue-400" },
  { name: "Diana Prince", role: "award paid from...", amount: "$900", bg: "bg-orange-500/10", text: "text-orange-400" },
]

export function DashboardRightSidebar() {
  return (
    <div className="space-y-8 w-full">
      {/* Top Earners */}
      <div className="flex flex-col justify-center items-start gap-[10px] relative h-[250px]">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-medium flex items-center gap-1 text-white uppercase tracking-wider">
            <Crown className="h-4 w-4" color="white" />
            Top Earners
          </h3>
          <button className="text-[10px] text-primary hover:underline">Leaderboard &gt;</button>
        </div>

        {/* Vertical Marquee Top Earners */}
        <VerticalMarquee height="h-full" duration="40s">
          {topEarners.map((earner, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-1 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                  <Image src={earner.avatar} width={32} height={32} alt={earner.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{earner.name}</p>
                  <p className="text-[10px] text-gray-500">{earner.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-xs font-extrabold text-white">{earner.amount}</p>
                  <div className="w-[36px] h-[26px] rounded-full bg-primary flex items-center justify-center text-[10px] font-medium font-inter">USDC</div>
                </div>
                <p className="text-[10px] text-gray-500 text-right">#{i + 1}</p>
              </div>
            </div>
          ))}
        </VerticalMarquee>
      </div>

      {/* Total Balance Card */}
      {/* Total Balance Card */}
      <div className="rounded-[20px] border border-[#1E293B] bg-[#020617] p-5 shadow-2xl relative overflow-hidden group">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>

        {/* Total Balance Header Card */}
        <div
          className="flex flex-col items-center justify-center mb-6 relative z-10"
          style={{
            width: "calc(100% + 42px)", // 20px padding * 2 + 2px borders
            marginLeft: "-21px", // Pull left
            marginTop: "-21px", // Pull top
            marginRight: "-21px", // Pull right
            height: "155px",
            background: "#007AFF14",
            borderBottom: "1.16px solid #007AFF5C",
            borderRadius: "20px 20px 0 0", // Matching parent top corners for seamless fit
            paddingTop: "13.53px",
            paddingBottom: "13.53px",
            paddingLeft: "20px",
            paddingRight: "20px",
            gap: "10px",
          }}
        >
          {/* Header Icon */}
          <div className="mb-1 text-gray-400">
            <BadgeDollarSign className="w-5 h-5 mx-auto mb-1" color="white" strokeWidth={1.5} />
            <span className="text-[16px] font-inter font-medium text-white">Total Balance</span>
          </div>
          <h2 className="text-[32px] font-inter font-bold md:text-[40px] leading-tight text-white tracking-tight text-center">$5,590.90</h2>
        </div>

        <div className="space-y-3 mb-6">
          {/* USGLO */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C62C024] border border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#007AFF]/20 flex items-center justify-center shrink-0 border border-[#007AFF]/30">
                <span className="text-[10px] font-bold text-[#007AFF]">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">USGLO</span>
                <span className="text-[10px] font-inter text-[#737373]">500 USGLO</span>
              </div>
            </div>
            <span className="text-[20px] font-space-grotesk leading-[23px] font-bold text-white">$5,590.90</span>
          </div>

          {/* USDC */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C62C024] border border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#14F195]/20 flex items-center justify-center shrink-0 border border-[#14F195]/30">
                <div className="w-4 h-4 rounded-full border border-[#14F195] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#14F195]">$</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">USDC</span>
                <span className="text-[10px] font-inter text-[#737373]">3,240.5 USDC</span>
              </div>
            </div>
            <span className="text-[20px] font-space-grotesk leading-[23px] font-bold text-white">$5,590.90</span>
          </div>

          {/* XLM */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C62C024] border border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <span className="text-[10px] font-bold text-white">X</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">XLM</span>
                <span className="text-[10px] font-inter text-[#737373]">15,420 XLM</span>
              </div>
            </div>
            <span className="text-[20px] font-space-grotesk leading-[23px] font-bold text-white">$5,590.90</span>
          </div>
        </div>

        <Button className="w-full bg-[#0052CC] hover:bg-[#0042a3] text-white h-[46px] rounded-xl font-medium font-inter text-[16px] leading-[23px] transition-all shadow-[0_0_15px_rgba(0,82,204,0.3)]">
          Withdraw
        </Button>
      </div>

      {/* Recent Earners */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white flex items-center gap-1 uppercase tracking-wider">
            <BadgeDollarSign className="w-4 h-4" />
            Recent Earners</h3>
          <button className="text-[10px] text-primary hover:underline">Leaderboard &gt;</button>
        </div>

        {/* Vertical Marquee Recent Earners */}
        <VerticalMarquee height="h-[200px]" duration="25s" reverse={true}>
          {topEarners.map((earner, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-1 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                  <Image src={earner.avatar} width={32} height={32} alt={earner.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#B5B5B5]">{earner.name}</p>
                  <p className="text-[10px] text-[#B5B5B5]">{earner.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-xs font-extrabold text-white">{earner.amount}</p>
                  <div className="w-[36px] h-[26px] rounded-full bg-primary flex items-center justify-center text-[10px] font-medium font-inter">USDC</div>
                </div>
              </div>
            </div>
          ))}
        </VerticalMarquee>
      </div>
    </div>
  );
}
