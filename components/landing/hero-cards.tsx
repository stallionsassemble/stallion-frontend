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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCardStyle = (index: number) => {
    const isHovered = hoveredIndex === index;
    const isLeft = hoveredIndex !== null && index < hoveredIndex;
    const isRight = hoveredIndex !== null && index > hoveredIndex;

    // Base rotation
    const rotate = isHovered ? "0deg" : cards[index].initialRotate;

    // Spacing shift
    let translateX = 0;
    if (isLeft) translateX = -180;
    if (isRight) translateX = 180;

    // Scale
    const scale = isHovered ? 1.1 : 1;

    // Z-Index: Hovered card always on top
    const zIndex = isHovered ? 100 : cards[index].zIndex;

    return {
      left: "50%",
      marginLeft: cards[index].marginLeft,
      top: cards[index].initialTop,
      transform: `rotate(${rotate}) translateX(${translateX}px) scale(${scale})`,
      zIndex: zIndex,
    };
  };

  return (
    <div className="relative w-[1400px] h-[600px] mx-auto hidden md:block origin-center scale-[0.6] lg:scale-[0.8] xl:scale-100 overflow-visible transition-transform duration-300">
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute w-[276px] h-[357px] rounded-[30px] overflow-hidden transition-all duration-300"
          style={{
            ...getCardStyle(index),
            cursor: 'pointer'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
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
