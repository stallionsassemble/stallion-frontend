'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TrackInputProps {
  tracks: string[]
  onChange: (tracks: string[]) => void
}

export function TrackInput({ tracks, onChange }: TrackInputProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const next = draft
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tracks.some((x) => x.toLowerCase() === t.toLowerCase()))
    if (next.length) onChange([...tracks, ...next])
    setDraft('')
  }

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          placeholder='e.g. DeFi, Payments, Tooling'
          className='h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button
          type='button'
          variant='outline'
          className='h-[42px] gap-1 border-input'
          disabled={!draft.trim()}
          onClick={add}
        >
          <Plus className='h-4 w-4' /> Add track
        </Button>
      </div>

      {tracks.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {tracks.map((track) => (
            <span
              key={track}
              className='inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-3 pr-1 text-xs font-medium text-primary'
            >
              {track}
              <button
                type='button'
                aria-label={`Remove track ${track}`}
                className='rounded-full p-1 hover:bg-primary/20'
                onClick={() => onChange(tracks.filter((t) => t !== track))}
              >
                <X className='h-3 w-3' />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className='text-xs text-muted-foreground'>No tracks yet. “Main” will be used.</p>
      )}
    </div>
  )
}
