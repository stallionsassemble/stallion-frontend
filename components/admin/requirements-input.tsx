'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  requirements: string[]
  onChange: (requirements: string[]) => void
}

/** One line per requirement. Blank lines are dropped when the form is submitted. */
export function RequirementsInput({ requirements, onChange }: Props) {
  const update = (index: number, value: string) =>
    onChange(requirements.map((r, i) => (i === index ? value : r)))

  return (
    <div className='space-y-2'>
      {requirements.map((requirement, index) => (
        <div key={index} className='flex items-center gap-2'>
          <Input
            aria-label={`Requirement ${index + 1}`}
            placeholder='e.g. Open to builders with a Stellar wallet'
            className='h-[42px] min-w-0 flex-1 rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'
            value={requirement}
            maxLength={300}
            onChange={(e) => update(index, e.target.value)}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='shrink-0 text-muted-foreground hover:text-destructive'
            aria-label='Remove requirement'
            onClick={() => onChange(requirements.filter((_, i) => i !== index))}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='gap-1 border-input'
        disabled={requirements.length >= 30}
        onClick={() => onChange([...requirements, ''])}
      >
        <Plus className='h-4 w-4' /> Add requirement
      </Button>
    </div>
  )
}
