'use client'

import { LinkifiedText } from '@/components/ui/linkified-text'
import { Fragment, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, Download, Eye, Loader2, Search, Users, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { adminService, type AdminApplication } from '@/lib/api/admin'
import { exportToCSV } from '@/lib/csv'
import type { ApplicationQuestion } from '@/lib/hackathon-form'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { cn } from '@/lib/utils'

type StatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'LOOKING' | 'TEAMS'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-0 hover:bg-amber-500/20',
  ACCEPTED: 'bg-green-500/20 text-green-400 border-0 hover:bg-green-500/20',
  REJECTED: 'bg-red-500/20 text-red-400 border-0 hover:bg-red-500/20',
  WITHDRAWN: 'bg-muted text-muted-foreground border-0 hover:bg-muted',
}

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

const errorMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  if (Array.isArray(message)) return message.join('. ')
  return typeof message === 'string' && message ? message : fallback
}

const displayName = (a: AdminApplication) =>
  [a.user.firstName, a.user.lastName].filter(Boolean).join(' ') || a.user.username

const formatAnswer = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(', ') : (value ?? '')

interface Props {
  hackathonId: string
  teamBased: boolean
  maxTeamSize?: number | null
  requiresApproval: boolean
  questions: ApplicationQuestion[]
}

export function HackathonApplicationsPanel({
  hackathonId,
  teamBased,
  maxTeamSize,
  requiresApproval,
  questions,
}: Props) {
  const queryClient = useQueryClient()
  const getValidStepUpToken = useAdminStore((state) => state.getValidStepUpToken)

  const [filter, setFilter] = useState<StatusFilter>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const [viewing, setViewing] = useState<AdminApplication | null>(null)
  const [reviewing, setReviewing] = useState<{ application: AdminApplication; decision: 'ACCEPTED' | 'REJECTED' } | null>(null)
  const [note, setNote] = useState('')
  const [groupOpen, setGroupOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [busy, setBusy] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<((token: string) => Promise<void>) | null>(null)

  const queryKey = ['admin-hackathon-applications', hackathonId, filter, search, page]
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      adminService.getHackathonApplications(hackathonId, {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: filter === 'PENDING' || filter === 'ACCEPTED' || filter === 'REJECTED' ? filter : undefined,
        lookingForTeam: filter === 'LOOKING' ? true : undefined,
        inTeam: filter === 'TEAMS' ? true : undefined,
      }),
    placeholderData: (previous) => previous,
  })

  const applications = data?.data ?? []
  const counts = data?.counts
  const totalPages = data?.meta.totalPages ?? 1
  const questionLabels = useMemo(() => new Map(questions.map((q) => [q.id, q.label])), [questions])

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-hackathon-applications', hackathonId] })

  // Runs a protected action, asking for 2FA first when there is no valid step-up token.
  const withStepUp = (action: (token: string) => Promise<void>) => {
    const token = getValidStepUpToken()
    if (token) {
      void action(token)
    } else {
      setPendingAction(() => action)
      setStepUpOpen(true)
    }
  }

  const submitReview = () => {
    if (!reviewing) return
    const { application, decision } = reviewing
    withStepUp(async (token) => {
      setBusy(true)
      try {
        await adminService.reviewHackathonApplication(
          hackathonId,
          application.id,
          { decision, note: note.trim() || undefined },
          token
        )
        toast.success(decision === 'ACCEPTED' ? 'Application accepted' : 'Application rejected', {
          description: `${displayName(application)} has been emailed.`,
        })
        setReviewing(null)
        setNote('')
        refresh()
      } catch (error) {
        toast.error('Could not review the application', { description: errorMessage(error, 'Please try again.') })
      } finally {
        setBusy(false)
      }
    })
  }

  const submitGroup = () => {
    const name = teamName.trim()
    if (!name) {
      toast.error('Enter a team name')
      return
    }
    withStepUp(async (token) => {
      setBusy(true)
      try {
        await adminService.groupHackathonApplicants(hackathonId, { teamName: name, participantIds: selected }, token)
        toast.success('Team created', { description: `${selected.length} applicants are now in "${name}".` })
        setGroupOpen(false)
        setTeamName('')
        setSelected([])
        refresh()
      } catch (error) {
        toast.error('Could not create the team', { description: errorMessage(error, 'Please try again.') })
      } finally {
        setBusy(false)
      }
    })
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const all: AdminApplication[] = []
      for (let p = 1; p <= 50; p++) {
        const res = await adminService.getHackathonApplications(hackathonId, { page: p, limit: 100 })
        all.push(...res.data)
        if (p >= res.meta.totalPages) break
      }
      if (all.length === 0) {
        toast.error('No applications to export')
        return
      }
      exportToCSV(
        all,
        [
          { header: 'Name', key: (a) => displayName(a) },
          { header: 'Email', key: (a) => a.user.email },
          { header: 'Status', key: (a) => a.status },
          { header: 'Team', key: (a) => a.team?.name ?? '' },
          { header: 'Looking for team', key: (a) => (a.lookingForTeam && !a.teamId ? 'Yes' : '') },
          { header: 'Applied', key: (a) => a.appliedAt },
          ...questions.map((q) => ({
            header: q.label,
            key: (a: AdminApplication) => formatAnswer(a.applicationData?.[q.id]),
          })),
        ],
        'hackathon_applications'
      )
    } catch (error) {
      toast.error('Export failed', { description: errorMessage(error, 'Please try again.') })
    } finally {
      setIsExporting(false)
    }
  }

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const filters: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending', count: counts?.PENDING },
    { key: 'ACCEPTED', label: 'Accepted', count: counts?.ACCEPTED },
    { key: 'REJECTED', label: 'Rejected', count: counts?.REJECTED },
    ...(teamBased
      ? [
          { key: 'LOOKING' as StatusFilter, label: 'Needs a team', count: counts?.lookingForTeam },
          { key: 'TEAMS' as StatusFilter, label: 'In a team', count: counts?.inTeam },
        ]
      : []),
  ]

  const canSelect = (a: AdminApplication) => teamBased && !a.teamId && a.status !== 'REJECTED'

  return (
    <Card className='border-border bg-card'>
      <StepUpModal
        open={stepUpOpen}
        onOpenChange={setStepUpOpen}
        onSuccess={(token) => {
          const action = pendingAction
          setPendingAction(null)
          if (action) void action(token)
        }}
      />

      <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle>Applications</CardTitle>
          <p className='mt-1 text-xs text-muted-foreground'>
            {requiresApproval
              ? 'Applications wait here until you accept or reject them.'
              : 'This hackathon is open: applicants are accepted automatically.'}
          </p>
        </div>
        <div className='flex gap-2'>
          {selected.length > 0 && (
            <Button className='gap-2' onClick={() => setGroupOpen(true)}>
              <Users className='h-4 w-4' />
              Group {selected.length} into a team
            </Button>
          )}
          <Button variant='outline' className='gap-2 border-border' onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex flex-wrap gap-2'>
          {filters.map((f) => (
            <button
              key={f.key}
              type='button'
              onClick={() => {
                setFilter(f.key)
                setPage(1)
              }}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filter === f.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
              {f.count !== undefined && <span className='ml-1.5 opacity-80'>{f.count}</span>}
            </button>
          ))}
        </div>

        <div className='relative sm:max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search by name or email'
            className={cn(inputClass, 'pl-10')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {isLoading ? (
          <div className='flex justify-center py-10'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
          </div>
        ) : applications.length === 0 ? (
          <p className='rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
            No applications match this view yet.
          </p>
        ) : (
          <div className='space-y-2'>
            {applications.map((a, index) => (
              <Fragment key={a.id}>
              {filter === 'TEAMS' && a.team && a.team.id !== applications[index - 1]?.team?.id && (
                <div className='flex items-center gap-2 pt-2 text-sm font-semibold text-foreground'>
                  <Users className='h-4 w-4 text-primary' />
                  {a.team.name}
                  <span className='text-xs font-normal text-muted-foreground'>
                    {applications.filter((x) => x.team?.id === a.team?.id).length} on this page
                  </span>
                </div>
              )}
              <div
                className='flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center'
              >
                <div className='flex min-w-0 flex-1 items-center gap-3'>
                  {teamBased && (
                    <input
                      type='checkbox'
                      aria-label={`Select ${displayName(a)}`}
                      className='h-4 w-4 shrink-0 accent-primary disabled:opacity-30'
                      disabled={!canSelect(a)}
                      checked={selected.includes(a.id)}
                      onChange={() => toggle(a.id)}
                    />
                  )}
                  <Avatar className='h-9 w-9 shrink-0'>
                    <AvatarImage src={a.user.profilePicture ?? undefined} />
                    <AvatarFallback>{displayName(a).charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-foreground'>{displayName(a)}</p>
                    <p className='truncate text-xs text-muted-foreground'>{a.user.email}</p>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                  <Badge className={STATUS_STYLES[a.status]}>{a.status}</Badge>
                  {a.team && <Badge variant='secondary'>Team: {a.team.name}</Badge>}
                  {a.lookingForTeam && !a.teamId && <Badge variant='outline'>Needs a team</Badge>}
                </div>

                <div className='flex gap-1 sm:ml-auto'>
                  <Button variant='ghost' size='sm' className='gap-1' onClick={() => setViewing(a)}>
                    <Eye className='h-4 w-4' /> View
                  </Button>
                  {a.status !== 'ACCEPTED' && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1 text-green-500 hover:text-green-500'
                      onClick={() => setReviewing({ application: a, decision: 'ACCEPTED' })}
                    >
                      <Check className='h-4 w-4' /> Accept
                    </Button>
                  )}
                  {a.status !== 'REJECTED' && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1 text-destructive hover:text-destructive'
                      onClick={() => setReviewing({ application: a, decision: 'REJECTED' })}
                    >
                      <X className='h-4 w-4' /> Reject
                    </Button>
                  )}
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>
              Page {page} of {totalPages}
            </span>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' className='border-border' disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='border-border'
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Answers */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className='bg-card border-border w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0'>
          <DialogHeader className='p-4 sm:p-6 border-b border-border text-left'>
            <DialogTitle className='text-xl font-bold text-foreground font-inter'>
              {viewing ? displayName(viewing) : ''}
            </DialogTitle>
            <DialogDescription className='break-all'>{viewing?.user.email}</DialogDescription>
          </DialogHeader>
          <div className='flex-1 space-y-4 overflow-y-auto p-4 sm:p-6'>
            {viewing && Object.keys(viewing.applicationData ?? {}).length === 0 && (
              <p className='text-sm text-muted-foreground'>This applicant joined without a form.</p>
            )}
            {viewing &&
              Object.entries(viewing.applicationData ?? {}).map(([id, value]) => (
                <div key={id} className='space-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                    {questionLabels.get(id) ?? id}
                  </p>
                  <p className='text-sm text-foreground'>{formatAnswer(value) ? <LinkifiedText text={formatAnswer(value)} /> : '-'}</p>
                </div>
              ))}
            {viewing?.reviewNote && (
              <div className='rounded-lg bg-muted/30 p-3 text-sm'>
                <span className='font-semibold'>Review note: </span>
                {viewing.reviewNote}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Accept / reject */}
      <Dialog open={!!reviewing} onOpenChange={(open) => !open && !busy && setReviewing(null)}>
        <DialogContent className='bg-card border-border w-[calc(100%-1.5rem)] sm:max-w-[480px] p-0 gap-0'>
          <DialogHeader className='p-4 sm:p-6 border-b border-border text-left'>
            <DialogTitle className='text-xl font-bold text-foreground font-inter'>
              {reviewing?.decision === 'ACCEPTED' ? 'Accept application' : 'Reject application'}
            </DialogTitle>
            <DialogDescription>
              {reviewing ? displayName(reviewing.application) : ''} will be emailed the decision.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2 p-4 sm:p-6'>
            <Label className='text-sm font-semibold text-foreground'>Note (optional)</Label>
            <Textarea
              className='min-h-[90px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground focus-visible:border-primary'
              placeholder='Included in the email'
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className='flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:p-6'>
            <Button variant='ghost' className='text-muted-foreground' disabled={busy} onClick={() => setReviewing(null)}>
              Cancel
            </Button>
            <Button
              className={cn(reviewing?.decision === 'REJECTED' && 'bg-destructive hover:bg-destructive/90 text-white')}
              disabled={busy}
              onClick={submitReview}
            >
              {busy ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              {reviewing?.decision === 'ACCEPTED' ? 'Accept' : 'Reject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Group into a team */}
      <Dialog open={groupOpen} onOpenChange={(open) => !open && !busy && setGroupOpen(false)}>
        <DialogContent className='bg-card border-border w-[calc(100%-1.5rem)] sm:max-w-[480px] p-0 gap-0'>
          <DialogHeader className='p-4 sm:p-6 border-b border-border text-left'>
            <DialogTitle className='text-xl font-bold text-foreground font-inter'>Group into a team</DialogTitle>
            <DialogDescription>
              {selected.length} applicants will join one new team
              {maxTeamSize ? ` (maximum ${maxTeamSize} members)` : ''}. The first selected becomes team leader.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2 p-4 sm:p-6'>
            <Label className='text-sm font-semibold text-foreground'>Team name</Label>
            <Input className={inputClass} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
          <div className='flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:p-6'>
            <Button variant='ghost' className='text-muted-foreground' disabled={busy} onClick={() => setGroupOpen(false)}>
              Cancel
            </Button>
            <Button disabled={busy || !teamName.trim()} onClick={submitGroup}>
              {busy ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Create team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
