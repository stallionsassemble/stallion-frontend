'use client'

import { useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { uploadService } from '@/lib/api/upload'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ApplicationAnswers,
  ApplicationQuestion,
  isQuestionVisible,
} from '@/lib/hackathon-form'
import { cn } from '@/lib/utils'

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

interface Props {
  questions: ApplicationQuestion[]
  answers: ApplicationAnswers
  onChange: (answers: ApplicationAnswers) => void
  errors?: Record<string, string>
  disabled?: boolean
}

const MAX_IMAGES = 5
const MAX_IMAGE_MB = 5

/** Image picker that uploads right away and keeps the list of uploaded image links as the answer. */
function ImageUploadField({
  urls,
  disabled,
  onChange,
}: {
  urls: string[]
  disabled?: boolean
  onChange: (urls: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (files.length === 0) return

    const room = MAX_IMAGES - urls.length
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_IMAGES} images`)
      return
    }
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_MB * 1024 * 1024)
    if (valid.length < files.length) toast.error(`Only images up to ${MAX_IMAGE_MB} MB are allowed`)
    const batch = valid.slice(0, room)
    if (batch.length === 0) return

    setUploading(true)
    try {
      const uploaded = await Promise.all(batch.map((file) => uploadService.uploadImage(file)))
      onChange([...urls, ...uploaded.map((u) => u.url)])
    } catch {
      toast.error('Could not upload an image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='flex flex-wrap gap-3'>
      {urls.map((url) => (
        <div key={url} className='relative h-20 w-20 overflow-hidden rounded-lg border border-border'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt='Uploaded' className='h-full w-full object-cover' />
          <button
            type='button'
            aria-label='Remove image'
            className='absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white hover:bg-black'
            onClick={() => onChange(urls.filter((u) => u !== url))}
          >
            <X className='h-3 w-3' />
          </button>
        </div>
      ))}
      {urls.length < MAX_IMAGES && (
        <label className='flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground hover:bg-muted/40'>
          {uploading ? <Loader2 className='h-5 w-5 animate-spin' /> : <ImagePlus className='h-5 w-5' />}
          <input
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            disabled={disabled || uploading}
            onChange={handleFiles}
          />
        </label>
      )}
    </div>
  )
}

/** Renders an admin-defined application form. Shared by the builder preview and the apply modal. */
export function ApplicationFormFields({ questions, answers, onChange, errors = {}, disabled }: Props) {
  const set = (id: string, value: string | string[]) => onChange({ ...answers, [id]: value })

  const visible = questions.filter((q) => isQuestionVisible(q, answers))
  const sections: { title?: string; items: ApplicationQuestion[] }[] = []
  for (const q of visible) {
    const last = sections[sections.length - 1]
    if (last && last.title === q.section) last.items.push(q)
    else sections.push({ title: q.section, items: [q] })
  }

  return (
    <div className='space-y-8'>
      {sections.map((section, i) => (
        <section key={`${section.title ?? 'section'}-${i}`} className='space-y-5'>
          {section.title && (
            <h3 className='border-b border-border pb-2 text-base font-bold text-foreground font-inter'>
              {section.title}
            </h3>
          )}
          {section.items.map((q) => {
            const value = answers[q.id]
            const text = Array.isArray(value) ? '' : (value ?? '')
            const selected = Array.isArray(value) ? value : []
            const error = errors[q.id]

            return (
              <div key={q.id} id={`application-${q.id}`} className='space-y-2'>
                <Label className='text-sm font-semibold text-foreground'>
                  {q.label} {q.required && <span className='text-destructive'>*</span>}
                </Label>
                {q.helpText && <p className='text-xs text-muted-foreground'>{q.helpText}</p>}

                {(q.type === 'SHORT_TEXT' || q.type === 'TEAM_NAME') && (
                  <Input
                    className={inputClass}
                    value={text}
                    disabled={disabled}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
                {q.type === 'EMAIL' && (
                  <Input
                    type='email'
                    className={inputClass}
                    value={text}
                    disabled={disabled}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
                {q.type === 'URL' && (
                  <Input
                    type='url'
                    placeholder='https://'
                    className={inputClass}
                    value={text}
                    disabled={disabled}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
                {q.type === 'NUMBER' && (
                  <Input
                    type='number'
                    inputMode='decimal'
                    className={inputClass}
                    value={text}
                    disabled={disabled}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
                {q.type === 'LONG_TEXT' && (
                  <Textarea
                    className='min-h-[110px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground focus-visible:border-primary'
                    value={text}
                    disabled={disabled}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
                {q.type === 'DROPDOWN' && (
                  <Select value={text || undefined} disabled={disabled} onValueChange={(v) => set(q.id, v)}>
                    <SelectTrigger className='h-[42px] w-full border-[1.19px] border-input bg-transparent text-foreground'>
                      <SelectValue placeholder='Select an option' />
                    </SelectTrigger>
                    <SelectContent className='border-[1.19px] border-input bg-card text-foreground'>
                      {(q.options || []).map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {(q.type === 'SINGLE_CHOICE' || q.type === 'TEAM_MODE') && (
                  <div className='space-y-2'>
                    {(q.options || []).map((o) => (
                      <label
                        key={o}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border border-input p-3 text-sm text-foreground transition-colors',
                          text === o && 'border-primary bg-primary/10'
                        )}
                      >
                        <input
                          type='radio'
                          name={q.id}
                          className='mt-0.5 accent-primary'
                          checked={text === o}
                          disabled={disabled}
                          onChange={() => set(q.id, o)}
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'MULTI_CHOICE' && (
                  <div className='space-y-2'>
                    {(q.options || []).map((o) => {
                      const checked = selected.includes(o)
                      return (
                        <label
                          key={o}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-lg border border-input p-3 text-sm text-foreground transition-colors',
                            checked && 'border-primary bg-primary/10'
                          )}
                        >
                          <input
                            type='checkbox'
                            className='mt-0.5 accent-primary'
                            checked={checked}
                            disabled={disabled}
                            onChange={() =>
                              set(q.id, checked ? selected.filter((s) => s !== o) : [...selected, o])
                            }
                          />
                          <span>{o}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.type === 'IMAGE_UPLOAD' && (
                  <ImageUploadField urls={selected} disabled={disabled} onChange={(urls) => set(q.id, urls)} />
                )}

                {error && <p className='text-xs text-destructive'>{error}</p>}
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
