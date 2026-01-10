'use client'

import {
  ActivityFeed,
  OpportunityList,
} from '@/components/dashboard/main-sections'
import { DashboardRightSidebar } from '@/components/dashboard/right-sidebar'
import { StatsRow } from '@/components/dashboard/stats-row'
import { useAuth } from '@/lib/store/use-auth'

import { WelcomeBanner } from '@/components/dashboard/welcome-banner'

export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className='flex flex-col lg:flex-row gap-8 h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Column */}
      <div className='space-y-8 min-w-0 flex-1 pb-20'>
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Row */}
        <StatsRow />

        {/* Browse Opportunities */}
        <OpportunityList title='Browse Opportunities' type='bounties' />

        {/* Grants */}
        {/* <OpportunityList title='Grants' type='grants' /> */}

        {/* Recent Activities */}
        <ActivityFeed />
      </div>

      {/* Right Sidebar - Sticky */}
      <div className='hidden lg:block lg:w-[280px] xl:w-[320px] 2xl:w-[360px] shrink-0 self-start sticky top-0 space-y-6'>
        <DashboardRightSidebar />
      </div>

      {/* Mobile Right Sidebar Fallback (shown below on mobile if needed, or hidden) */}
      <div className='lg:hidden space-y-8 overflow-hidden'>
        <div className='w-full h-px bg-border my-4'></div>
        <DashboardRightSidebar />
      </div>
    </div>
  )
}
