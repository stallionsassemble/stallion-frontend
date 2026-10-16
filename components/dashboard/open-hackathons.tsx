'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, Calendar, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetHackathons } from '@/lib/api/hackathon/queries'

type HackathonSummary = {
  id: string
  title: string
  slug?: string
  type?: string
  deadline?: string
  totalBudget?: number | string
  asset?: string
  currency?: string
  requiresApproval?: boolean
}

/** Published hackathons on the contributor dashboard, so they are easy to find and apply to. */
export function OpenHackathons() {
  const { data, isLoading } = useGetHackathons({ status: 'PUBLISHED', limit: 3 })
  const hackathons = ((data as unknown as { data?: HackathonSummary[] })?.data ?? []).slice(0, 3)

  if (!isLoading && hackathons.length === 0) return null

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold text-foreground font-inter'>Open Hackathons</h2>
        <Link href='/hackathons' className='flex items-center gap-1 text-sm text-primary hover:underline'>
          View all <ArrowRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {isLoading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className='h-32 rounded-xl' />)
          : hackathons.map((h) => {
              const deadline = h.deadline ? new Date(h.deadline) : null
              return (
                <Link
                  key={h.id}
                  href={`/hackathons/${h.slug || h.id}`}
                  className='group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='line-clamp-2 text-sm font-semibold text-foreground'>{h.title}</h3>
                    {h.type && (
                      <Badge variant='secondary' className='shrink-0 capitalize'>
                        {h.type.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <div className='mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Trophy className='h-3.5 w-3.5 text-primary' />
                      {Number(h.totalBudget || 0).toLocaleString()} {h.asset || h.currency || 'USDC'}
                    </span>
                    {deadline && !Number.isNaN(deadline.getTime()) && (
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5' />
                        {format(deadline, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
      </div>
    </section>
  )
}
