'use client'

import { BountyCard } from '@/components/bounties/bounty-card'
import { BountyDetailsSidebar } from '@/components/bounties/bounty-details-sidebar'
import { DetailsHeader } from '@/components/bounties/details-header'
import { DetailsNavigation } from '@/components/bounties/details-navigation'
import { CreateBountyModal } from '@/components/dashboard/owner/create-bounty-modal'
import { RichTextRenderer } from '@/components/shared/rich-text-renderer'
import { Button } from '@/components/ui/button'
import { useGetAllBounties, useGetBounty } from '@/lib/api/bounties/queries'
import { useGetMyApplications } from '@/lib/api/projects/queries'
import { useAuth } from '@/lib/store/use-auth'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  ExternalLink,
  FileText,
  FileUp,
  Gift,
  Info,
  Loader2
} from 'lucide-react'
import { useRef, useState } from 'react'

export function BountyDetailsClient({ id }: { id: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuth()

  const { data: bounty, isLoading: isLoadingBounty } = useGetBounty(id)
  const { data: myApplications } = useGetMyApplications()

  const tags = bounty?.skills || []

  // ... (keeping lines 39-98 implicit/unchanged, but tool requires contiguous block or I use multi-replace or just replace the header part)

  // Actually, let's just replace the import block and the header block separately if possible, or do one big replace?
  // Since I need to edit imports AND the render method, I should use MULTI_REPLACE.
  // Wait, I can only use ReplaceFileContent for contiguous blocks. I should use correct tool or two calls.
  // I will use `multi_replace_file_content`.


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
  const filteredSimilar = (similarData?.data || []).filter((b: any) => b.id !== id);

  // Filter out current bounty and already included similar ones from allData
  const similarIds = new Set(filteredSimilar.map((b: any) => b.id));
  const filteredRecent = (allData?.data || []).filter((b: any) => b.id !== id && !similarIds.has(b.id));

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

  const isOwner = user?.id === bounty.owner?.id;

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-8 relative items-start w-full max-w-full lg:h-[calc(100vh-7rem)] overflow-x-hidden lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* Main Content Column */}
      <div className='flex flex-col min-w-0 flex-1 w-full max-w-full gap-4 lg:gap-6 lg:pr-2 xl:pr-4 overflow-x-hidden'>
        {/* Top Navigation Bar with Edit Button for Owner */}
        <div className="flex items-center justify-between gap-4">
          <DetailsNavigation
            id={bounty.id}
            type='BOUNTY'
            backLink={isOwner ? '/dashboard/owner/bounties' : '/dashboard/bounties'}
            backText={isOwner ? 'Back to My Bounties' : 'Back to Bounties'}
          />
          {isOwner && (
            <div className="flex items-center gap-2">
              {bounty.txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${bounty.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" /> View Transaction
                  </Button>
                </a>
              )}
              <CreateBountyModal existingBounty={bounty}>
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </CreateBountyModal>
            </div>
          )}
        </div>

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
              commentsCount={0}
            />
          </section>

          {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-lg mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {isOwner && <TabsTrigger value="submissions">Submissions</TabsTrigger>}
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList> */}

          {/* <TabsContent value="overview" className="space-y-6"> */}
          {/* Description */}
          <section className='space-y-3 rounded-xl border border-primary bg-card/30 p-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2'>
              <Info className='h-4 w-4 text-primary' /> Description
            </h3>
            <RichTextRenderer content={bounty.description} className="text-xs [&_p]:text-xs [&_li]:text-xs [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-xs" />
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
          {/* </TabsContent> */}

          {/* {isOwner && (
              <TabsContent value="submissions">
                <BountyManagementView bounty={bounty} />
              </TabsContent>
            )}

            <TabsContent value="discussion">
              <section className='rounded-xl border border-primary bg-card/30 p-4'>
                <DiscussionList id={id} type="BOUNTY" />
              </section>
            </TabsContent>
          </Tabs> */}

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
              applied={bounty.applied}
              applicationId={myApplication?.id}
              distribution={bounty.distribution || bounty.rewardDistribution}
              submissionFields={bounty.submissionFields}
              winnerAnnouncement={bounty.judgingDeadline}
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
          applied={bounty.applied}
          applicationId={myApplication?.id}
          distribution={bounty.rewardDistribution}
          submissionFields={bounty.submissionFields}
          winnerAnnouncement={bounty.judgingDeadline}
        />
      </div>
    </div>
  )
}
