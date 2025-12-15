'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

const bounties = [
  {
    id: 1,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png', // Using placeholder logo for now
  },
  {
    id: 2,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png',
  },
  {
    id: 3,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png',
  },
  {
    id: 4,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png',
  },
  {
    id: 5,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png',
  },
  {
    id: 6,
    title: 'Stallion Foundation',
    description:
      'The high-performance blockchain for mass adoption. Building the fastest layer-1 network.',
    active: '45',
    submissions: '1.2k',
    contributors: '120',
    distributed: '$185k Distributed',
    logo: '/assets/icons/sdollar.png',
  },
]

import { useState } from 'react'

const ActiveBounties = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, bounties.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }
  return (
    <section className='container mx-auto py-20' id='bounties'>
      <div className='text-center mb-16'>
        <h2 className='text-[45px] md:text-[64px] font-bold font-syne text-white mb-2'>
          Active Bounties
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0'>
        {bounties.map((bounty, index) => (
          <div
            key={bounty.id}
            className={`bg-[#050505] border rounded-[20px] p-6 md:p-8 flex flex-col items-center text-center border-primary/50 transition-colors duration-300 ${index === currentIndex ? 'flex' : 'hidden md:flex'
              }`}
          >
            {/* Header */}
            <div className='flex flex-row items-center mb-6'>
              <div className='w-16 h-16 relative mb-4'>
                {/* Using a white circle background for the logo to match design if needed, or just the logo */}
                <div className='w-16 h-16  rounded-full flex items-center justify-center overflow-hidden'>
                  <img
                    src={bounty.logo}
                    alt={bounty.title}
                    className='w-10 h-10 object-contain'
                  />
                </div>
              </div>
              <div className='justify-start text-start'>
                <h3 className='text-sm font-bold text-white font-inter leading-[21.68px] mb-2'>
                  {bounty.title}
                </h3>
                <p className='text-[#94969D] text-xs font-inter leading-relaxed max-w-[280px]'>
                  {bounty.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 w-full mb-8 pt-3'>
              <div className='flex flex-col'>
                <span className='text-primary font-bold text-xl md:text-2xl font-space-grotesk'>
                  {bounty.active}
                </span>
                <span className='text-[#A1A1AA] text-xs md:text-sm font-inter mt-1'>
                  Active
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-primary font-bold text-xl md:text-2xl font-space-grotesk'>
                  {bounty.submissions}
                </span>
                <span className='text-[#A1A1AA] text-xs md:text-sm font-inter mt-1'>
                  Submissions
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-primary font-bold text-xl md:text-2xl font-inter'>
                  {bounty.contributors}
                </span>
                <span className='text-[#94969D] text-xs md:text-sm font-inter mt-1'>
                  Contributors
                </span>
              </div>
            </div>

            {/* Distributed Badge */}
            <div className='w-full mb-6'>
              <div className='w-full py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-medium font-space-grotesk text-sm md:text-base'>
                {bounty.distributed}
              </div>
            </div>

            {/* Link */}
            <Link
              href='#'
              className='flex items-center gap-2 text-[#94969D] hover:text-white transition-colors text-sm font-inter'
            >
              View bounties <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className='flex justify-between items-center mt-6 md:hidden px-4'>
        {/* Dots */}
        <div className='flex gap-2'>
          {bounties.map((_, idx) => (
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
            disabled={currentIndex === bounties.length - 1}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] bg-transparent p-0 shrink-0 transition-colors ${currentIndex === bounties.length - 1
              ? 'border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
          >
            <ChevronRight className='w-3 h-3' strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className='flex justify-center mt-12'>
        <Button className='text-center bg-blue hover:bg-blue w-[178px] h-[59px] gap-[10px] rounded-[118px] p-[20px] opacity-100'>
          Get Started
        </Button>
      </div>
    </section>
  )
}

export default ActiveBounties
