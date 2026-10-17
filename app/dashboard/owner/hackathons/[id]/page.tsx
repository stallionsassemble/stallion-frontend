/* eslint-disable */
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
  CheckCircle2,
  AlertCircle,
  MoreVertical,
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
import {
  useGetHackathon,
  useGetHackathonSubmissions,
  useGetHackathonWinners,
  useReviewSubmission,
  useSelectWinner,
  useRemoveWinner,
  usePublishHackathon,
} from '@/lib/api/hackathon/queries'
import { hackathonService } from '@/lib/api/hackathon'
import { useAuth } from '@/lib/store/use-auth'
import { Hackathon } from '@/lib/types/hackathon'
import { User } from '@/lib/types'
import { toast } from 'sonner'
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

export default function OwnerHackathonDetailsPage() {
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
  const participantCount = Number(raw._count?.participants ?? hackathon?.participantCount ?? raw.participantsCount ?? 0)
  const submissionCount = Number(raw._count?.submissions ?? hackathon?.submissionCount ?? submissions.length)
  const totalPrizePool = Number(raw.totalBudget ?? hackathon?.totalPrizePool ?? raw.totalReward ?? 0) || 0

  const invalidateHackathonQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['hackathons'] })
  }

  const handleReview = async (submissionId: string) => {
    const toastId = toast.loading('Marking submission as in review...')
    try {
      await reviewMutation.mutateAsync({ id: hackathon?.id || hackathonId, sid: submissionId })
      toast.success('Submission marked as in review', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(error.message || 'Failed to review submission', { id: toastId })
    }
  }

  const handleSelectWinner = async () => {
    if (!selectedSubmissionId) return
    
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
      toast.error(error.message || 'Failed to select winner', { id: toastId })
    }
  }

  const handleRemoveWinner = async (submissionId: string) => {
    const toastId = toast.loading('Removing winner status...')
    try {
      await removeWinnerMutation.mutateAsync({ id: hackathon?.id || hackathonId, sid: submissionId })
      toast.success('Winner status removed', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove winner', { id: toastId })
    }
  }

  const handlePublishResults = async () => {
    if (!confirm('Are you sure you want to publish results? This will trigger on-chain payouts and cannot be undone.')) {
      return
    }
    
    const toastId = toast.loading('Publishing results and triggering payouts...')
    try {
      await publishMutation.mutateAsync(hackathon?.id || hackathonId)
      toast.success('Results published and payouts triggered successfully!', { id: toastId })
      await invalidateHackathonQueries()
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish results', { id: toastId })
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
          href='/dashboard/owner/hackathons'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to My Hackathons
        </Link>
        <Card className='border-border bg-card'>
          <CardContent className='py-16 text-center'>
            <p className='text-lg font-semibold text-foreground'>
              Hackathon not found
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              ID: {hackathonId}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <Link
            href='/dashboard/owner/hackathons'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to My Hackathons
          </Link>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold text-foreground'>
              {hackathon.title}
            </h1>
            <Badge className={getStatusBadgeClass(hackathon.status)}>
              {hackathon.status || 'DRAFT'}
            </Badge>
          </div>
          
          {hackathon.status === 'PUBLISHED' && (
            <div className="mt-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-sm text-blue-400">
              <Calendar className="h-4 w-4" />
              <span>
                <strong>Submission Phase:</strong> Judging will open once the submission period ends on {formatDate(hackathon.endDate || hackathon.submissionDeadline || hackathon.deadline)}.
              </span>
            </div>
          )}

          {hackathon.status === 'JUDGING' && (
            <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-sm text-amber-400">
              <Trophy className="h-4 w-4" />
              <span>
                <strong>Judging Phase:</strong> You can now review submissions and select winners.
              </span>
            </div>
          )}

          <p className='max-w-3xl text-sm text-muted-foreground line-clamp-2 mt-2'>
            {hackathon.description || 'No description provided.'}
          </p>
        </div>

        <div className='flex gap-3'>
          <Button
            className='gap-2'
            onClick={() => {
              if (hackathon.status !== 'JUDGING') {
                toast.error('You can only publish results when the hackathon is in the JUDGING phase and winners have been selected.')
                return
              }
              void handlePublishResults()
            }}
            disabled={publishMutation.isPending || hackathon.status === 'COMPLETED' || hackathon.status === 'PUBLISHED'}
          >
            {publishMutation.isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ShieldCheck className='h-4 w-4' />
            )}
            Publish Results
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
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isSubmissionsLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
              </div>
            ) : submissions.length ? (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className='rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors'
                >
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='font-bold text-foreground'>
                          {submission.teamName || submission.projectName || submission.title || 'Untitled Project'}
                        </p>
                        <Badge variant='outline' className='text-[10px] h-4'>
                          {submission.status}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground line-clamp-1'>
                        By {getDisplayName(submission.user)} • {formatDate(submission.createdAt)}
                      </p>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        View Details
                      </Button>
                      {submission.status !== 'IN_REVIEW' && submission.status !== 'WINNER' && (
                        <Button 
                          size='sm' 
                          variant='secondary' 
                          onClick={() => handleReview(submission.id)}
                          disabled={reviewMutation.isPending}
                        >
                          Mark Review
                        </Button>
                      )}
                      {submission.status !== 'WINNER' && (
                        <Button 
                          size='sm' 
                          className={cn(
                            'bg-amber-600 hover:bg-amber-700 text-white',
                            hackathon.status !== 'JUDGING' && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (hackathon.status !== 'JUDGING') {
                              toast.error('Judging phase has not started yet. You can only select winners when the status is JUDGING.')
                              return
                            }
                            setSelectedSubmissionId(submission.id)
                            setIsWinnerModalOpen(true)
                          }}
                        >
                          Select Winner
                        </Button>
                      )}
                      {submission.status === 'WINNER' && (
                        <Button 
                          size='sm' 
                          variant='destructive'
                          onClick={() => handleRemoveWinner(submission.id)}
                          disabled={removeWinnerMutation.isPending}
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

        <Card className='border-border bg-card h-fit'>
          <CardHeader>
            <CardTitle>Winners List</CardTitle>
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
                  className='rounded-lg border border-border px-4 py-3 bg-primary/5'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='font-bold text-foreground'>
                        {winner.teamName ||
                          winner.submission?.teamName ||
                          getDisplayName(winner.user || winner.submission?.user)}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Rank #{winner.rank || index + 1}
                      </p>
                    </div>
                    <div className='flex items-center gap-1 text-primary font-bold'>
                      <Trophy className='h-4 w-4' />
                      {Number(
                        winner.prizeAmount || winner.amount || winner.submission?.prizeAmount || 0
                      ).toLocaleString()}
                    </div>
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

      {/* Winner Selection Modal */}
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

      {/* Submission Detail Modal */}
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
