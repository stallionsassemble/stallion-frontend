"use client";

import { OwnerStats } from "@/components/dashboard/owner/owner-stats";
import { OwnerProfileHeader } from "@/components/profile/owner-profile-header";
import { OwnerProfileTabs } from "@/components/profile/owner-profile-tabs";
import { OwnerRecentActivity } from "@/components/profile/owner-recent-activity";
import { PortfolioView } from "@/components/profile/portfolio-view";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  return (
    <div className="w-full max-w-full mx-auto animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      <OwnerProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 px-0 lg:px-6 mt-6">
        {/* Main Content */}
        <div className="min-w-0 space-y-6">

          <OwnerStats />

          <OwnerProfileTabs />

          {tab === "overview" && (
            <>
              <div className="mt-2">
                <OwnerRecentActivity />
              </div>
            </>
          )}

          {tab === "portfolio" && <PortfolioView viewType="owner" />}
        </div>
      </div>
    </div>
  );
}

export default function OwnerProfilePage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
