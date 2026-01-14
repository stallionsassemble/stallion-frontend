import ActiveBounties from "@/components/landing/active-bounty";
import CommunityHighlight from "@/components/landing/community-highlights";
import { FAQSections } from "@/components/landing/faq-sections";
import { GsapWrapper } from "@/components/landing/gsap-wrapper";
import { HeroSection } from "@/components/landing/hero-section";
import { RecentWins } from "@/components/landing/recent-wins-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WhySection } from "@/components/landing/why-section";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home", // Will become "Home | Stallion"
  description: "Join the Stallion community and find your next big opportunity.",
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />

      <GsapWrapper>
        <WhySection />
      </GsapWrapper>

      <GsapWrapper>
        <RecentWins />
      </GsapWrapper>

      <GsapWrapper>
        <TestimonialsSection />
      </GsapWrapper>

      <GsapWrapper>
        <CommunityHighlight />
      </GsapWrapper>

      <GsapWrapper>
        <ActiveBounties />
      </GsapWrapper>

      <GsapWrapper>
        <FAQSections />
      </GsapWrapper>
    </div>
  );
}