'use client'

import { BountyCard } from '@/components/bounties/bounty-card'
import { BountyDetailsSidebar } from '@/components/bounties/bounty-details-sidebar'
import { DetailsHeader } from '@/components/bounties/details-header'
import { DetailsNavigation } from '@/components/bounties/details-navigation'
import {
  PaymentMilestones,
  type Milestone,
} from '@/components/bounties/payment-milestones'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileUp,
  Gift,
  Image as ImageIcon,
  Info
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRef } from 'react'

export default function BountyDetailsPage() {
  const params = useParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 400
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  // Mock Similar Bounties
  const similarBounties = [
    {
      id: 101,
      title: 'Solana Smart Contract Audit',
      description: 'Ensure the security of our Solana-based DeFi protocol...',
      company: 'Stallion Foundation',
      logo: '/assets/icons/sdollar.png',
      amount: '$5,000',
      type: 'USDC' as const,
      tags: ['Rust', 'Solana', 'Audit'],
      participants: 12,
      dueDate: '5d',
    },
    {
      id: 102,
      title: 'DeFi Protocol Security Review',
      description:
        'Looking for experts to review our yield farming mechanics...',
      company: 'Stallion Foundation',
      logo: '/assets/icons/sdollar.png',
      amount: '$3,500',
      type: 'USDC' as const,
      tags: ['Solidity', 'Security', 'DeFi'],
      participants: 8,
      dueDate: '10d',
    },
    {
      id: 103,
      title: 'NFT Marketplace Vulnerability Assessment',
      description:
        'Comprehensive penetration testing for our new NFT platform...',
      company: 'Stallion Foundation',
      logo: '/assets/icons/sdollar.png',
      amount: '$2,000',
      type: 'USDC' as const,
      tags: ['Security', 'PenTest', 'NFT'],
      participants: 5,
      dueDate: '14d',
    },
    {
      id: 105,
      title: 'Crypto Wallet Development',
      description:
        'Build a secure non-custodial wallet for the Stallion blockchain...',
      company: 'Stallion Foundation',
      logo: '/assets/icons/sdollar.png',
      amount: '$10,000',
      type: 'USDC' as const,
      tags: ['Wallet', 'Mobile', 'Security'],
      participants: 20,
      dueDate: '12d',
    },
  ]

  const milestones: Milestone[] = [
    {
      id: 1,
      title: 'Detailed Audit Report',
      dueDate: 'Dec 8, 2024',
      amount: '$1,000',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Detailed Audit Report',
      dueDate: 'Dec 8, 2024',
      amount: '$1,000',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Detailed Audit Report',
      dueDate: 'Dec 8, 2024',
      amount: '$1,000',
      status: 'pending',
    },
  ]

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-8 relative items-start w-full max-w-full lg:h-[calc(100vh-7rem)] overflow-x-hidden lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Content Column */}
      <div className='flex flex-col min-w-0 flex-1 w-full max-w-full gap-4 lg:gap-6 lg:pr-2 xl:pr-4 overflow-x-hidden'>
        {/* Top Navigation Bar */}
        <DetailsNavigation
          backLink='/dashboard/projects'
          backText='Back to Projects'
        />

        {/* Project Details Content */}
        <div className='space-y-8 pb-20'>
          {/* Header Section */}
          <section className='rounded-xl border border-primary bg-card/30 p-4'>
            <DetailsHeader
              type='PROJECT'
              title='Smart Contract Security Audit'
              company='Stallion Foundation'
              logo='/assets/icons/sdollar.png'
              participants={200}
              dueDate='10d'
              tags={['Solidity', 'Smart Contract', 'Audit', 'DeFi']}
              status='Submission Open'
              commentsCount={20}
            />
          </section>

          {/* Divider */}
          <div className='h-px w-full bg-border' />

          {/* Description */}
          <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <Info className='h-4 w-4 text-primary' /> Description
            </h3>
            <div className='prose prose-invert max-w-none text-muted-foreground text-xs leading-relaxed'>
              <p className='mb-3'>
                We are looking for an experienced smart contract security
                auditor to perform a comprehensive security audit of our
                protocol smart contracts. The protocol is built on custom
                Solidity contracts with heavy dependency on 3rd party oracles.
              </p>
              <p className='mb-2 font-medium text-foreground'>
                The audit should cover:
              </p>
              <ul className='space-y-1 pl-1'>
                <li className='flex items-center gap-2'>
                  {' '}
                  <span className='text-primary text-base'>•</span> Reentrancy
                  attacks
                </li>
                <li className='flex items-center gap-2'>
                  {' '}
                  <span className='text-primary text-base'>•</span> Oracle
                  manipulation risks
                </li>
                <li className='flex items-center gap-2'>
                  {' '}
                  <span className='text-primary text-base'>•</span> Access control
                  vulnerabilities
                </li>
                <li className='flex items-center gap-2'>
                  {' '}
                  <span className='text-primary text-base'>•</span> Gas
                  optimization
                </li>
                <li className='flex items-center gap-2'>
                  {' '}
                  <span className='text-primary text-base'>•</span> Logic errors
                  and edge cases
                </li>
              </ul>
            </div>
          </section>

          {/* Requirements */}
          <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <FileText className='h-4 w-4 text-primary' /> Requirements
            </h3>
            <ul className='space-y-1.5 text-xs text-muted-foreground'>
              {[
                '3+ years of smart contract auditing experience',
                'Proven track record with DeFi protocols',
                'Familiarity with common attack vectors',
                'Experience with Foundry or Hardhat testing',
                'Ability to write detailed technical reports',
              ].map((req, i) => (
                <li key={i} className='flex items-start gap-2'>
                  <span className='text-primary mt-0.5'>•</span>
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Deliverables */}
          <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <FileText className='h-4 w-4 text-primary' /> Deliverables
            </h3>
            <ul className='space-y-1.5 text-xs text-muted-foreground'>
              {[
                'Comprehensive security audit report',
                'Severity classification for each finding',
                'Recommended fixes and code suggestions',
                'Executive summary for non-technical stakeholders',
                'Follow-up review after fixes are implemented',
              ].map((item, i) => (
                <li key={i} className='flex items-start gap-2'>
                  <div className='mt-0.5 bg-primary/10 p-0.5 rounded px-1'>
                    <span className='text-primary text-[10px]'>✓</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Payment Milestones */}
          <PaymentMilestones milestones={milestones} />

          {/* Attachments */}
          <section className='space-y-3 p-4 border border-primary text-foreground'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <FileUp className='h-4 w-4 text-primary' />
              Attachments
            </h3>
            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center gap-3 p-2.5 rounded-lg bg-card border border-primary w-full sm:min-w-[200px] sm:w-auto'>
                <div className='h-8 w-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20'>
                  <FileText className='h-4 w-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-foreground'>
                    Contract_Sepc...pdf
                  </span>
                  <span className='text-[10px] text-muted-foreground'>
                    2.4 MB
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-auto h-6 w-6 text-primary hover:text-primary hover:bg-transparent'
                >
                  <Download className='h-3.5 w-3.5' />
                </Button>
              </div>
              <div className='flex items-center gap-3 p-2.5 rounded-lg bg-card border border-primary w-full sm:min-w-[200px] sm:w-auto'>
                <div className='h-8 w-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20'>
                  <ImageIcon className='h-4 w-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-white'>
                    Architecture_D...png
                  </span>
                  <span className='text-[10px] text-gray-500'>4.8 MB</span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-auto h-6 w-6 text-primary hover:text-primary hover:bg-transparent'
                >
                  <Download className='h-3.5 w-3.5' />
                </Button>
              </div>
              <div className='flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border w-full sm:min-w-[200px] sm:w-auto'>
                <div className='h-8 w-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20'>
                  <FileText className='h-4 w-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-foreground'>
                    Protocol_Spec...docx
                  </span>
                  <span className='text-[10px] text-muted-foreground'>
                    1.2 MB
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-auto h-6 w-6 text-primary hover:text-primary hover:bg-transparent'
                >
                  <Download className='h-3.5 w-3.5' />
                </Button>
              </div>
            </div>
          </section>

          {/* Similar Projects */}
          <section className='space-y-6 pt-8 border-t border-border'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground flex items-center gap-2'>
                <Gift className='h-5 w-5 text-primary' />
                Similar Projects
              </h3>
              <div className='flex items-center gap-2'>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => scroll('left')}
                  className='h-8 w-8 rounded-full bg-card border-primary/20 hover:bg-primary/10 hover:text-primary'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => scroll('right')}
                  className='h-8 w-8 rounded-full bg-card border-primary/20 hover:bg-primary/10 hover:text-primary'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
            <div
              ref={scrollContainerRef}
              className='flex overflow-x-auto pb-6 gap-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pl-1 scroll-smooth'
            >
              {similarBounties.map((bounty) => (
                <BountyCard key={bounty.id} {...bounty} version='PROJECT' />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Sidebar Column - Sticky, aligned with project header */}
      <div className='hidden lg:block lg:w-[320px] xl:w-[360px] shrink-0 self-start sticky top-0 -mt-20 space-y-8'>
        <BountyDetailsSidebar type='PROJECT' />
      </div>

      {/* Mobile Footer */}
      <div className='lg:hidden block mt-8'>
        <BountyDetailsSidebar type='PROJECT' />
      </div>
    </div>
  )
}
