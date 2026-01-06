'use client'

import { BountyCard } from '@/components/bounties/bounty-card'
import { BountyDetailsSidebar } from '@/components/bounties/bounty-details-sidebar'
import { DetailsHeader } from '@/components/bounties/details-header'
import { DetailsNavigation } from '@/components/bounties/details-navigation'
import { DiscussionList } from '@/components/discussions/discussion-list'
import { Button } from '@/components/ui/button'
import { useGetAllBounties, useGetBounty } from '@/lib/api/bounties/queries'
import { useGetMyApplications } from '@/lib/api/projects/queries'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileUp,
  Gift,
  Info,
  Loader2
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRef } from 'react'

export default function BountyDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: bounty, isLoading: isLoadingBounty } = useGetBounty(id)
  console.log("Bounty", bounty)
  const { data: myApplications } = useGetMyApplications()

  const tags = bounty?.skills || []

  // Fetch similar bounties
  const { data: similarData, isLoading: isLoadingSimilar } = useGetAllBounties({
    limit: 5,
    skills: tags.length > 0 ? tags.join(',') : undefined
  });

  // Fetch recent/all bounties as fallback to ensure list isn't empty
  const { data: allData, isLoading: isLoadingAll } = useGetAllBounties({
    limit: 10,
    sortOrder: 'desc',
    sortBy: 'createdAt'
  });

  // Filter out current bounty from similar
  const filteredSimilar = (similarData?.data || []).filter(b => b.id !== id);

  // Filter out current bounty and already included similar ones from allData
  const similarIds = new Set(filteredSimilar.map(b => b.id));
  const filteredRecent = (allData?.data || []).filter(b => b.id !== id && !similarIds.has(b.id));

  // Merge: Similar first, then Recent, up to 10 total (or 5? let's do 10 to allow scrolling)
  const similarBounties = [...filteredSimilar, ...filteredRecent].slice(0, 10);

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

  // extensive check if I applied to this bounty (assuming applications return projectId which matches bounty id)
  const myApplication = myApplications?.find((app: any) => app.projectId === id || app.bountyId === id)
  const isApplied = !!myApplication

  if (isLoadingBounty) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!bounty) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-muted-foreground">
        Bounty not found.
      </div>
    )
  }

  const requirements = bounty.requirements || []
  const deliverables = bounty.deliverables || []
  const attachments = bounty.attachments || []

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-8 relative items-start w-full max-w-full lg:h-[calc(100vh-7rem)] overflow-x-hidden lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Content Column */}
      <div className='flex flex-col min-w-0 flex-1 w-full max-w-full gap-4 lg:gap-6 lg:pr-2 xl:pr-4 overflow-x-hidden'>
        {/* Top Navigation Bar */}
        <DetailsNavigation
          backLink='/dashboard/bounties'
          backText='Back to Bounties'
        />

        {/* Bounty Details Content */}
        <div className='space-y-8 pb-20'>
          {/* Header Section */}
          <section className='rounded-xl border border-primary bg-card/30 p-4'>
            <DetailsHeader
              type='BOUNTY'
              title={bounty.title}
              company={bounty.owner?.companyName || bounty.owner?.username || "Stallion User"}
              logo={bounty.owner?.companyLogo || bounty.owner?.profilePicture || "/assets/icons/sdollar.png"}
              participants={bounty.applicationCount || 0}
              dueDate={bounty.submissionDeadline ? formatDistanceToNow(new Date(bounty.submissionDeadline), { addSuffix: true }) : "No deadline"}
              tags={tags}
              status={bounty.status === 'ACTIVE' ? 'Submission Open' : bounty.status}
              commentsCount={0} // No comments data yet
            />
          </section>

          {/* Divider */}
          <div className='h-px w-full bg-border' />

          {/* Description */}
          <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <Info className='h-4 w-4 text-primary' /> Description
            </h3>
            <div className='prose prose-invert max-w-none text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap'>
              {bounty.description}
            </div>
          </section>

          {/* Requirements */}
          {requirements.length > 0 && (
            <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
              <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
                <FileText className='h-4 w-4 text-primary' /> Requirements
              </h3>
              <ul className='space-y-1.5 text-xs text-muted-foreground'>
                {requirements.map((req, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='text-primary mt-0.5'>•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
              <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
                <FileText className='h-4 w-4 text-primary' /> Deliverables
              </h3>
              <ul className='space-y-1.5 text-xs text-muted-foreground'>
                {deliverables.map((item, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <div className='mt-0.5 bg-blue-500/10 p-0.5 rounded px-1'>
                      <span className='text-primary text-[10px]'>✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <section className='space-y-4 p-4 sm:p-5 border border-primary text-foreground'>
              <h3 className='text-base font-bold text-foreground flex items-center gap-2'>
                <FileUp className='h-5 w-5 text-primary' />
                Attachments
              </h3>
              <div className='flex flex-wrap gap-3'>
                {attachments.map((file, i) => (
                  <div key={i} className='flex items-center gap-3 p-3 rounded-lg bg-card border border-primary w-full sm:min-w-[240px] sm:w-auto'>
                    <div className='h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20'>
                      {file.mimetype?.includes('image') ? (
                        <Info className='h-5 w-5 text-primary' /> // Or ImageIcon if imported
                      ) : (
                        <FileText className='h-5 w-5 text-primary' />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-foreground truncate max-w-[150px]'>
                        {file.filename}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto"
                    >
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-primary hover:text-primary hover:bg-transparent'
                      >
                        <Download className='h-4 w-4' />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Bounties */}
          {similarBounties.length > 0 && (
            <section className='space-y-6 pt-8 border-t border-border'>
              <div className='flex items-center justify-between'>
                <h3 className='text-base font-bold text-foreground flex items-center gap-2'>
                  <Gift className='h-5 w-5 text-primary' />
                  Similar & Recent Bounties
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
                {similarBounties.slice(0, 4).map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    id={bounty.id}
                    title={bounty.title}
                    description={bounty.shortDescription}
                    company={bounty.owner?.companyName || bounty.owner?.username || "Stallion User"}
                    logo={bounty.owner?.companyLogo || bounty.owner?.profilePicture || "/assets/icons/sdollar.png"}
                    amount={bounty.reward.toString()}
                    type={bounty.rewardCurrency as any}
                    tags={bounty.skills || []}
                    participants={bounty.applicationCount || 0}
                    dueDate={bounty.submissionDeadline ? formatDistanceToNow(new Date(bounty.submissionDeadline), { addSuffix: true }) : "No deadline"}
                    version="BOUNTY"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Discussion Section */}
          <section className='rounded-xl border border-primary bg-card/30 p-4 mt-8'>
            <DiscussionList id={id} type="BOUNTY" />
          </section>

          {/* Mobile Footer Sidebar */}
          <div className='lg:hidden block mt-8 mb-8'>
            <BountyDetailsSidebar
              type='BOUNTY'
              projectId={bounty.id}
              projectTitle={bounty.title}
              reward={bounty.reward.toString()}
              currency={bounty.rewardCurrency}
              totalContributors={(bounty.owner as any)?.totalBounties || 0}
              totalPaid={(bounty.owner as any)?.totalPaid || "0"}
              owner={bounty.owner as any}
              createdAt={bounty.createdAt}
              deadline={bounty.submissionDeadline}
              applied={isApplied}
              applicationId={myApplication?.id}
              distribution={bounty.distribution || bounty.rewardDistribution}
              submissionFields={bounty.submissionFields}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar Column - Sticky, aligned with bounty header */}
      <div className='hidden lg:block lg:w-[320px] xl:w-[360px] shrink-0 self-start sticky top-0 -mt-20 space-y-8'>
        <BountyDetailsSidebar
          type='BOUNTY'
          projectId={bounty.id}
          projectTitle={bounty.title}
          reward={bounty.reward.toString()}
          currency={bounty.rewardCurrency}
          totalContributors={(bounty.owner as any)?.totalBounties || 0}
          totalPaid={(bounty.owner as any)?.totalPaid || "0"}
          owner={bounty.owner as any}
          createdAt={bounty.createdAt}
          deadline={bounty.submissionDeadline}
          applied={isApplied}
          applicationId={myApplication?.id}
          distribution={bounty.rewardDistribution}
          submissionFields={bounty.submissionFields}
        />
      </div>
    </div>
  )
}
