'use client'

import { BountyCard } from '@/components/bounties/bounty-card'
import { BountyDetailsSidebar } from '@/components/bounties/bounty-details-sidebar'
import { DetailsHeader } from '@/components/bounties/details-header'
import { DetailsNavigation } from '@/components/bounties/details-navigation'
import {
  PaymentMilestones,
  type Milestone
} from '@/components/bounties/payment-milestones'
import { DiscussionList } from '@/components/discussions/discussion-list'
import { Button } from '@/components/ui/button'
import { useGetProject, useGetProjectMilestones, useGetProjects } from '@/lib/api/projects/queries'
import { useAuth } from '@/lib/store/use-auth'
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
  // Ensure id is a string
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) as string

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 1. Fetch Project Details
  const { data: project, isLoading: isProjectLoading, isError } = useGetProject(id!)
  console.log("Project Details", project)

  // 2. Fetch Milestones
  const { data: projectMilestones, isLoading: isMilestonesLoading } = useGetProjectMilestones(id!)

  // 3. Fetch Similar Projects (Just fetch open gigs for now as "similar")
  const { data: allProjects } = useGetProjects({ status: 'OPEN', type: 'GIG' })

  // 4. Fetch User Details 
  const { user } = useAuth()

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

  if (isProjectLoading || isMilestonesLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Project not found or failed to load.
      </div>
    )
  }

  // Filter similar projects (exclude current one)
  const similarBounties = (allProjects || [])
    .filter(p => p.id !== project.id)
    .slice(0, 5)


  const draftMilestones = (project.milestones || []).map((m, index) => ({
    id: `planned-${index}`,
    title: m.title,
    dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'TBD',
    amount: m.amount,
    status: 'PLANNED',
  }))

  const milestones: Milestone[] = draftMilestones

  const attachments = project.attachments || []
  const application = project.applications.filter((a) => a.userId === user?.id)[0]
  const appliedUser = project.applications
    .filter((a) => a.userId !== user?.id && a.user)
    .map((a) => a.user.profilePicture || '/assets/icons/sdollar.png')
  console.log("Applied", appliedUser)

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-8 relative items-start w-full max-w-full lg:h-[calc(100vh-7rem)] overflow-x-hidden lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Content Column */}
      <div className='flex flex-col min-w-0 flex-1 w-full max-w-full gap-4 lg:gap-6 lg:pr-2 xl:pr-4 overflow-x-hidden'>
        {/* Top Navigation Bar */}
        <DetailsNavigation
          backLink='/dashboard/projects'
          backText='Back to Projects'
          appliedUser={appliedUser}
        />

        {/* Project Details Content */}
        <div className='space-y-8 pb-20'>
          {/* Header Section */}
          <section className='rounded-xl border border-primary bg-card/30 p-4'>
            <DetailsHeader
              type='PROJECT'
              title={project.title}
              company={project.owner?.companyName || project.owner?.username || 'Stallion User'}
              logo={project.owner?.companyLogo || project.owner?.profilePicture || '/assets/icons/sdollar.png'}
              participants={project.applications.length || 0}
              dueDate={`${formatDistanceToNow(new Date(project.deadline))} left`}
              tags={project.skills}
              status={project.status}
              commentsCount={0} // Not available in API yet
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
              <p>{project.description}</p>
            </div>
          </section>

          {/* Requirements */}
          {project.requirements && project.requirements.length > 0 && (
            <section className='space-y-4 rounded-xl border-[0.69px] border-primary bg-[#09090B]/30 p-6'>
              <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                <FileText className='h-4 w-4 text-[#007AFF]' /> Requirements
              </h3>
              <ul className='space-y-2 text-sm text-gray-400'>
                {project.requirements.map((req, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='text-primary mt-0.5 text-lg'>•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <section className='space-y-4 rounded-xl border-[0.69px] border-primary bg-[#09090B]/30 p-6'>
              <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                <FileText className='h-4 w-4 text-[#007AFF]' /> Deliverables
              </h3>
              <ul className='space-y-2 text-sm text-gray-400'>
                {project.deliverables.map((item, i) => (
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

          {/* Payment Milestones */}
          {milestones.length > 0 && (
            <PaymentMilestones milestones={milestones} />
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <section className='space-y-4 p-6 border-[0.69px] border-primary'>
              <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                <FileUp className='h-5 w-5 text-[#007AFF]' />
                Attachments
              </h3>
              <div className='flex flex-wrap gap-3'>
                {attachments.map((file, idx) => (
                  <div key={idx} className='flex items-center gap-3 p-3 rounded-lg bg-[#09090B] border-[0.69px] border-primary w-full sm:min-w-[240px] sm:w-auto'>
                    <div className='h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20'>
                      <FileText className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-white line-clamp-1 max-w-[150px]'>
                        {file.filename}
                      </span>
                      <span className='text-[10px] text-gray-500'>
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
                        className='h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-transparent'
                      >
                        <Download className='h-4 w-4' />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Discussion Section */}
          <section className='rounded-xl border border-primary bg-card/30 p-4 mt-8'>
            <DiscussionList id={id} type="PROJECT" />
          </section>

          {/* Similar Projects */}
          {similarBounties.length > 0 && (
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
                {similarBounties.map((repoProject) => (
                  <BountyCard
                    key={repoProject.id}
                    id={repoProject.id}
                    title={repoProject.title}
                    description={repoProject.shortDescription || repoProject.description}
                    company={repoProject.owner?.companyName || repoProject.owner?.username || "Stallion User"}
                    logo={repoProject.owner?.companyLogo || repoProject.owner?.profilePicture || "/assets/icons/sdollar.png"}
                    amount={repoProject.reward || '$0'}
                    type={repoProject.currency as any}
                    tags={repoProject.skills}
                    participants={repoProject.acceptedCount || 0}
                    dueDate={`${formatDistanceToNow(new Date(repoProject.deadline))} left`}
                    version='PROJECT'
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Sidebar Column - Sticky, aligned with project header */}
      <div className='hidden lg:block lg:w-[320px] xl:w-[360px] shrink-0 self-start sticky top-0 -mt-20 space-y-8'>
        <BountyDetailsSidebar
          type='PROJECT'
          projectId={project.id}
          projectTitle={project.title}
          reward={project.reward}
          currency={project.currency}
          owner={project.owner}
          createdAt={project.createdAt}
          deadline={project.deadline}
          applied={project.applied}
          applicationId={application.id}
          winnerAnnouncement={project.winnerAnnouncement}
          currentApplication={application}
        />
      </div>

      {/* Mobile Footer */}
      <div className='lg:hidden block mt-8 w-full'>
        <BountyDetailsSidebar
          type='PROJECT'
          projectId={project.id}
          projectTitle={project.title}
          reward={project.reward}
          totalPaid={project.owner.totalPaid}
          totalContributors={project.owner.totalBounties}
          currency={project.currency}
          owner={project.owner}
          createdAt={project.createdAt}
          deadline={project.deadline}
          applied={project.applied}
          applicationId={application.id}
          winnerAnnouncement={project.winnerAnnouncement}
          currentApplication={application}
        />
      </div>
    </div>
  )
}
