'use client'

import { DEFAULT_SUBMISSION_QUESTIONS } from '@/lib/hackathon-form'
import { LinkifiedText } from '@/components/ui/linkified-text'
import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Calendar,
  Edit,
  ExternalLink,
  FileText,
  Loader2,
  Save,
  Trophy,
  Users,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { adminService } from '@/lib/api/admin'
import { HackathonApplicationsPanel } from '@/components/admin/hackathon-applications-panel'
import {
  useGetHackathon,
  useGetHackathonSubmissions,
  useGetHackathonWinners,
  useReviewSubmission,
  useSelectWinner,
  useRemoveWinner,
  usePublishHackathon,
} from '@/lib/api/hackathon/queries'
import { useAuth } from '@/lib/store/use-auth'
import { Hackathon } from '@/lib/types/hackathon'
import { User } from '@/lib/types'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { cn } from '@/lib/utils'
import { describePrizeSlot, slotsForSubmission, type PrizeSlot } from '@/lib/hackathon-prizes'

type HackathonView = Hackathon & {
  type?: 'OPEN_SOURCE' | 'CLOSED_SOURCE'
  ownerId?: string
  owner?: User
  hostName?: string
  teamBasedParticipation?: boolean
  maxTeamSize?: number
  totalReward?: number
  participantsCount?: number
}

type SubmissionView = {
  id: string
  teamName?: string
  description?: string
  status?: string
  createdAt?: string
  projectUrl?: string
  submissionLink?: string
  videoUrl?: string
  githubUrl?: string
  repositoryUrl?: string
  members?: string[]
  projectName?: string
  title?: string
  user?: User & { firstName?: string; lastName?: string; username?: string; email?: string }
  prizeAmount?: number
  rank?: number
  feedback?: string
}

type WinnerView = {
  id?: string
  rank?: number
  prizeAmount?: number
  amount?: number
  teamName?: string
  user?: User
  submission?: SubmissionView
}

const getStatusBadgeClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'PUBLISHED':
      return 'bg-green-500/20 text-green-400 border-0'
    case 'JUDGING':
      return 'bg-blue-500/20 text-blue-400 border-0'
    case 'COMPLETED':
      return 'bg-purple-500/20 text-purple-400 border-0'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-0'
    case 'DRAFT':
    default:
      return 'bg-gray-500/20 text-gray-400 border-0'
  }
}

const formatDate = (value?: string) => {
  if (!value) return 'N/A'

  try {
    return format(new Date(value), 'MMM d, yyyy')
  } catch {
    return value
  }
}

const unwrapList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (
    value &&
    typeof value === 'object' &&
    'data' in value &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: T[] }).data
  }

  return []
}

const getDisplayName = (user?: User) => {
  if (!user) return 'Unknown user'

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return fullName || (user as any).name || user.username || user.companyName || user.email || 'Unknown user'
}

export default function HackathonAdminDetailsPage() {
  const params = useParams<{ id: string | string[] }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const hackathonId = Array.isArray(params.id) ? params.id[0] : params.id

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionView | null>(null)


  const { data: hackathonData, isLoading: isHackathonLoading } =
    useGetHackathon(hackathonId)
  const { data: submissionsData, isLoading: isSubmissionsLoading } =
    useGetHackathonSubmissions(hackathonId)
  const { data: winnersData, isLoading: isWinnersLoading } =
    useGetHackathonWinners(hackathonId)
  
  const reviewMutation = useReviewSubmission()
  const selectWinnerMutation = useSelectWinner()
  const removeWinnerMutation = useRemoveWinner()
  const publishMutation = usePublishHackathon()
  
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [winnerPosition, setWinnerPosition] = useState('1')
  const [winnerFeedback, setWinnerFeedback] = useState('')
  const prizeSlots = (Array.isArray((hackathonData as any)?.prizePool) ? (hackathonData as any).prizePool : []) as PrizeSlot[]
  const hackathonAsset = (hackathonData as any)?.asset || (hackathonData as any)?.currency || 'USDC'

  const hackathon = (hackathonData || null) as HackathonView | null
  const submissions = unwrapList<SubmissionView>(submissionsData)
  const winnerCandidate = submissions.find((sub) => sub.id === selectedSubmissionId)
  const winnerSlots = slotsForSubmission(prizeSlots, (winnerCandidate as { track?: string } | undefined)?.track)
  // Keep the chosen prize valid for the submission being judged (per-track prizes differ by track).
  const effectiveWinnerPosition = winnerSlots.some((slot) => String(slot.position) === winnerPosition)
    ? winnerPosition
    : String(winnerSlots[0]?.position ?? '')
  const winners = unwrapList<WinnerView>(winnersData)

  const raw = (hackathonData || {}) as any
  const participantCount = Number(
    raw._count?.participants ?? hackathon?.participantCount ?? hackathon?.participantsCount ?? 0
  )
  const submissionCount = Number(raw._count?.submissions ?? hackathon?.submissionCount ?? submissions.length)
  const totalPrizePool = Number(raw.totalBudget ?? hackathon?.totalPrizePool ?? hackathon?.totalReward ?? 0) || 0
  const ownerUser = raw.createdBy ?? raw.company ?? hackathon?.owner
  const hostName = raw.company?.companyName || hackathon?.hostName || raw.title

  // Editing happens in the full hackathon form on the list page, so both places stay identical.
  const openEditModal = () => router.push(`/dashboard/admin/hackathons?edit=${hackathonId}`)

  const invalidateHackathonQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['hackathons'] })
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    const toastId = toast.loading('Deleting hackathon...')

    try {
      await adminService.deleteHackathon(hackathonId)
      toast.success('Hackathon deleted successfully', { id: toastId })
      await invalidateHackathonQueries()
      router.push('/dashboard/admin/hackathons')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete hackathon'
      toast.error(message, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const judgingOpen = hackathon?.status === 'JUDGING'
  const deadlineValue = (hackathonData as any)?.deadline
  const deadlineLabel = deadlineValue && !isNaN(new Date(deadlineValue).getTime()) ? formatDate(deadlineValue) : ''
  const judgingNotice = 'Judging opens when submissions close.'

  // Picking, removing winners and publishing results need a fresh 2FA check for admins.
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const ensureStepUp = (retry: () => void) => {
    if (useAdminStore.getState().getValidStepUpToken()) return true
    setPendingAction(() => retry)
    setStepUpOpen(true)
    return false
  }
  const looksLikeStepUpError = (error: unknown) =>
    /step-up|2fa|verification/i.test(getApiErrorMessage(error, ''))

  const handleReview = async (submissionId: string) => {
    const toastId = toast.loading('Marking submission as in review...')
    try {
      await reviewMutation.mutateAsync({ id: hackathonId, sid: submissionId })
      toast.success('Submission marked as in review', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to review submission'), { id: toastId })
    }
  }

  const handleSelectWinner = async () => {
    if (!selectedSubmissionId) return
    if (!ensureStepUp(() => void handleSelectWinner())) return

    const toastId = toast.loading('Selecting winner...')
    try {
      await selectWinnerMutation.mutateAsync({
        id: hackathon?.id || hackathonId,
        sid: selectedSubmissionId,
        payload: {
          submissionId: selectedSubmissionId,
          position: parseInt(effectiveWinnerPosition, 10),
          feedback: winnerFeedback.trim() || undefined,
        }
      })
      toast.success('Winner selected successfully', { id: toastId })
      setIsWinnerModalOpen(false)
      setSelectedSubmissionId(null)
      setWinnerFeedback('')
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to select winner'), { id: toastId })
      if (looksLikeStepUpError(error)) setStepUpOpen(true)
    }
  }

  const handleRemoveWinner = async (submissionId: string) => {
    if (!ensureStepUp(() => void handleRemoveWinner(submissionId))) return
    const toastId = toast.loading('Removing winner status...')
    try {
      await removeWinnerMutation.mutateAsync({ id: hackathonId, sid: submissionId })
      toast.success('Winner status removed', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to remove winner'), { id: toastId })
      if (looksLikeStepUpError(error)) setStepUpOpen(true)
    }
  }

  const handlePublishResults = async () => {
    if (!confirm('Are you sure you want to publish results? This will trigger on-chain payouts and cannot be undone.')) {
      return
    }
    if (!ensureStepUp(() => void handlePublishResults())) return
    
    const toastId = toast.loading('Publishing results and triggering payouts...')
    try {
      await publishMutation.mutateAsync(hackathonId)
      toast.success('Results published and payouts triggered successfully!', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to publish results'), { id: toastId })
      if (looksLikeStepUpError(error)) setStepUpOpen(true)
    }
  }


  if (isHackathonLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className='space-y-4'>
        <Link
          href='/dashboard/admin/hackathons'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Hackathons
        </Link>
        <Card className='border-border bg-card'>
          <CardContent className='py-16 text-center'>
            <p className='text-lg font-semibold text-foreground'>
              Hackathon not found
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              This hackathon may have been deleted or the route is invalid.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <StepUpModal
        open={stepUpOpen}
        onOpenChange={setStepUpOpen}
        onSuccess={() => {
          const action = pendingAction
          setPendingAction(null)
          setStepUpOpen(false)
          if (action) action()
        }}
      />

      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <Link
            href='/dashboard/admin/hackathons'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Hackathons
          </Link>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold text-foreground'>
              {hackathon.title}
            </h1>
            <Badge className={getStatusBadgeClass(hackathon.status)}>
              {hackathon.status || 'DRAFT'}
            </Badge>
          </div>
          <p className='max-w-3xl text-sm text-muted-foreground'>
            {hackathon.description || 'No description provided for this hackathon yet.'}
          </p>
        </div>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='gap-2'
            onClick={() => {
              openEditModal()
            }}
          >
            <Edit className='h-4 w-4' />
            Edit
          </Button>
          <Button
            className='gap-2'
            onClick={() => void handlePublishResults()}
            disabled={publishMutation.isPending || hackathon.status === 'COMPLETED' || !judgingOpen}
            title={!judgingOpen ? judgingNotice : undefined}
          >
            {publishMutation.isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ShieldCheck className='h-4 w-4' />
            )}
            Publish Results
          </Button>
          <Button
            variant='destructive'
            className='gap-2'
            onClick={() => void handleDelete()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4' />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card className='border-border bg-card'>
          <CardContent className='flex items-center justify-between p-5'>
            <div>
              <p className='text-sm text-muted-foreground'>Participants</p>
              <p className='text-2xl font-bold text-foreground'>
                {participantCount.toLocaleString()}
              </p>
            </div>
            <Users className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
        <Card className='border-border bg-card'>
          <CardContent className='flex items-center justify-between p-5'>
            <div>
              <p className='text-sm text-muted-foreground'>Submissions</p>
              <p className='text-2xl font-bold text-foreground'>
                {submissionCount.toLocaleString()}
              </p>
            </div>
            <FileText className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
        <Card className='border-border bg-card'>
          <CardContent className='flex items-center justify-between p-5'>
            <div>
              <p className='text-sm text-muted-foreground'>Prize Pool</p>
              <p className='text-2xl font-bold text-foreground'>
                {totalPrizePool.toLocaleString()} {hackathonAsset}
              </p>
            </div>
            <Trophy className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
        <Card className='border-border bg-card'>
          <CardContent className='flex items-center justify-between p-5'>
            <div>
              <p className='text-sm text-muted-foreground'>Created to deadline</p>
              <p className='text-sm font-semibold text-foreground'>
                {formatDate(raw.createdAt)} - {formatDate(raw.deadline)}
              </p>
            </div>
            <Calendar className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <Card className='border-border bg-card'>
          <CardHeader>
            <CardTitle>Hackathon Overview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-muted-foreground'>
          <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='font-medium text-foreground'>Owner</p>
                <p>{getDisplayName(ownerUser)}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Host</p>
                <p>{hostName || 'Not set'}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Currency</p>
                <p>{hackathonAsset}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Team Rules</p>
                <p>
                  {raw.teamBased && Number(raw.maxTeamSize) > 1
                    ? `Teams allowed up to ${raw.maxTeamSize} members`
                    : 'Solo participation only'}
                </p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Type</p>
                <Badge variant='outline' className='mt-1 capitalize'>
                  {String(raw.type || 'VIRTUAL').replace('_', ' ')}
                </Badge>
              </div>
            </div>
            {hackathon.tags?.length ? (
              <div className='flex flex-wrap gap-2 pt-2'>
                {hackathon.tags.map((tag) => (
                  <Badge key={tag} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className='border-border bg-card'>
          <CardHeader>
            <CardTitle>Winners</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isWinnersLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
              </div>
            ) : winners.length ? (
              winners.map((winner, index) => (
                <div
                  key={winner.id || winner.submission?.id || index}
                  className='rounded-lg border border-border px-4 py-3'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='font-medium text-foreground'>
                        {winner.teamName ||
                          winner.submission?.teamName ||
                          getDisplayName(winner.user || winner.submission?.user)}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Rank #{winner.rank || index + 1}
                      </p>
                    </div>
                    <p className='font-semibold text-foreground'>
                      $
                      {Number(
                        winner.prizeAmount || winner.amount || winner.submission?.prizeAmount || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                No winners have been announced yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <HackathonApplicationsPanel
        hackathonId={hackathonId}
        teamBased={Boolean((hackathon as any).teamBased ?? (hackathon as any).teamBasedParticipation)}
        maxTeamSize={(hackathon as any).maxTeamSize}
        requiresApproval={Boolean((hackathon as any).requiresApproval)}
        questions={Array.isArray((hackathon as any).applicationForm) ? (hackathon as any).applicationForm : []}
      />

      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {!judgingOpen && hackathon.status !== 'COMPLETED' && (
            <div className='mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400'>
              Judging opens when submissions close{deadlineLabel ? ` on ${deadlineLabel}` : ''}. You can review and pick winners from then.
            </div>
          )}
          {isSubmissionsLoading ? (
            <div className='flex justify-center py-10'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          ) : submissions.length ? (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className='rounded-lg border border-border p-4'
              >
                <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='font-medium text-foreground'>
                        {submission.teamName || submission.projectName || submission.title || getDisplayName(submission.user)}
                      </p>
                      <Badge variant='secondary'>
                        {submission.status || 'UNKNOWN'}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Submitted by {getDisplayName(submission.user)} on{' '}
                      {formatDate(submission.createdAt)}
                    </p>
                    {submission.description ? (
                      <p className='text-sm text-muted-foreground'>
                        {submission.description}
                      </p>
                    ) : null}
                    {submission.feedback ? (
                      <p className='text-sm text-muted-foreground'>
                        Feedback: {submission.feedback}
                      </p>
                    ) : null}
                    {submission.members?.length ? (
                      <p className='text-sm text-muted-foreground'>
                        Team members: {submission.members.length}
                      </p>
                    ) : null}
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {(submission.projectUrl || submission.submissionLink) ? (
                      <Button asChild size='sm' variant='outline'>
                        <a
                          href={submission.projectUrl || submission.submissionLink}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Project
                          <ExternalLink className='ml-2 h-4 w-4' />
                        </a>
                      </Button>
                    ) : null}
                    {(submission.githubUrl || submission.repositoryUrl) ? (
                      <Button asChild size='sm' variant='outline'>
                        <a
                          href={submission.githubUrl || submission.repositoryUrl}
                          target='_blank'
                          rel='noreferrer'
                        >
                          GitHub
                          <ExternalLink className='ml-2 h-4 w-4' />
                        </a>
                      </Button>
                    ) : null}
                    {submission.videoUrl ? (
                      <Button asChild size='sm' variant='outline'>
                        <a
                          href={submission.videoUrl}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Demo
                          <ExternalLink className='ml-2 h-4 w-4' />
                        </a>
                      </Button>
                    ) : null}
                    <Button 
                      size='sm' 
                      variant='ghost'
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      View Details
                    </Button>
                    
                    {submission.status !== 'WINNER' && (
                      <>
                        {submission.status !== 'IN_REVIEW' && (
                          <Button 
                            size='sm' 
                            variant='secondary' 
                            onClick={() => handleReview(submission.id)}
                            disabled={reviewMutation.isPending || !judgingOpen}
                            title={!judgingOpen ? judgingNotice : undefined}
                          >
                            Mark Review
                          </Button>
                        )}
                        <Button 
                          size='sm' 
                          className='bg-amber-600 hover:bg-amber-700 text-white'
                          disabled={!judgingOpen}
                          title={!judgingOpen ? judgingNotice : undefined}
                          onClick={() => {
                            setSelectedSubmissionId(submission.id)
                            setIsWinnerModalOpen(true)
                          }}
                        >
                          Select Winner
                        </Button>
                      </>
                    )}
                    
                    {submission.status === 'WINNER' && (
                      <Button 
                        size='sm' 
                        variant='destructive'
                        onClick={() => handleRemoveWinner(submission.id)}
                        disabled={removeWinnerMutation.isPending || !judgingOpen}
                      >
                        Remove Winner
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>
              No submissions yet for this hackathon.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isWinnerModalOpen} onOpenChange={setIsWinnerModalOpen}>
        <DialogContent className='border-border bg-card'>
          <DialogHeader>
            <DialogTitle>Select Winner Position</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 pt-4'>
            <div className='space-y-2'>
              <Label>Position</Label>
              <Select value={effectiveWinnerPosition} onValueChange={setWinnerPosition}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a prize' />
                </SelectTrigger>
                <SelectContent>
                  {winnerSlots.length === 0 ? (
                    <div className='p-3 text-sm text-muted-foreground'>
                      No prize positions are available for this submission's track.
                    </div>
                  ) : (
                    winnerSlots.map((slot) => (
                      <SelectItem key={slot.position} value={String(slot.position)}>
                        {describePrizeSlot(slot, prizeSlots)} ({Number(slot.amount).toLocaleString()} {hackathonAsset})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Feedback (Optional)</Label>
              <Textarea 
                placeholder='Provide feedback to the winner...'
                value={winnerFeedback}
                onChange={(e) => setWinnerFeedback(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-3 pt-2'>
              <Button variant='outline' onClick={() => setIsWinnerModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                className='bg-amber-600 hover:bg-amber-700 text-white'
                onClick={handleSelectWinner}
                disabled={selectWinnerMutation.isPending}
              >
                {selectWinnerMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Confirm Winner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="bg-card border-border sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Submission Details</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Project Name</p>
                  <p className="text-lg font-bold">{selectedSubmission.teamName || selectedSubmission.projectName || selectedSubmission.title || 'Untitled Project'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                  <Badge className="mt-1">{selectedSubmission.status}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</p>
                <p className="text-sm leading-relaxed mt-1"><LinkifiedText text={selectedSubmission.description || 'No description provided.'} /></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Submitted By</p>
                  <p className="text-sm font-medium">{getDisplayName(selectedSubmission.user)}</p>
                  <p className="text-xs text-muted-foreground">{selectedSubmission.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                  <p className="text-sm">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Project Links</p>
                <div className="flex flex-col gap-2">
                  {(selectedSubmission.projectUrl || selectedSubmission.submissionLink) && (
                    <a href={selectedSubmission.projectUrl || selectedSubmission.submissionLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                      <ExternalLink className="h-4 w-4" /> Demo: {selectedSubmission.projectUrl || selectedSubmission.submissionLink}
                    </a>
                  )}
                  {(selectedSubmission.githubUrl || selectedSubmission.repositoryUrl) && (
                    <a href={selectedSubmission.githubUrl || selectedSubmission.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                      <ExternalLink className="h-4 w-4" /> GitHub: {selectedSubmission.githubUrl || selectedSubmission.repositoryUrl}
                    </a>
                  )}
                  {selectedSubmission.videoUrl && (
                    <a href={selectedSubmission.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                      <ExternalLink className="h-4 w-4" /> Video: {selectedSubmission.videoUrl}
                    </a>
                  )}
                  {(((hackathon as any)?.submissionForm?.length ? (hackathon as any).submissionForm : DEFAULT_SUBMISSION_QUESTIONS) as { id: string; label: string; type: string }[]).map((q) => {
                    const answer = (selectedSubmission as any).submissionData?.answers?.[q.id]
                    if (!answer) return null
                    // These are already shown above as Demo, GitHub and Video.
                    if (['demo_link', 'github', 'demo_video'].includes(q.id)) return null
                    if (q.type === 'IMAGE_UPLOAD') {
                      return (
                        <div key={q.id} className="flex flex-wrap gap-2">
                          {(answer as string[]).map((url) => (
                            <a key={url} href={url} target="_blank" rel="noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={q.label} className="h-16 w-24 rounded-md border object-cover" />
                            </a>
                          ))}
                        </div>
                      )
                    }
                    const text = Array.isArray(answer) ? answer.join(', ') : String(answer)
                    return /^https?:\/\//i.test(text) ? (
                      <a key={q.id} href={text} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm break-all">
                        <ExternalLink className="h-4 w-4 shrink-0" /> {q.label}: {text}
                      </a>
                    ) : (
                      <p key={q.id} className="text-sm"><span className="font-medium">{q.label}:</span> {text}</p>
                    )
                  })}
                </div>
              </div>

              {selectedSubmission.feedback && (
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admin Feedback</p>
                  <p className="text-sm italic mt-1">"{selectedSubmission.feedback}"</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>Close</Button>
                {selectedSubmission.status !== 'WINNER' && (
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {
                      setSelectedSubmissionId(selectedSubmission.id)
                      setIsWinnerModalOpen(true)
                      setSelectedSubmission(null)
                    }}
                  >
                    Select as Winner
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
