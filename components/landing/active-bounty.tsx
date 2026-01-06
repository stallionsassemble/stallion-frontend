'use client'

import { useGetAllBounties } from '@/lib/api/bounties/queries'
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'

const ActiveBounties = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch real bounties
  const { data, isLoading } = useGetAllBounties({
    limit: 6,
    status: 'ACTIVE',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const bountiesList = data?.data || [];

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, bountiesList.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  if (isLoading) {
    return (
      <section className='container mx-auto py-20 flex justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </section>
    )
  }

  // If no bounties, we might want to hide the section or show a message.
  // For now, let's just render the section. If empty, grid will be empty.
  if (bountiesList.length === 0) {
    return null; // Or return generic "Coming Soon" section
  }

  return (
    <section className='container mx-auto py-20' id='bounties'>
      <div className='text-center mb-16'>
        <h2 className='text-[45px] md:text-[64px] font-bold font-syne text-white mb-2'>
          Active Bounties
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0'>
        {bountiesList.map((bounty: any, index: number) => (
          <div
            key={bounty.id}
            className={`bg-[#050505] border rounded-[20px] p-6 md:p-8 flex flex-col items-center text-center border-primary/50 transition-colors duration-300 ${index === currentIndex ? 'flex' : 'hidden md:flex'
              }`}
          >
            {/* Header */}
            <div className='flex flex-row items-center mb-6 w-full gap-4'>
              <div className='shrink-0'>
                {/* Logo */}
                <div className='w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center border border-white/10'>
                  <img
                    src={bounty.owner?.companyLogo || bounty.owner?.profilePicture || '/assets/icons/sdollar.png'}
                    alt={bounty.title}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
              <div className='text-left overflow-hidden'>
                <h3 className='text-sm font-bold text-white font-inter leading-[21.68px] mb-1 truncate'>
                  {bounty.title}
                </h3>
                <p className='text-[#94969D] text-xs font-inter leading-relaxed line-clamp-2'>
                  {bounty.shortDescription || "No description available"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-2 w-full mb-8 pt-3 border-t border-white/10'>
              <div className='flex flex-col items-center pt-4'>
                <span className='text-primary font-bold text-lg md:text-xl font-space-grotesk truncate w-full'>
                  {bounty.reward}
                </span>
                <span className='text-[#A1A1AA] text-[10px] md:text-xs font-inter mt-1'>
                  Reward
                </span>
              </div>
              <div className='flex flex-col items-center pt-4'>
                <span className='text-primary font-bold text-lg md:text-xl font-space-grotesk'>
                  {bounty.applicationCount || 0}
                </span>
                <span className='text-[#A1A1AA] text-[10px] md:text-xs font-inter mt-1'>
                  Submissions
                </span>
              </div>
              <div className='flex flex-col items-center pt-4'>
                <span className='text-primary font-bold text-lg md:text-xl font-inter'>
                  {bounty.rewardCurrency}
                </span>
                <span className='text-[#94969D] text-[10px] md:text-xs font-inter mt-1'>
                  Currency
                </span>
              </div>
            </div>

            {/* Distributed Badge -> Status or Deadline */}
            {/* Reuse this slot for Status or Deadline */}
            <div className='w-full mb-6'>
              <div className='w-full py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-medium font-space-grotesk text-sm md:text-base'>
                {bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : 'Active Now'}
              </div>
            </div>

            {/* Link */}
            <Link
              href={`/dashboard/bounties/${bounty.id}`}
              className='flex items-center gap-2 text-[#94969D] hover:text-white transition-colors text-sm font-inter'
            >
              View bounty <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className='flex justify-between items-center mt-6 md:hidden px-4'>
        {/* Dots */}
        <div className='flex gap-2'>
          {bountiesList.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-primary' : 'bg-white/20'
                }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className='flex gap-4'>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] bg-transparent p-0 shrink-0 transition-colors ${currentIndex === 0
              ? 'border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
          >
            <ChevronLeft className='w-3 h-3' strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === bountiesList.length - 1}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] bg-transparent p-0 shrink-0 transition-colors ${currentIndex === bountiesList.length - 1
              ? 'border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
          >
            <ChevronRight className='w-3 h-3' strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className='flex justify-center mt-12'>
        <Button className='text-center bg-blue hover:bg-blue w-[178px] h-[59px] gap-[10px] rounded-[118px] p-[20px] opacity-100' asChild>
          <Link href="/dashboard/bounties">Get Started</Link>
        </Button>
      </div>
    </section>
  )
}

export default ActiveBounties
