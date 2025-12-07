"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  ];

  // Chunk wins into groups of 3 for mobile
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

  const renderCard = (win: typeof wins[0], index: number) => {
    const isHighlighted = index < 3;
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
        key={win.id}
        className={`relative rounded-xl p-3 w-[301.98px] h-[83.27px] md:w-[325px] md:h-[90px] flex flex-col justify-center overflow-visible shrink-0 transition-all duration-300 ${!isHighlighted ? 'border-[0.9px] border-[#292537] hover:border-[#007AFF]' : ''}`}
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
    <section className="container mx-auto py-20 text-center">

      {/* Desktop View */}
      <div className="hidden md:flex flex-wrap justify-center gap-x-[29px] gap-y-[40px]">
        {wins.map((win, index) => renderCard(win, index))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-center w-full">
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
              return renderCard(win, originalIndex);
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
