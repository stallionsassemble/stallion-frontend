'use client'

import { ActivityFeed } from '@/components/dashboard/main-sections'; // Reusing ActivityFeed
import { OwnerActiveWorks } from '@/components/dashboard/owner/owner-active-works';
import { OwnerRecentActivities } from '@/components/dashboard/owner/owner-recent-activities';
import { OwnerStats } from '@/components/dashboard/owner/owner-stats';
import { QuickActions } from '@/components/dashboard/owner/quick-actions';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { useAuth } from '@/lib/store/use-auth';

export default function ProjectOwnerDashboardPage() {
  const { user } = useAuth()

  return (
    <div className='flex flex-col gap-8 h-full max-w-[1600px] mx-auto pb-20'>
      {/* Welcome Banner */}
      <WelcomeBanner
        description="Ready to create new opportunities for Talents?"
        className="bg-blue-600 shadow-lg shadow-blue-900/20"
      />

      {/* Stats Row */}
      <OwnerStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Active Works */}
      <OwnerActiveWorks />

      {/* Recent Activities - Reusing exiting component as it's likely shared logic */}
      <OwnerRecentActivities />
    </div>
  )
}
