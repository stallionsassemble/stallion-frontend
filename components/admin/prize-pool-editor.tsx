'use client'

import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export type PrizeEntry = { position: number; amount: number; track?: string }

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

export const ordinal = (n: number) => {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

/**
 * The contract only knows flat, unique positions (1..N). Per-track prizes keep that: positions are
 * numbered across all tracks in track order, and each prize carries its track as extra data.
 */
export function renumberPrizes(pool: PrizeEntry[], tracks: string[]): PrizeEntry[] {
  const tracked = pool.some((p) => p.track)
  const ordered = tracked
    ? [...pool].sort((a, b) => tracks.indexOf(a.track ?? '') - tracks.indexOf(b.track ?? ''))
    : pool
  return ordered.map((p, i) => ({ ...p, position: i + 1 }))
}

interface Props {
  prizePool: PrizeEntry[]
  tracks: string[]
  asset: string
  budget: number
  onChange: (pool: PrizeEntry[]) => void
}

export function PrizePoolEditor({ prizePool: rawPrizePool, tracks, asset, budget, onChange }: Props) {
  // Guard against a malformed value so the editor can never crash the whole modal.
  const prizePool = Array.isArray(rawPrizePool) ? rawPrizePool : []
  const perTrack = prizePool.some((p) => p.track)
  const total = prizePool.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const remaining = Math.round((budget - total) * 1e7) / 1e7

  const setAmount = (index: number, amount: number) =>
    onChange(prizePool.map((p, i) => (i === index ? { ...p, amount } : p)))

  const add = (track?: string) => onChange(renumberPrizes([...prizePool, { position: 0, amount: 0, track }], tracks))

  const remove = (index: number) => onChange(renumberPrizes(prizePool.filter((_, i) => i !== index), tracks))

  const setMode = (enabled: boolean) => {
    if (enabled) {
      // One empty prize per track to start from.
      onChange(renumberPrizes(tracks.map((track) => ({ position: 0, amount: 0, track })), tracks))
    } else {
      onChange(renumberPrizes(prizePool.map((p) => ({ position: p.position, amount: p.amount })), tracks))
    }
  }

  const splitEvenly = () => {
    if (!(budget > 0) || prizePool.length === 0) return
    const n = prizePool.length
    const each = Math.floor((budget / n) * 1e7) / 1e7
    const next = prizePool.map((p) => ({ ...p, amount: each }))
    // The rounding remainder goes to the first prize so the total matches the budget exactly.
    next[0].amount = Math.round((budget - each * (n - 1)) * 1e7) / 1e7
    onChange(next)
  }

  const row = (prize: PrizeEntry, index: number, rank: number) => (
    <div key={index} className='flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2 pl-3'>
      <Badge className='w-12 shrink-0 justify-center border-0 bg-primary/10 text-primary hover:bg-primary/10'>
        {ordinal(rank)}
      </Badge>
      <Input
        type='number'
        inputMode='decimal'
        min='0'
        aria-label={`Prize for ${ordinal(rank)} place${prize.track ? ` in ${prize.track}` : ''}`}
        placeholder='Amount'
        className={cn(inputClass, 'min-w-0 flex-1')}
        value={prize.amount || ''}
        onChange={(e) => setAmount(index, parseFloat(e.target.value) || 0)}
      />
      <span className='hidden w-12 text-xs text-muted-foreground sm:block'>{asset}</span>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='shrink-0 text-muted-foreground hover:text-destructive'
        aria-label='Remove position'
        disabled={prizePool.length <= 1}
        onClick={() => remove(index)}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  )

  return (
    <div className='space-y-3'>
      {tracks.length > 0 && (
        <div className='flex items-center justify-between gap-4 rounded-lg border border-border p-3'>
          <div>
            <Label className='text-sm font-semibold text-foreground'>Prizes per track</Label>
            <p className='text-xs text-muted-foreground'>
              Give each track its own prize positions. Winners are picked within their own track.
            </p>
          </div>
          <Switch checked={perTrack} onCheckedChange={setMode} />
        </div>
      )}

      <div className='flex items-center justify-between gap-2'>
        <Label className='text-sm font-semibold text-foreground'>
          Prize positions <span className='text-destructive'>*</span>
        </Label>
        {!perTrack && (
          <Button type='button' variant='outline' size='sm' className='gap-1 border-input' onClick={() => add()}>
            <Plus className='h-4 w-4' /> Add position
          </Button>
        )}
      </div>

      {perTrack ? (
        <div className='space-y-4'>
          {tracks.map((track) => {
            const entries = prizePool.map((p, index) => ({ p, index })).filter(({ p }) => p.track === track)
            return (
              <div key={track} className='space-y-2'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='text-sm font-semibold text-foreground'>{track}</p>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-7 gap-1 px-2 text-xs text-primary'
                    onClick={() => add(track)}
                  >
                    <Plus className='h-3.5 w-3.5' /> Add position
                  </Button>
                </div>
                {entries.length === 0 ? (
                  <p className='rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground'>
                    No prizes for this track.
                  </p>
                ) : (
                  entries.map(({ p, index }, rank) => row(p, index, rank + 1))
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className='space-y-2'>{prizePool.map((p, index) => row(p, index, index + 1))}</div>
      )}

      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p
          className={cn(
            'text-xs',
            remaining === 0 && budget > 0 ? 'text-green-500' : remaining < 0 ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          Allocated {total} of {budget || 0} {asset}
          {budget > 0 &&
            (remaining === 0
              ? ' — fully allocated'
              : remaining > 0
                ? ` — ${remaining} left`
                : ` — over by ${Math.abs(remaining)}`)}
        </p>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-7 px-2 text-xs text-primary'
          disabled={!(budget > 0)}
          onClick={splitEvenly}
        >
          Split evenly
        </Button>
      </div>
    </div>
  )
}
