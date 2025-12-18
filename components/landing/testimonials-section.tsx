"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Star } from "lucide-react";
import { useRef } from "react";

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      id: 1,
      category: "FinTech",
      rating: 5,
      text: "The 3D configurator has received positive feedback from customers. Moreover, it has generated 30% more business and increased leads significantly, giving the client confidence for the future.",
      avatar: "https://placehold.co/43x43",
      name: "Victor",
      role: "Product Designer",
    },
    {
      id: 2,
      category: "FinTech",
      rating: 5,
      text: "Overall, Applab has led the project seamlessly. Customers can expect a responsible, well-organized partner. The team is very professional and easy to work with.",
      avatar: "https://placehold.co/43x43",
      name: "Sarah",
      role: "CTO @ DefiProtocol",
    },
    {
      id: 3,
      category: "DeFi",
      rating: 5,
      text: "Stallion provided us with the best talent in the market. We were able to scale our team in days, not months. The quality of work is outstanding.",
      avatar: "https://placehold.co/43x43",
      name: "David",
      role: "Founder",
    },
    {
      id: 4,
      category: "Web3",
      rating: 5,
      text: "The vetting process is real. Every developer we hired was a senior-level expert who hit the ground running. Highly recommended for any Web3 project.",
      avatar: "https://placehold.co/43x43",
      name: "Elena",
      role: "Product Lead",
    },
  ];

  // Duplicate data to create a seamless loop
  const marqueeData = [...testimonials, ...testimonials, ...testimonials];

  useGSAP(() => {
    const col1 = col1Ref.current;
    const col2 = col2Ref.current;
    if (!col1 || !col2) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Column 1: Scroll UP
      const tl1 = gsap.to(col1, {
        yPercent: -50, // Move up by half the duplicate height
        ease: "none",
        duration: 30,
        repeat: -1,
      });

      // Column 2: Scroll DOWN
      gsap.set(col2, { yPercent: -50 });
      const tl2 = gsap.to(col2, {
        yPercent: 0,
        ease: "none",
        duration: 35,
        repeat: -1,
      });

      // Pause/Play handlers only needed when animating
      const pause = () => { tl1.pause(); tl2.pause(); };
      const play = () => { tl1.play(); tl2.play(); };

      containerRef.current?.addEventListener("mouseenter", pause);
      containerRef.current?.addEventListener("mouseleave", play);

      return () => {
        containerRef.current?.removeEventListener("mouseenter", pause);
        containerRef.current?.removeEventListener("mouseleave", play);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Static positioning for accessibility
      gsap.set(col1, { yPercent: 0 }); // Show from top
      gsap.set(col2, { yPercent: 0 });
    });

  }, { scope: containerRef });

  return (
    <section className="container mx-auto py-20 text-center overflow-hidden" ref={containerRef}>
      <div className="mb-12">
        <h2 className="text-[45px] md:text-[64px] font-bold font-syne text-foreground mb-2">Trusted by the Visionaries.</h2>
        <p className="text-muted-foreground max-w-2xl font-inter font-normal text-[12px] md:text-[16px] text-center mx-auto tracking-[-0.32px] leading-[19.2px]">
          Stallion is the operating system of choice for high-signal builders. See why the top 1% of contributors have made the switch.
        </p>
      </div>

      {/* Marquee Container with Gradient Masks */}
      <div className="relative h-[500px] w-full max-w-6xl mx-auto overflow-hidden">

        {/* Top Gradient Mask */}
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
        {/* Bottom Gradient Mask */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 justify-center h-full items-start">
          {/* Column 1: Scrolls UP */}
          <div ref={col1Ref} className="flex flex-col gap-6 w-full md:w-1/2 h-fit">
            {marqueeData.map((testimonial, index) => (
              <TestimonialCard key={`col1-${index}`} testimonial={testimonial} />
            ))}
          </div>

          {/* Column 2: Scrolls DOWN */}
          <div ref={col2Ref} className="hidden md:flex flex-col gap-6 w-1/2 h-fit">
            {marqueeData.map((testimonial, index) => (
              <TestimonialCard key={`col2-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div
      className="bg-transparent rounded-[32px] p-8 min-h-[300px] flex flex-col justify-between relative transition-all duration-300 hover:border-primary hover:bg-accent group border border-border shrink-0 h-fit"
    >
      <div>
        <div className="bg-primary text-primary-foreground font-manrope text-[15px] font-normal tracking-[-0.32px] leading-[19.2px] px-4 py-1.5 rounded-full w-fit mb-4">
          {testimonial.category}
        </div>
        <div className="flex gap-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          ))}
        </div>
        <p className="text-muted-foreground font-manrope text-lg leading-relaxed text-left group-hover:text-foreground transition-colors">
          {testimonial.text}
        </p>
      </div>

      <div className="flex flex-row items-center mt-8 gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
          <img src={testimonial.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-start text-left">
          <h2 className="text-foreground font-manrope text-[15px] font-normal tracking-[-0.32px] leading-[19.2px]">
            {testimonial.name}
          </h2>
          <p className="text-muted-foreground/60 font-manrope text-[13px] font-normal tracking-[-0.32px] leading-[19.2px]">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}
