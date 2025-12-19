"use client";

import { Achievements } from "@/components/profile/achievements";
import { PortfolioView } from "@/components/profile/portfolio-view";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { RecentActivity } from "@/components/profile/recent-activity";
import { ReviewsView } from "@/components/profile/reviews-view";
import { SkillsSection } from "@/components/profile/skills-section";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  return (
    <div className="w-full max-w-full mx-auto animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 px-0">
        {/* Main Content */}
        <div className="min-w-0">
          <ProfileTabs />

          {tab === "overview" && (
            <>
              <SkillsSection />
              <RecentActivity />
              <Achievements />
            </>
          )}

          {tab === "portfolio" && <PortfolioView />}

          {tab === "reviews" && <ReviewsView />}
        </div>

        {/* Sidebar */}
        <div>
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
}
