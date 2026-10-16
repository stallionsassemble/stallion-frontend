'use client'

import { useState } from 'react'
import { AlertCircle, Info, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ApplicationFormFields } from '@/components/hackathons/application-form-fields'
import { useApplyHackathon } from '@/lib/api/hackathon/queries'
import {
  ApplicationAnswers,
  ApplicationQuestion,
  isQuestionVisible,
  validateAnswers,
} from '@/lib/hackathon-form'

interface Props {
  isOpen: boolean
  onClose: () => void
  hackathonId: string
  hackathonTitle: string
  questions: ApplicationQuestion[]
  requiresApproval: boolean
  /** Used to prefill the email question when the user is logged in. */
  defaultEmail?: string
  defaultName?: string
}

const getApiMessage = (error: unknown) => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  if (Array.isArray(message)) return message.join('. ')
  if (typeof message === 'string' && message) return message
  return 'Something went wrong. Please try again.'
}

export function ApplyHackathonModal(props: Props) {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent className='bg-card border-border w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0'>
        {/* The body mounts only while the dialog is open, so its form state resets every time. */}
        <ApplyBody {...props} />
      </DialogContent>
    </Dialog>
  )
}

function ApplyBody({
  onClose,
  hackathonId,
  hackathonTitle,
  questions,
  requiresApproval,
  defaultEmail,
  defaultName,
}: Props) {
  const apply = useApplyHackathon()
  const [answers, setAnswers] = useState<ApplicationAnswers>(() => {
    // Prefill obvious fields from the logged-in user.
    const initial: ApplicationAnswers = {}
    for (const q of questions) {
      if (q.type === 'EMAIL' && defaultEmail) initial[q.id] = defaultEmail
      if (q.type === 'SHORT_TEXT' && defaultName && /^(full\s+)?name$/i.test(q.label.trim())) {
        initial[q.id] = defaultName
      }
    }
    return initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const submit = () => {
    setFormError(null)
    const problems = validateAnswers(questions, answers)
    setErrors(problems)
    if (Object.keys(problems).length > 0) {
      const first = questions.find((q) => problems[q.id] && isQuestionVisible(q, answers))
      if (first) document.getElementById(`application-${first.id}`)?.scrollIntoView({ block: 'center' })
      setFormError('Please fix the highlighted questions.')
      return
    }

    apply.mutate(
      { id: hackathonId, answers },
      {
        onSuccess: () => onClose(),
        onError: (error) => setFormError(getApiMessage(error)),
      }
    )
  }

  const hasQuestions = questions.length > 0

  return (
    <>
      <DialogHeader className='p-4 sm:p-6 border-b border-border text-left'>
        <DialogTitle className='text-xl sm:text-2xl font-bold text-foreground font-inter'>
          Apply to {hackathonTitle}
        </DialogTitle>
        <DialogDescription className='text-sm text-muted-foreground'>
          {requiresApproval
            ? 'Your application will be reviewed. We will email you with the decision.'
            : 'Complete the form to join. You can start building as soon as you apply.'}
        </DialogDescription>
      </DialogHeader>

      <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
        {hasQuestions ? (
          <ApplicationFormFields
            questions={questions}
            answers={answers}
            onChange={setAnswers}
            errors={errors}
            disabled={apply.isPending}
          />
        ) : (
          <div className='flex gap-2 rounded-lg bg-primary/10 p-3 text-sm text-foreground'>
            <Info className='h-4 w-4 shrink-0 mt-0.5 text-primary' />
            <p>
              {requiresApproval
                ? 'This hackathon reviews every application. Confirm below and we will let you know the decision.'
                : 'Confirm to register for this hackathon.'}
            </p>
          </div>
        )}

        {formError && (
          <div className='mt-6 flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'>
            <AlertCircle className='h-4 w-4 shrink-0 mt-0.5' />
            <p>{formError}</p>
          </div>
        )}
      </div>

      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end p-4 sm:p-6 border-t border-border'>
        <Button
          type='button'
          variant='ghost'
          className='text-muted-foreground'
          disabled={apply.isPending}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className='bg-primary hover:bg-primary/90 text-primary-foreground sm:min-w-[180px]'
          disabled={apply.isPending}
          onClick={submit}
        >
          {apply.isPending ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
          {requiresApproval ? 'Submit application' : 'Apply now'}
        </Button>
      </div>
    </>
  )
}
