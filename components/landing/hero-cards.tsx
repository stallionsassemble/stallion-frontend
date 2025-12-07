"use client";

import Image from 'next/image';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  const getCardStyle = (index: number) => {
    // Rotation: Straighten all cards on hover
    const rotate = isHovered ? "0deg" : cards[index].initialRotate;

    // Spacing: Spread all cards out from the center on hover
    // Index 2 is center. 
    // We add extra spacing based on distance from center.
    const spreadFactor = 130;
    const translateX = isHovered ? (index - 2) * spreadFactor : 0;

    // Scale: Keep uniform
    const scale = 1;

    // Z-Index: Keep original layering (center on top)
    const zIndex = cards[index].zIndex;

    return {
      left: "50%",
      marginLeft: cards[index].marginLeft,
      top: cards[index].initialTop,
      transform: `rotate(${rotate}) translateX(${translateX}px) scale(${scale})`,
      zIndex: zIndex,
    };
  };

  return (
    <div
      className="relative w-[1400px] h-[600px] mx-auto hidden md:block origin-center scale-[0.6] lg:scale-[0.8] xl:scale-100 overflow-visible transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute w-[276px] h-[357px] rounded-[30px] overflow-hidden transition-all duration-500 ease-out"
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
