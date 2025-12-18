import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface AuthRightSectionProps {
  variant: "testimonial" | "bounties" | "companies";
}

const BOUNTIES_DATA = [
  { id: 1, title: "Implement sentry.io's Qt SDK for crash reporting", amount: "$2,500", company: "Stallion Africa", time: "5 hours ago", awardedTo: "Tunde Ojo", location: "Lagos, Nigeria" },
  { id: 2, title: "Implement sentry.io's Qt SDK for crash reporting", amount: "$2,500", company: "Stallion Africa", time: "5 hours ago", awardedTo: "Tunde Ojo", location: "Lagos, Nigeria" },
  { id: 3, title: "Implement sentry.io's Qt SDK for crash reporting", amount: "$2,500", company: "Stallion Africa", time: "5 hours ago", awardedTo: "Tunde Ojo", location: "Lagos, Nigeria" },
];

const COMPANIES_DATA = [
  { id: 1, name: "Stallion", handle: "@camstallion", description: "A bounty platform for talent and company looking for talent", location: "Lagos, Nigeria", time: "5 hours ago" },
  { id: 2, name: "Stallion", handle: "@camstallion", description: "A bounty platform for talent and company looking for talent", location: "Lagos, Nigeria", time: "5 hours ago" },
  { id: 3, name: "Stallion", handle: "@camstallion", description: "A bounty platform for talent and company looking for talent", location: "Lagos, Nigeria", time: "5 hours ago" },
];

// Helper component for Marquee Animation
function VerticalMarquee({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const list = listRef.current;
    if (!list) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Scroll UP
      const tl = gsap.to(list, {
        yPercent: -50, // Move up by half the content height (since we duplicate data)
        ease: "none",
        duration: 40, // Adjust speed as needed
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
      gsap.set(list, { yPercent: 0 });
    });

  }, { scope: containerRef });

  return (
    <div className="relative h-[800px] overflow-hidden w-full" ref={containerRef}>
      {/* Top Gradient Mask */}
      <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-background to-transparent z-10" />
      {/* Bottom Gradient Mask */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

      <div ref={listRef} className="will-change-transform w-full">
        {children}
      </div>
    </div>
  );
}

export function AuthRightSection({ variant }: AuthRightSectionProps) {
  if (variant === "testimonial") {
    return (
      <div className="relative z-10 max-w-xl space-y-8">
        <div className="relative">
          <Quote
            className="absolute -left-8 -top-10 h-16 w-16 -scale-x-100 fill-transparent text-foreground"
            strokeWidth={0.5}
          />
        </div>
        <blockquote className="space-y-6">
          <p className="font-inter text-2xl font-medium leading-tight text-foreground">
            We were doing bounties on Stallion, and this one developer Nick kept
            solving them. His personality really came through in the GitHub
            issues and code. We ended up hiring him from that.
          </p>
          <footer className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
              <Image
                src="/jane-avatar.png"
                width={48}
                height={48}
                alt="Jane Smith"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="text-base font-medium font-inter text-muted-foreground">Jane Smith</div>
              <div className="text-sm font-inter text-foreground">
                CTO at Tech Innovators Inc.
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    );
  }

  if (variant === "bounties") {
    // Duplicate for loop
    const bountiesMarquee = [...BOUNTIES_DATA, ...BOUNTIES_DATA, ...BOUNTIES_DATA, ...BOUNTIES_DATA];

    return (
      <div className="w-full max-w-xl space-y-6 -mt-12">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            RECENTLY COMPLETED BOUNTIES
          </h2>
        </div>
        <VerticalMarquee>
          <div className="grid gap-4 pb-4">
            {bountiesMarquee.map((bounty, index) => (
              <div
                key={`${bounty.id}-${index}`}
                className="flex items-start justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-foreground">{bounty.amount}</div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-primary">{bounty.company}</div>
                    <div className="max-w-[280px] text-base font-medium text-foreground">{bounty.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{bounty.time}</div>
                </div>

                <div className="flex flex-col items-center gap-2 border-l border-border pl-6 text-center">
                  <span className="text-[10px] text-foreground uppercase tracking-wider">AWARDED TO</span>
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <Image
                      src="/jane-avatar.png" // Placeholder
                      width={48}
                      height={48}
                      alt={bounty.awardedTo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-foreground">{bounty.awardedTo}</div>
                    <div className="text-[10px] text-foreground">{bounty.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </VerticalMarquee>
      </div>
    );
  }

  if (variant === "companies") {
    // Duplicate for loop
    const companiesMarquee = [...COMPANIES_DATA, ...COMPANIES_DATA, ...COMPANIES_DATA, ...COMPANIES_DATA];

    return (
      <div className="w-full max-w-xl space-y-6 -mt-12">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            COMPANY IN STALLION COMMUNITY
          </h2>
        </div>
        <VerticalMarquee>
          <div className="grid gap-4 pb-4">
            {companiesMarquee.map((company, index) => (
              <div
                key={`${company.id}-${index}`}
                className="flex items-start justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-foreground">{company.name}</div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-primary">{company.handle}</div>
                    <div className="max-w-[280px] text-sm text-foreground">{company.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{company.time}</div>
                </div>

                <div className="flex flex-col items-center gap-4 border-l border-border pl-6 text-center min-w-[100px]">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Human Resource</span>
                  {/* Stallion Logo or Company Logo */}
                  <div className="text-foreground">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="currentColor" fillOpacity="0.0" />
                      {/* Simple 'S' shape placeholder if actual path unavailable, but trying to mimic the logo roughly or use Image */}
                      <path d="M11 25C11 22 13 20 15 20H25C27 20 29 18 29 16C29 14 27 12 25 12H15V8H25C30 8 33 11 33 16C33 21 30 23 25 24H15C13 24 11 26 11 28C11 30 13 32 15 32H25V36H15C10 36 7 33 7 28C7 25 9 23 11 22V25Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{company.location}</div>
                </div>
              </div>
            ))}
          </div>
        </VerticalMarquee>
      </div>
    );
  }

  return null;
}
