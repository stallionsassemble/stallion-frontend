'use client'

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
  Trash2,
} from 'lucide-react'

import { StepUpModal } from '@/components/admin/step-up-modal'
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
import {
  useGetHackathon,
  useGetHackathonSubmissions,
  useGetHackathonWinners,
} from '@/lib/api/hackathon/queries'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { useAuth } from '@/lib/store/use-auth'
import { Hackathon } from '@/lib/types/hackathon'
import { User } from '@/lib/types'
import { toast } from 'sonner'

type EditableHackathonForm = {
  title: string
  type: string
  description: string
  startDate: string
  endDate: string
  totalPrizePool: string
  currency: string
  maxTeamSize: string
  hostName: string
}

type PendingAction =
  | { type: 'open-edit' }
  | { type: 'save-edit' }
  | { type: 'delete' }
  | null

type HackathonView = Hackathon & {
  type?: string
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
  videoUrl?: string
  githubUrl?: string
  members?: string[]
  user?: User
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

const defaultFormData: EditableHackathonForm = {
  title: '',
  type: 'online',
  description: '',
  startDate: '',
  endDate: '',
  totalPrizePool: '',
  currency: 'USDC',
  maxTeamSize: '4',
  hostName: '',
}

const getStatusBadgeClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'PUBLISHED':
    case 'ONGOING':
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400 border-0'
    case 'DRAFT':
      return 'bg-amber-500/20 text-amber-400 border-0'
    case 'COMPLETED':
      return 'bg-blue-500/20 text-blue-400 border-0'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
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
  return fullName || user.username || user.companyName || user.email || 'Unknown user'
}

const mapHackathonToForm = (hackathon: HackathonView): EditableHackathonForm => ({
  title: hackathon.title || '',
  type: hackathon.type || 'online',
  description: hackathon.description || '',
  startDate: hackathon.startDate ? new Date(hackathon.startDate).toISOString().slice(0, 10) : '',
  endDate: hackathon.endDate ? new Date(hackathon.endDate).toISOString().slice(0, 10) : '',
  totalPrizePool: String(hackathon.totalPrizePool || hackathon.totalReward || ''),
  currency: hackathon.currency || 'USDC',
  maxTeamSize: String(hackathon.maxTeamSize || 4),
  hostName: hackathon.hostName || hackathon.owner?.companyName || '',
})

export default function HackathonAdminDetailsPage() {
  const params = useParams<{ id: string | string[] }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const hackathonId = Array.isArray(params.id) ? params.id[0] : params.id

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teamBasedParticipation, setTeamBasedParticipation] = useState(true)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [formData, setFormData] = useState<EditableHackathonForm>(defaultFormData)

  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  const { data: hackathonData, isLoading: isHackathonLoading } =
    useGetHackathon(hackathonId)
  const { data: submissionsData, isLoading: isSubmissionsLoading } =
    useGetHackathonSubmissions(hackathonId)
  const { data: winnersData, isLoading: isWinnersLoading } =
    useGetHackathonWinners(hackathonId)

  const hackathon = (hackathonData || null) as HackathonView | null
  const submissions = unwrapList<SubmissionView>(submissionsData)
  const winners = unwrapList<WinnerView>(winnersData)

  const participantCount =
    hackathon?.participantCount || hackathon?.participantsCount || 0
  const submissionCount = hackathon?.submissionCount || submissions.length
  const totalPrizePool = hackathon?.totalPrizePool || hackathon?.totalReward || 0

  const openEditModal = () => {
    if (!hackathon) return

    setFormData(mapHackathonToForm(hackathon))
    setTeamBasedParticipation(
      typeof hackathon.teamBasedParticipation === 'boolean'
        ? hackathon.teamBasedParticipation
        : Number(hackathon.maxTeamSize || 1) > 1
    )
    setIsEditOpen(true)
  }

  const invalidateHackathonQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['hackathons'] })
    await queryClient.invalidateQueries({
      queryKey: ['hackathons', hackathonId],
    })
    await queryClient.invalidateQueries({
      queryKey: ['admin', 'hackathons'],
    })
  }

  const handleDelete = async (stepUpTokenOverride?: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'delete' })
      setStepUpOpen(true)
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Deleting hackathon...')

    try {
      await adminService.deleteHackathon(hackathonId, token)
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

  const handleSave = async (stepUpTokenOverride?: string) => {
    if (!hackathon) return

    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.totalPrizePool
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('End date must be after the start date')
      return
    }

    if (!isStepUpValid()) {
      setPendingAction({ type: 'save-edit' })
      setStepUpOpen(true)
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }

    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      description: formData.description.trim(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      totalReward: parseFloat(formData.totalPrizePool),
      totalPrizePool: parseFloat(formData.totalPrizePool),
      currency: formData.currency,
      teamBasedParticipation,
      maxTeamSize: teamBasedParticipation ? parseInt(formData.maxTeamSize, 10) : 1,
      hostName: formData.hostName.trim(),
      ownerId: hackathon.ownerId || user?.id,
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Saving hackathon changes...')

    try {
      await adminService.updateHackathon(hackathonId, payload, token)
      toast.success('Hackathon updated successfully', { id: toastId })
      setIsEditOpen(false)
      await invalidateHackathonQueries()
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update hackathon'
      toast.error(message, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (!pendingAction) return

    if (pendingAction.type === 'open-edit') {
      openEditModal()
    } else if (pendingAction.type === 'save-edit') {
      void handleSave(token)
    } else if (pendingAction.type === 'delete') {
      void handleDelete(token)
    }

    setPendingAction(null)
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
        onSuccess={onStepUpSuccess}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className='max-w-2xl border-border bg-card'>
          <DialogHeader>
            <DialogTitle>Edit Hackathon</DialogTitle>
          </DialogHeader>

          <div className='grid gap-4'>
            <div className='space-y-2'>
              <Label>Hackathon Name</Label>
              <Input
                value={formData.title}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label>Hackathon Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((previous) => ({ ...previous, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='online'>Online</SelectItem>
                  <SelectItem value='hybrid'>Hybrid</SelectItem>
                  <SelectItem value='in-person'>In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                className='min-h-32'
                value={formData.description}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Input
                  type='date'
                  value={formData.startDate}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>End Date</Label>
                <Input
                  type='date'
                  value={formData.endDate}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-[1fr_120px]'>
              <div className='space-y-2'>
                <Label>Total Prize Pool</Label>
                <Input
                  value={formData.totalPrizePool}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      totalPrizePool: event.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((previous) => ({
                      ...previous,
                      currency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USDC'>USDC</SelectItem>
                    <SelectItem value='USGLO'>USGLO</SelectItem>
                    <SelectItem value='XLM'>XLM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-lg border border-border px-4 py-3'>
              <div>
                <p className='text-sm font-medium text-foreground'>
                  Team-Based Participation
                </p>
                <p className='text-xs text-muted-foreground'>
                  Allow participants to join as teams
                </p>
              </div>
              <Switch
                checked={teamBasedParticipation}
                onCheckedChange={setTeamBasedParticipation}
              />
            </div>

            {teamBasedParticipation ? (
              <div className='space-y-2'>
                <Label>Maximum Team Size</Label>
                <Input
                  type='number'
                  value={formData.maxTeamSize}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      maxTeamSize: event.target.value,
                    }))
                  }
                />
              </div>
            ) : null}

            <div className='space-y-2'>
              <Label>Host Name</Label>
              <Input
                value={formData.hostName}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    hostName: event.target.value,
                  }))
                }
              />
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <Button
                variant='outline'
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={() => void handleSave()} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Save className='mr-2 h-4 w-4' />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              {hackathon.status || 'UNKNOWN'}
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
              if (!isStepUpValid()) {
                setPendingAction({ type: 'open-edit' })
                setStepUpOpen(true)
                return
              }

              openEditModal()
            }}
          >
            <Edit className='h-4 w-4' />
            Edit
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
                ${totalPrizePool.toLocaleString()}
              </p>
            </div>
            <Trophy className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
        <Card className='border-border bg-card'>
          <CardContent className='flex items-center justify-between p-5'>
            <div>
              <p className='text-sm text-muted-foreground'>Timeline</p>
              <p className='text-sm font-semibold text-foreground'>
                {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
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
                <p>{getDisplayName(hackathon.owner)}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Host</p>
                <p>{hackathon.hostName || hackathon.owner?.companyName || 'Not set'}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Currency</p>
                <p>{hackathon.currency || 'USDC'}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Team Rules</p>
                <p>
                  {hackathon.maxTeamSize && hackathon.maxTeamSize > 1
                    ? `Teams allowed up to ${hackathon.maxTeamSize} members`
                    : 'Solo participation only'}
                </p>
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

      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
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
                        {submission.teamName || getDisplayName(submission.user)}
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
                    {submission.projectUrl ? (
                      <Button asChild size='sm' variant='outline'>
                        <a
                          href={submission.projectUrl}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Project
                          <ExternalLink className='ml-2 h-4 w-4' />
                        </a>
                      </Button>
                    ) : null}
                    {submission.githubUrl ? (
                      <Button asChild size='sm' variant='outline'>
                        <a
                          href={submission.githubUrl}
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
    </div>
  )
}
