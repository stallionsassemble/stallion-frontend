"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from 'next/image';
import { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    src: "/assets/hero-stat-value.png",
    alt: "Value Distributed",
    marginLeft: "-498px", // Center - 360 - 138
    initialTop: "60px",
    initialRotate: "9.65deg",
    zIndex: 10,
  },
  {
    src: "/assets/hero-person-1.jpg",
    alt: "Contributor",
    marginLeft: "-318px", // Center - 180 - 138
    initialTop: "30px",
    initialRotate: "0.43deg",
    zIndex: 20,
  },
  {
    src: "/assets/hero-stat-settlement.png",
    alt: "Settlement Time",
    marginLeft: "-138px", // Center - 138
    initialTop: "0px",
    initialRotate: "-3.65deg",
    zIndex: 30,
  },
  {
    src: "/assets/hero-person-2.png",
    alt: "Contributor",
    marginLeft: "42px", // Center + 180 - 138
    initialTop: "30px",
    initialRotate: "-8.72deg",
    zIndex: 20,
  },
  {
    src: "/assets/hero-stat-countries.png",
    alt: "Countries",
    marginLeft: "222px", // Center + 360 - 138
    initialTop: "60px",
    initialRotate: "-7.19deg",
    zIndex: 10,
  }
];

const HeroCards = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = containerRef.current;
    if (!element) return;

    ScrollTrigger.create({
      trigger: document.body, // Use body to detect global scroll from top
      start: "top top-=50",   // Trigger after scrolling down 50px
      onEnter: () => setIsExpanded(true),
      onLeaveBack: () => setIsExpanded(false), // Re-stack when scrolling back to very top
      // We don't use 'once: true' so it toggles
    });
  }, { scope: containerRef });

  const getCardStyle = (index: number) => {
    if (!isExpanded) {
      // Stacked State (Now the "Initial Fan" state as requested)
      // This matches the "Expanded" state from before (Manual offsets + rotations)
      return {
        left: "50%",
        marginLeft: cards[index].marginLeft,
        top: cards[index].initialTop,
        transform: `rotate(${cards[index].initialRotate}) translateX(0px) scale(0.95)`,
        zIndex: cards[index].zIndex,
      };
    }

    // Expanded State (Spaced out further)
    // We add extra spacing to the existing manual margins
    const extraSpread = 120; // Increased to 120px for wider spread
    const spreadOffset = (index - 2) * extraSpread;

    return {
      left: "50%",
      marginLeft: cards[index].marginLeft,
      top: cards[index].initialTop,
      transform: `rotate(0deg) translateX(${spreadOffset}px) scale(1)`,
      zIndex: cards[index].zIndex,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[1400px] h-[600px] mx-auto hidden md:block origin-center scale-[0.6] lg:scale-[0.8] xl:scale-100 overflow-visible"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute w-[276px] h-[357px] rounded-[30px] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            ...getCardStyle(index),
            cursor: 'pointer'
          }}
        >
          <Image
            src={card.src}
            alt={card.alt}
            fill
            className="object-contain pointer-events-none"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
};

export default HeroCards;
