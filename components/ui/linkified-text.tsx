import { Fragment } from 'react'
import { cn } from '@/lib/utils'

// http(s) links and bare www. links. Anything else (javascript:, data:) is left as plain text.
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/

/** Renders text with every web link turned into a clickable, safe external link. */
export function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN)

  return (
    <span className={cn('whitespace-pre-wrap break-words', className)}>
      {parts.map((part, index) => {
        // split() with a capture group puts the links at the odd positions.
        if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>

        const trailing = part.match(TRAILING_PUNCTUATION)?.[0] ?? ''
        const url = trailing ? part.slice(0, -trailing.length) : part
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`
        return (
          <Fragment key={index}>
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='break-all text-primary underline underline-offset-2 hover:opacity-80'
            >
              {url}
            </a>
            {trailing}
          </Fragment>
        )
      })}
    </span>
  )
}
