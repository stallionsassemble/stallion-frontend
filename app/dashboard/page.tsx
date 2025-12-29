'use client'

import {
  ActivityFeed,
  OpportunityList,
} from '@/components/dashboard/main-sections'
import { DashboardRightSidebar } from '@/components/dashboard/right-sidebar'
import { StatsRow } from '@/components/dashboard/stats-row'
import Image from 'next/image'

export default function DashboardPage() {
  return (
    <div className='flex flex-col lg:flex-row gap-8 h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Column */}
      <div className='space-y-8 min-w-0 flex-1 pb-20'>
        {/* Welcome Banner */}
        <div className='relative overflow-hidden rounded-2xl bg-primary p-6 md:p-10 text-primary-foreground'>
          {/* Grid Pattern Overlay */}
          <div
            className='absolute inset-0 z-0 opacity-20'
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <div className='relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6'>
            <div className='h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-primary-foreground/20'>
              <Image
                src='https://avatar.vercel.sh/john'
                width={80}
                height={80}
                alt='John'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl font-bold mb-2'>Welcome back, John!</h1>
              <p className='text-primary-foreground/90 text-sm md:text-base font-medium'>
                Ready to build something amazing today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <StatsRow />

        {/* Browse Opportunities */}
        <OpportunityList title='Browse Opportunities' type='bounties' />

        {/* Grants */}
        <OpportunityList title='Grants' type='grants' />

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
