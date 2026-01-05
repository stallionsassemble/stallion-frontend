"use client";

import { Achievements } from "@/components/profile/achievements";
import { ProfileHeader } from "@/components/profile/profile-header";
import { RecentActivity } from "@/components/profile/recent-activity";
import { ReviewList } from "@/components/reviews/review-list";
import { EmptyState } from "@/components/ui/empty-state";
import { useUserReputation } from "@/lib/api/reputation/queries";
import { useGetUserByUsername } from "@/lib/api/users/queries";
import { Loader2, UserX } from "lucide-react";
import { Suspense, use } from "react";

interface PublicProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

function PublicProfileContent({ username }: { username: string }) {
  const { data: userData, isLoading: isLoadingUser, isError } = useGetUserByUsername(username);

  // Dependent queries - wait for user data to get ID
  const userId = userData?.id || "";
  const { data: userReputation, isLoading: isLoadingReputation } = useUserReputation(userId);

  // We are loading if user is loading, or if user is found (we have ID) but reputation is loading.
  // If user not found, we don't load reputation.
  const isLoading = isLoadingUser || (!!userId && isLoadingReputation);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Gracefully handle error or missing user
  if (isError || !userData) {
    return (
      <div className="flex h-[50vh] items-center justify-center p-4">
        <EmptyState
          icon={UserX}
          title="User not found"
          description="We couldn't load this profile. The user might not exist or there's a temporary issue."
          className="max-w-md"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      <ProfileHeader
        userData={userData}
        reputationData={userReputation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 px-0">
        {/* Main Content */}
        <div className="min-w-0 space-y-6">
          {/* Only show Skills if available (likely empty for now) */}
          {/* <SkillsSection skills={userData?.skills} /> */}

          <RecentActivity userId={userId} publicMode />
          <Achievements userId={userId} publicMode />

          {/* User Reviews */}
          <section className="bg-card/30 border border-primary/20 rounded-xl p-4">
            <ReviewList userId={userId} username={userData.username} />
          </section>

          {/* Portfolio is harder without direct user object with portfolio items. Omit for public view for now unless API supports it. */}
        </div>

        {/* Sidebar - Omit for public view or show minimal stats */}
        <div>
          {/* <ProfileSidebar /> - Uses useAuth heavily, might need refactor or just omit */}
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = use(params);
  // id parameter here is actually the username now
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading profile...</div>}>
      <PublicProfileContent username={id} />
    </Suspense>
  );
}
