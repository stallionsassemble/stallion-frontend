'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { ApplicationFormFields } from '@/components/hackathons/application-form-fields'
import {
  ApplicationAnswers,
  ApplicationQuestion,
  ApplicationQuestionType,
  EMPOWERHER_TEMPLATE,
  QUESTION_TYPE_LABELS,
  SIMPLE_APPLICATION_TEMPLATE,
  createQuestion,
  hasOptions,
} from '@/lib/hackathon-form'
import { cn } from '@/lib/utils'

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

const ADDABLE_TYPES: ApplicationQuestionType[] = [
  'SHORT_TEXT',
  'LONG_TEXT',
  'EMAIL',
  'URL',
  'NUMBER',
  'DROPDOWN',
  'SINGLE_CHOICE',
  'MULTI_CHOICE',
  'TEAM_MODE',
  'TEAM_NAME',
]

interface Props {
  questions: ApplicationQuestion[]
  onChange: (questions: ApplicationQuestion[]) => void
}

export function ApplicationFormBuilder({ questions, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewAnswers, setPreviewAnswers] = useState<ApplicationAnswers>({})

  const update = (id: string, patch: Partial<ApplicationQuestion>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const remove = (id: string) =>
    onChange(
      questions
        .filter((q) => q.id !== id)
        // Drop conditions that pointed at the removed question.
        .map((q) => (q.visibleWhen?.questionId === id ? { ...q, visibleWhen: undefined } : q))
    )

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= questions.length) return
    const next = [...questions]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const add = (type: ApplicationQuestionType) => {
    const question = createQuestion(type)
    // New questions join the section of the one before them, which keeps related questions grouped.
    const section = questions[questions.length - 1]?.section
    onChange([...questions, { ...question, section }])
    setOpenId(question.id)
  }

  const applyTemplate = (template: ApplicationQuestion[]) => {
    if (
      questions.length > 0 &&
      !window.confirm('This replaces the questions you have now. Continue?')
    ) {
      return
    }
    onChange(template.map((q) => ({ ...q })))
    setOpenId(null)
  }

  const changeType = (q: ApplicationQuestion, type: ApplicationQuestionType) => {
    const fresh = createQuestion(type)
    update(q.id, {
      type,
      options: hasOptions(type) ? (q.options && q.options.length >= 2 ? q.options : fresh.options) : undefined,
    })
  }

  const sections = Array.from(new Set(questions.map((q) => q.section).filter(Boolean))) as string[]

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type='button' variant='outline' size='sm' className='gap-1 border-input'>
              <Plus className='h-4 w-4' /> Add question
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='border-border bg-popover'>
            {ADDABLE_TYPES.map((type) => (
              <DropdownMenuItem key={type} className='cursor-pointer' onClick={() => add(type)}>
                {QUESTION_TYPE_LABELS[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type='button' variant='outline' size='sm' className='gap-1 border-input'>
              Templates <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='border-border bg-popover'>
            <DropdownMenuLabel>Start from</DropdownMenuLabel>
            <DropdownMenuItem className='cursor-pointer' onClick={() => applyTemplate(EMPOWERHER_TEMPLATE)}>
              EmpowerHer application form
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={() => applyTemplate(SIMPLE_APPLICATION_TEMPLATE)}>
              Simple form
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer text-destructive focus:text-destructive'
              onClick={() => applyTemplate([])}
            >
              Clear all questions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='ml-auto gap-1 text-muted-foreground'
          disabled={questions.length === 0}
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          {showPreview ? 'Hide preview' : 'Preview'}
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className='rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground'>
          No questions yet. Applicants will just register with one click. Add questions or start from a template.
        </div>
      ) : (
        <div className='space-y-2'>
          {questions.map((q, index) => {
            const open = openId === q.id
            const conditionCandidates = questions.slice(0, index).filter((c) => hasOptions(c.type))
            const conditionSource = conditionCandidates.find((c) => c.id === q.visibleWhen?.questionId)

            return (
              <div key={q.id} className='rounded-lg border border-border bg-muted/20'>
                <div className='flex items-center gap-2 p-2 pl-3'>
                  <button
                    type='button'
                    className='flex min-w-0 flex-1 items-center gap-2 text-left'
                    onClick={() => setOpenId(open ? null : q.id)}
                  >
                    <span className='w-5 shrink-0 text-xs text-muted-foreground'>{index + 1}</span>
                    <span className={cn('truncate text-sm font-medium', !q.label && 'text-muted-foreground')}>
                      {q.label || 'Untitled question'}
                    </span>
                    <Badge variant='secondary' className='hidden shrink-0 sm:inline-flex'>
                      {QUESTION_TYPE_LABELS[q.type]}
                    </Badge>
                    {q.required && <span className='shrink-0 text-xs text-destructive'>Required</span>}
                    {open ? (
                      <ChevronUp className='ml-auto h-4 w-4 shrink-0 text-muted-foreground' />
                    ) : (
                      <ChevronDown className='ml-auto h-4 w-4 shrink-0 text-muted-foreground' />
                    )}
                  </button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0'
                    aria-label='Move up'
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0'
                    aria-label='Move down'
                    disabled={index === questions.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive'
                    aria-label='Delete question'
                    onClick={() => remove(q.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                {open && (
                  <div className='space-y-4 border-t border-border p-3 sm:p-4'>
                    <div className='space-y-2'>
                      <Label className='text-sm font-semibold text-foreground'>Question</Label>
                      <Input
                        className={inputClass}
                        value={q.label}
                        placeholder='e.g. Full name'
                        onChange={(e) => update(q.id, { label: e.target.value })}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-semibold text-foreground'>Help text</Label>
                      <Input
                        className={inputClass}
                        value={q.helpText ?? ''}
                        placeholder='Optional hint shown under the question'
                        onChange={(e) => update(q.id, { helpText: e.target.value })}
                      />
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-semibold text-foreground'>Answer type</Label>
                        <Select value={q.type} onValueChange={(v) => changeType(q, v as ApplicationQuestionType)}>
                          <SelectTrigger className='h-[42px] w-full border-[1.19px] border-input bg-transparent text-foreground'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='border-[1.19px] border-input bg-card text-foreground'>
                            {ADDABLE_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {QUESTION_TYPE_LABELS[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label className='text-sm font-semibold text-foreground'>Section heading</Label>
                        <Input
                          className={inputClass}
                          list={`sections-${q.id}`}
                          value={q.section ?? ''}
                          placeholder='e.g. Personal information'
                          onChange={(e) => update(q.id, { section: e.target.value })}
                        />
                        <datalist id={`sections-${q.id}`}>
                          {sections.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {hasOptions(q.type) && (
                      <div className='space-y-2'>
                        <Label className='text-sm font-semibold text-foreground'>
                          {q.type === 'TEAM_MODE' ? 'The two choices' : 'Options'}
                        </Label>
                        <Textarea
                          className='min-h-[100px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground focus-visible:border-primary'
                          value={(q.options ?? []).join('\n')}
                          placeholder='One option per line'
                          onChange={(e) => update(q.id, { options: e.target.value.split('\n') })}
                        />
                        <p className='text-xs text-muted-foreground'>
                          {q.type === 'TEAM_MODE'
                            ? 'Line 1: the applicant needs a team. Line 2: the applicant has an existing team.'
                            : 'One option per line.'}
                        </p>
                      </div>
                    )}

                    <div className='flex items-center justify-between gap-4 rounded-lg border border-border p-3'>
                      <div>
                        <Label className='text-sm font-semibold text-foreground'>Required</Label>
                        <p className='text-xs text-muted-foreground'>Applicants must answer this to submit.</p>
                      </div>
                      <Switch checked={q.required} onCheckedChange={(v) => update(q.id, { required: v })} />
                    </div>

                    {conditionCandidates.length > 0 && (
                      <div className='space-y-2'>
                        <Label className='text-sm font-semibold text-foreground'>Show only when</Label>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                          <Select
                            value={q.visibleWhen?.questionId ?? 'always'}
                            onValueChange={(v) =>
                              update(q.id, {
                                visibleWhen: v === 'always' ? undefined : { questionId: v, equals: '' },
                              })
                            }
                          >
                            <SelectTrigger className='h-[42px] w-full border-[1.19px] border-input bg-transparent text-foreground'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='border-[1.19px] border-input bg-card text-foreground'>
                              <SelectItem value='always'>Always show</SelectItem>
                              {conditionCandidates.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.label || 'Untitled question'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {conditionSource && (
                            <Select
                              value={q.visibleWhen?.equals || undefined}
                              onValueChange={(v) =>
                                update(q.id, { visibleWhen: { questionId: conditionSource.id, equals: v } })
                              }
                            >
                              <SelectTrigger className='h-[42px] w-full border-[1.19px] border-input bg-transparent text-foreground'>
                                <SelectValue placeholder='is answered with…' />
                              </SelectTrigger>
                              <SelectContent className='border-[1.19px] border-input bg-card text-foreground'>
                                {(conditionSource.options ?? [])
                                  .filter((o) => o.trim())
                                  .map((o) => (
                                    <SelectItem key={o} value={o}>
                                      {o}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showPreview && questions.length > 0 && (
        <div className='space-y-3 rounded-lg border border-border p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Preview, how applicants will see it
          </p>
          <ApplicationFormFields questions={questions} answers={previewAnswers} onChange={setPreviewAnswers} />
        </div>
      )}
    </div>
  )
}
