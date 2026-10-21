'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Download, ExternalLink, FileText, Loader2, Trophy, Users } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LinkifiedText } from '@/components/ui/linkified-text'
import { useGetBounty, useGetBountyWinners, useGetSubmissions } from '@/lib/api/bounties/queries'
import { exportBountySubmissionsCSV } from '@/lib/bounty-submissions-csv'

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-0',
  COMPLETED: 'bg-purple-500/20 text-purple-400 border-0',
  CLOSED: 'bg-gray-500/20 text-gray-400 border-0',
  PENDING: 'bg-amber-500/20 text-amber-400 border-0',
  UNDER_REVIEW: 'bg-blue-500/20 text-blue-400 border-0',
  IN_REVIEW: 'bg-blue-500/20 text-blue-400 border-0',
  ACCEPTED: 'bg-green-500/20 text-green-400 border-0',
  WINNER: 'bg-green-500/20 text-green-400 border-0',
  REJECTED: 'bg-red-500/20 text-red-400 border-0',
}

const formatDate = (value?: string | null) => {
  const date = value ? new Date(value) : null
  return date && !isNaN(date.getTime()) ? format(date, 'MMM d, yyyy') : 'N/A'
}

const displayName = (user?: any) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.username ||
  user?.companyName ||
  user?.email ||
  'Unknown user'

const asText = (value: unknown) => (Array.isArray(value) ? value.join(', ') : value == null ? '' : String(value))

export default function AdminBountyDetailsPage() {
  const params = useParams<{ id: string | string[] }>()
  const bountyId = Array.isArray(params.id) ? params.id[0] : params.id

  const { data: bounty, isLoading } = useGetBounty(bountyId)
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useGetSubmissions(bountyId)
  const { data: winnersData } = useGetBountyWinners(bountyId)
  const [viewing, setViewing] = useState<any | null>(null)

  const submissions: any[] = Array.isArray(submissionsData) ? submissionsData : (submissionsData as any)?.data ?? []
  const winners: any[] = (winnersData as any)?.winners ?? []
  // Labels for the owner-defined submission fields, so answers read as "GitHub repo" not "githubRepo".
  const fieldLabels = new Map<string, string>(((bounty as any)?.submissionFields ?? []).map((f: any) => [f.name, f.label]))

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (!bounty) {
    return (
      <div className='space-y-4'>
        <Link href='/dashboard/admin/bounties' className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='h-4 w-4' /> Back to Bounties
        </Link>
        <Card className='border-border bg-card'>
          <CardContent className='py-16 text-center text-muted-foreground'>Bounty not found.</CardContent>
        </Card>
      </div>
    )
  }

  const b = bounty as any
  const answers = (submission: any): [string, string][] =>
    Object.entries((submission?.submissionData ?? {}) as Record<string, unknown>)
      .map(([key, value]): [string, string] => [fieldLabels.get(key) ?? key, asText(value)])
      .filter(([, value]) => value)

  return (
    <div className='space-y-6'>
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className='max-h-[90dvh] w-[calc(100%-1.5rem)] overflow-y-auto border-border bg-card sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Submission by {displayName(viewing?.user)}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className='space-y-4 text-sm'>
              <div className='flex flex-wrap items-center gap-2 text-muted-foreground'>
                <Badge className={STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING}>{viewing.status}</Badge>
                <span>Submitted {formatDate(viewing.createdAt)}</span>
                {viewing.user?.email && <span>· {viewing.user.email}</span>}
              </div>
              {viewing.submissionLink && (
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Submission link</p>
                  <LinkifiedText text={viewing.submissionLink} />
                </div>
              )}
              {answers(viewing).map(([label, value]) => (
                <div key={label}>
                  <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{label}</p>
                  <LinkifiedText text={value} />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className='space-y-3'>
        <Link href='/dashboard/admin/bounties' className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='h-4 w-4' /> Back to Bounties
        </Link>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-2xl font-bold text-foreground break-words'>{b.title}</h1>
          <Badge className={STATUS_STYLES[b.status] ?? STATUS_STYLES.CLOSED}>{b.status}</Badge>
          <Button asChild variant='outline' size='sm' className='ml-auto gap-2'>
            <Link href={`/dashboard/bounties/${b.id}`} target='_blank'>
              <ExternalLink className='h-4 w-4' /> Public page
            </Link>
          </Button>
        </div>
        {b.shortDescription && <p className='max-w-3xl text-sm text-muted-foreground'>{b.shortDescription}</p>}
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[
          { label: 'Submissions', value: submissions.length.toLocaleString(), icon: FileText },
          { label: 'Applicants', value: Number(b.applicationCount ?? 0).toLocaleString(), icon: Users },
          { label: 'Reward', value: `${Number(b.reward || 0).toLocaleString()} ${b.rewardCurrency ?? ''}`, icon: Trophy },
          { label: 'Deadline', value: formatDate(b.submissionDeadline), icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className='border-border bg-card'>
            <CardContent className='flex items-center justify-between p-5'>
              <div className='min-w-0'>
                <p className='text-sm text-muted-foreground'>{label}</p>
                <p className='truncate text-xl font-bold text-foreground'>{value}</p>
              </div>
              <Icon className='h-5 w-5 shrink-0 text-primary' />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <Card className='border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle>Submissions</CardTitle>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              disabled={submissions.length === 0}
              onClick={() => exportBountySubmissionsCSV(b, submissions)}
            >
              <Download className='h-4 w-4' /> Export CSV
            </Button>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isLoadingSubmissions ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
              </div>
            ) : submissions.length === 0 ? (
              <p className='rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground'>
                No submissions yet.
              </p>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className='flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center'
                >
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <Avatar className='h-9 w-9 shrink-0'>
                      <AvatarImage src={submission.user?.profilePicture ?? undefined} />
                      <AvatarFallback>{displayName(submission.user).charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-foreground'>{displayName(submission.user)}</p>
                      <p className='truncate text-xs text-muted-foreground'>
                        {submission.user?.email} · {formatDate(submission.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge className={STATUS_STYLES[submission.status] ?? STATUS_STYLES.PENDING}>{submission.status}</Badge>
                    {submission.submissionLink && (
                      <Button asChild size='sm' variant='outline'>
                        <a href={submission.submissionLink} target='_blank' rel='noopener noreferrer'>
                          Open <ExternalLink className='ml-1 h-3.5 w-3.5' />
                        </a>
                      </Button>
                    )}
                    <Button size='sm' variant='ghost' onClick={() => setViewing(submission)}>
                      View details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card className='border-border bg-card'>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm text-muted-foreground'>
              <div>
                <p className='font-medium text-foreground'>Owner</p>
                <p>{displayName(b.owner)}</p>
              </div>
              <div>
                <p className='font-medium text-foreground'>Created</p>
                <p>{formatDate(b.createdAt)}</p>
              </div>
              {b.judgingDeadline && (
                <div>
                  <p className='font-medium text-foreground'>Judging deadline</p>
                  <p>{formatDate(b.judgingDeadline)}</p>
                </div>
              )}
              {Array.isArray(b.skills) && b.skills.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-1'>
                  {b.skills.map((skill: string) => (
                    <Badge key={skill} variant='secondary'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='border-border bg-card'>
            <CardHeader>
              <CardTitle>Winners</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {winners.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No winners have been announced yet.</p>
              ) : (
                winners.map((winner) => (
                  <div key={winner.userId} className='flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm'>
                    <span className='truncate font-medium text-foreground'>
                      #{winner.position} {displayName(winner)}
                    </span>
                    <span className='shrink-0 text-muted-foreground'>
                      {Number(winner.amountWon ?? 0).toLocaleString()} {winner.currency ?? b.rewardCurrency}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
