"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

function HorizontalMarquee({
  children,
  direction = "left",
  speed = 20,
  className
}: {
  children: React.ReactNode,
  direction?: "left" | "right",
  speed?: number,
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const list = listRef.current;
    if (!list) return;

    const mm = gsap.matchMedia();

    // Calculate initial xPercent based on direction
    // If direction is left: animate 0 -> -50
    // If direction is right: animate -50 -> 0 (so it looks like moving right continuously)
    const fromX = direction === "left" ? 0 : -50;
    const toX = direction === "left" ? -50 : 0;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(list, { xPercent: fromX });

      const tl = gsap.to(list, {
        xPercent: toX,
        ease: "none",
        duration: speed,
        repeat: -1,
      });

      const pause = () => tl.pause();
      const play = () => tl.play();

      containerRef.current?.addEventListener("mouseenter", pause);
      containerRef.current?.addEventListener("mouseleave", play);

      return () => {
        containerRef.current?.removeEventListener("mouseenter", pause);
        containerRef.current?.removeEventListener("mouseleave", play);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(list, { xPercent: 0 });
    });

  }, { scope: containerRef, dependencies: [direction, speed] });

  return (
    <div className={`relative w-full overflow-hidden ${className}`} ref={containerRef}>
      {/* Left Gradient Mask */}
      <div className="absolute top-0 left-0 h-full w-24 bg-linear-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
      {/* Right Gradient Mask */}
      <div className="absolute top-0 right-0 h-full w-24 bg-linear-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

      <div ref={listRef} className="flex gap-[29px] w-max will-change-transform px-4">
        {children}
      </div>
    </div>
  );
}

export function RecentWins() {
  const [mobileIndex, setMobileIndex] = useState(0);

  const wins = [
    {
      id: 1,
      title: "V4 Hook Integration",
      amount: "$2,500 USDC",
      winner: "Tom",
      company: "TraceMachina",
    },
    {
      id: 2,
      title: "Explainer Motion Graphic",
      amount: "$4,500 USDC",
      winner: "Aman",
      company: "TraceMachina",
    },
    {
      id: 3,
      title: "Technical Blog: L2 Scaling",
      amount: "$4,500 USDC",
      winner: "David",
      company: "Activepieces (YC S22)",
    },
    {
      id: 4,
      title: "Smart Contract Audit Fix",
      amount: "1.5 ETH",
      winner: "Maxim",
      company: "Golem Cloud",
    },
    {
      id: 5,
      title: "Technical Blog: L2 Scaling",
      amount: "$400 USDC",
      winner: "Gergő",
      company: "Firecrawl (YC S22)",
    },
    {
      id: 6,
      title: "Bug Bounty: Bridge UI",
      amount: "$800 USDC",
      winner: "Sandipsinh",
      company: "Forge Code",
    },
    // Adding more valid dummy data to make the scrolling list longer since we are splitting it
    {
      id: 7,
      title: "Solana Indexer",
      amount: "$1,200 USDC",
      winner: "Sarah",
      company: "Solana Fdn",
    },
    {
      id: 8,
      title: "Rust Smart Contract",
      amount: "$3,000 USDC",
      winner: "Alex",
      company: "Near Protocol",
    },
    {
      id: 9,
      title: "DeFi Dashboard",
      amount: "$1,800 USDC",
      winner: "Maria",
      company: "Uniswap",
    },
    {
      id: 10,
      title: "NFT Marketplace",
      amount: "$2,200 USDC",
      winner: "John",
      company: "OpenSea",
    },
  ];

  // Highlights: First 3
  const highlightedWins = wins.slice(0, 3);
  // Scrolling: Rest
  const scrollingWinsBase = wins.slice(3);

  // Duplicate scrolling data for seamless loop
  const marqueeData = [...scrollingWinsBase, ...scrollingWinsBase, ...scrollingWinsBase];

  // Row Data for Marquees (Identical for now, could be offset)
  const row1Marquee = marqueeData;
  const row2Marquee = marqueeData;
  const row3Marquee = marqueeData;

  // Chunk for mobile (using all wins)
  const chunkSize = 3;
  const chunks = [];
  for (let i = 0; i < wins.length; i += chunkSize) {
    chunks.push(wins.slice(i, i + chunkSize));
  }

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % chunks.length);
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev - 1 + chunks.length) % chunks.length);
  };

  const renderCard = (win: typeof wins[0], index: number, forceHighlight: boolean = false) => {
    // Determine highlighting:
    // If it's in the static section (forceHighlight=true), it's highlighted.
    // If it's in the marquee, it is standard (not highlighted).
    const isHighlighted = forceHighlight;

    const badgeBgClass = isHighlighted ? "bg-blue" : "bg-[#06022C]";
    const winnerClass = isHighlighted ? 'text-[#D2D1FA]' : 'text-[#FAFAFA]'

    const cardStyle = isHighlighted
      ? {
        border: "1.79px solid #3434D34D",
        boxShadow: "0px 7.17px 8.97px -5.38px #007AFF38, 0px 17.93px 22.41px -4.48px #007AFF1A",
        background: "linear-gradient(135deg, rgba(0, 122, 255, 0.28) 0%, rgba(20, 90, 166, 0.35) 100%)",
      }
      : {
        background: "#09090B",
        // border removed from inline to allow hover override via class
      };

    return (
      <div
        key={`${win.id}-${index}`}
        className={`relative rounded-xl p-3 w-[80vw] max-w-[301.98px] h-[83.27px] md:w-[325px] md:h-[90px] flex flex-col justify-center overflow-visible shrink-0 transition-all duration-300 ${!isHighlighted ? 'border-[0.9px] border-[#292537] hover:border-[#007AFF]' : ''}`}
        style={cardStyle}
      >
        {/* Price Badge */}
        <div className={`flex absolute -top-3 -left-3 px-3 py-1 rounded-t-md rounded-br-md ${badgeBgClass} text-white text-[10px] font-normal font-inter leading-3.5`}>
          {isHighlighted && (
            <Image src={'/assets/icons/sdollar.png'} width={8.37} height={11.67} alt="Dollar" />
          )}
          {isHighlighted ? (
            win.amount.slice(1)
          ) : (
            win.amount
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          {/* Winner Avatar */}
          <div className="w-[43.04px] h-[43.04px] rounded-full" style={{ boxShadow: '0px 0px 0px 1.79px #34D39980' }}>
            <img className="w-[43.04px] h-[43.04px] object-cover rounded-full" alt="" src={'https://placehold.co/43x43'} />
          </div>

          {/* Arrow */}
          <ArrowRight className="w-3 h-3 text-white" />

          {/* Company Avatar */}
          <div className="w-[43.04px] h-[43.04px] rounded-full" style={{ boxShadow: '0px 0px 0px 1.79px #34D39980' }} >
            <img className="w-[43.04px] h-[43.04px] object-cover rounded-full" alt="" src={'https://placehold.co/43x43'} />
          </div>

          <div className="flex flex-col ml-1">
            <div className={`${winnerClass} font-normal text-[12px] leading-[17.5px] font-inter`}>
              {win.winner} <span>→</span> {win.company}
            </div>
            <div className="text-[#D0D0FFCC] text-[10px] font-inter mt-0.5 leading-[15px]">
              {win.title}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 text-center overflow-hidden">

      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-10 w-full px-4">

        {/* Row 1: Static #1 + Scroll Left */}
        <div className="flex items-center gap-[29px] w-full">
          <div className="shrink-0 z-20">
            {renderCard(highlightedWins[0], 0, true)}
          </div>
          <HorizontalMarquee direction="left" speed={40} className="flex-1 mask-gradient">
            {row1Marquee.map((win, index) => renderCard(win, index, false))}
          </HorizontalMarquee>
        </div>

        {/* Row 2: Static #2 + Scroll Right */}
        <div className="flex items-center gap-[29px] w-full">
          <div className="shrink-0 z-20">
            {renderCard(highlightedWins[1], 1, true)}
          </div>
          <HorizontalMarquee direction="right" speed={45} className="flex-1 mask-gradient">
            {row2Marquee.map((win, index) => renderCard(win, index + 100, false))}
          </HorizontalMarquee>
        </div>

        {/* Row 3: Static #3 + Scroll Left */}
        <div className="flex items-center gap-[29px] w-full">
          <div className="shrink-0 z-20">
            {renderCard(highlightedWins[2], 2, true)}
          </div>
          <HorizontalMarquee direction="left" speed={35} className="flex-1 mask-gradient">
            {row3Marquee.map((win, index) => renderCard(win, index + 200, false))}
          </HorizontalMarquee>
        </div>
      </div>

      {/* Mobile View: Carousel (Unchanged) */}
      <div className="md:hidden flex flex-col items-center w-full container mx-auto">
        <div className="flex flex-row items-center justify-center gap-3 w-full mb-8">
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] bg-transparent p-0 shrink-0 transition-colors ${mobileIndex === 0
              ? "border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed"
              : "border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
              }`}
          >
            <ChevronLeft className="w-2 h-2" strokeWidth={2.5} />
          </button>

          <div className="flex flex-col gap-4">
            {chunks[mobileIndex].map((win) => {
              // Calculate original index to maintain styling logic
              const originalIndex = wins.findIndex(w => w.id === win.id);
              // Reuse renderCard. For mobile we preserve the visual "top 3 highlighted" logic from the original list.
              return renderCard(win, originalIndex, originalIndex < 3);
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] bg-transparent p-0 shrink-0 transition-colors ${mobileIndex === chunks.length - 1
              ? "border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed"
              : "border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
              }`}
          >
            <ChevronRight className="w-2 h-2" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {chunks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMobileIndex(idx)}
              className={`w-1 h-1 rounded-full transition-colors ${idx === mobileIndex ? "bg-[#007AFF]" : "bg-white/20"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
