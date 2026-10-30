'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, Copy, ExternalLink, Loader2 } from 'lucide-react'
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
import { adminService, type AdminHackathonWinner } from '@/lib/api/admin'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { cn } from '@/lib/utils'

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

const IS_TESTNET = (process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ?? 'Test SDF Network').includes('Test SDF Network')
const explorerTxUrl = (hash: string) =>
  `https://stellar.expert/explorer/${IS_TESTNET ? 'testnet' : 'public'}/tx/${hash}`
// Only link values that look like a Stellar transaction hash; anything else is a free-form reference.
const isStellarTxHash = (value: string) => /^[0-9a-f]{64}$/i.test(value)

const errorMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  if (Array.isArray(message)) return message.join('. ')
  return typeof message === 'string' && message ? message : fallback
}

// Where to send the prize: the user's saved default payout address, otherwise their platform wallet.
const payoutAddress = (winner: AdminHackathonWinner) => {
  const preferred = winner.user.payoutMethods.find((m) => m.isDefault) ?? winner.user.payoutMethods[0]
  if (preferred) return { address: preferred.publicKey, label: `Payout address “${preferred.name}”` }
  if (winner.user.wallet) return { address: winner.user.wallet.publicKey, label: 'Platform wallet' }
  return null
}

const shorten = (value: string) => (value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value)

type StepState = 'done' | 'current' | 'upcoming'

function Step({
  number,
  state,
  title,
  children,
}: {
  number: number
  state: StepState
  title: string
  children?: React.ReactNode
}) {
  return (
    <li className='flex gap-3'>
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          state === 'done' && 'bg-green-500/20 text-green-400',
          state === 'current' && 'bg-primary text-primary-foreground',
          state === 'upcoming' && 'bg-muted text-muted-foreground'
        )}
      >
        {state === 'done' ? <Check className='h-4 w-4' /> : number}
      </span>
      <div className='min-w-0 flex-1 space-y-1 pb-1'>
        <p className={cn('text-sm font-medium', state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground')}>
          {title}
        </p>
        {children && <div className='text-xs text-muted-foreground'>{children}</div>}
      </div>
    </li>
  )
}

interface Props {
  hackathonId: string
  status?: string
  deadlineLabel?: string
  prizeCount: number
  onPublish: () => void
  isPublishing: boolean
}

/**
 * Guides an admin through a MANUAL hackathon: pick winners, publish results, then pay each
 * winner outside the platform and record the payment here.
 */
export function HackathonPayoutsPanel({
  hackathonId,
  status,
  deadlineLabel,
  prizeCount,
  onPublish,
  isPublishing,
}: Props) {
  const queryClient = useQueryClient()
  const getValidStepUpToken = useAdminStore((state) => state.getValidStepUpToken)

  const [marking, setMarking] = useState<AdminHackathonWinner | null>(null)
  const [txHash, setTxHash] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<((token: string) => Promise<void>) | null>(null)

  const queryKey = ['admin-hackathon-winners', hackathonId]
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => adminService.getHackathonWinners(hackathonId),
  })

  const winners = data?.winners ?? []
  const currency = data?.hackathon.currency ?? ''
  const resultsPublished = Boolean(data?.hackathon.resultsPublished)
  const paidCount = winners.filter((w) => w.isPaid).length

  const judging = status === 'JUDGING'
  const cancelled = status === 'CANCELLED'
  const allPrizesFilled = prizeCount > 0 && winners.length >= prizeCount
  const allPaid = resultsPublished && winners.length > 0 && paidCount === winners.length

  const steps: { state: StepState; title: string; body: React.ReactNode }[] = [
    {
      state: judging || resultsPublished ? 'done' : 'current',
      title: 'Wait for submissions to close',
      body: judging || resultsPublished
        ? 'Submissions are closed.'
        : `Judging opens when submissions close${deadlineLabel ? ` on ${deadlineLabel}` : ''}.`,
    },
    {
      state: resultsPublished || allPrizesFilled ? 'done' : judging ? 'current' : 'upcoming',
      title: 'Pick a winner for every prize',
      body: (
        <>
          {winners.length} of {prizeCount} prizes have a winner. Use <span className='text-foreground'>Select Winner</span> on a
          submission in the{' '}
          <a href='#submissions' className='text-primary hover:underline'>
            submissions list
          </a>
          .
        </>
      ),
    },
    {
      state: resultsPublished ? 'done' : judging && allPrizesFilled ? 'current' : 'upcoming',
      title: 'Publish the results',
      body: resultsPublished ? (
        'Results are public. Winners can see they are awaiting payment.'
      ) : (
        <div className='space-y-2'>
          <p>Announces the winners publicly. No money is sent by the platform.</p>
          {judging && allPrizesFilled && (
            <Button size='sm' onClick={onPublish} disabled={isPublishing}>
              {isPublishing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Publish results
            </Button>
          )}
        </div>
      ),
    },
    {
      state: allPaid ? 'done' : resultsPublished ? 'current' : 'upcoming',
      title: 'Pay each winner, then mark them paid',
      body: resultsPublished
        ? `${paidCount} of ${winners.length} paid. Send each prize to the address shown below from your own wallet or bank, then click Mark paid and add the transaction hash or reference.`
        : 'After publishing, send each prize yourself and record the payment here.',
    },
  ]

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

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      setTimeout(() => setCopied((current) => (current === value ? null : current)), 1500)
    } catch {
      toast.error('Could not copy to the clipboard')
    }
  }

  const closeDialog = () => {
    setMarking(null)
    setTxHash('')
    setNote('')
  }

  const submitMarkPaid = () => {
    if (!marking) return
    const hash = txHash.trim()
    const reference = note.trim()
    if (!hash && !reference) {
      toast.error('Add the transaction hash or a payment reference')
      return
    }
    const winner = marking
    withStepUp(async (token) => {
      setBusy(true)
      try {
        await adminService.markHackathonWinnerPaid(
          hackathonId,
          winner.id,
          { txHash: hash || undefined, note: reference || undefined },
          token
        )
        toast.success('Marked as paid', {
          description: `Position #${winner.position} — ${Number(winner.prizeAmount).toLocaleString()} ${currency}`,
        })
        closeDialog()
        await Promise.all([
          queryClient.invalidateQueries({ queryKey }),
          // The public winners list shows the paid status too.
          queryClient.invalidateQueries({ queryKey: ['hackathons'] }),
        ])
      } catch (error) {
        toast.error('Could not mark the winner as paid', { description: errorMessage(error, 'Please try again.') })
      } finally {
        setBusy(false)
      }
    })
  }

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

      <CardHeader className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <CardTitle>Manual prize payouts</CardTitle>
          <p className='mt-1 text-xs text-muted-foreground'>
            Nothing is escrowed for this hackathon and the platform never sends the prizes. Follow these steps to finish it.
          </p>
        </div>
        {allPaid ? (
          <Badge className='w-fit border-0 bg-green-500/20 text-green-400 hover:bg-green-500/20'>All prizes paid</Badge>
        ) : resultsPublished && winners.length > 0 ? (
          <Badge variant='outline' className='w-fit'>
            {paidCount} of {winners.length} paid
          </Badge>
        ) : null}
      </CardHeader>

      <CardContent className='space-y-6'>
        {cancelled ? (
          <p className='text-sm text-muted-foreground'>This hackathon was cancelled, so no prizes are due.</p>
        ) : isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
          </div>
        ) : (
          <>
            <ol className='space-y-4'>
              {steps.map((step, i) => (
                <Step key={step.title} number={i + 1} state={step.state} title={step.title}>
                  {step.body}
                </Step>
              ))}
            </ol>

            {winners.length > 0 && (
              <div className='space-y-3 border-t border-border pt-4'>
                <p className='text-sm font-medium text-foreground'>Winners</p>
                {winners.map((winner) => {
                  const destination = payoutAddress(winner)
                  const reference = winner.txHash || winner.payout?.metadata?.paymentNote
                  return (
                    <div
                      key={winner.id}
                      className='flex flex-col gap-3 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
                    >
                      <div className='min-w-0 space-y-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <p className='font-medium text-foreground'>
                            #{winner.position} · {winner.user.username || winner.user.email}
                          </p>
                          {winner.submission.track && (
                            <Badge variant='secondary' className='text-xs'>
                              {winner.submission.track}
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm font-semibold text-foreground'>
                          {Number(winner.prizeAmount).toLocaleString()} {currency}
                        </p>
                        {destination ? (
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>Send to {destination.label}:</span>
                            <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-foreground'>
                              {shorten(destination.address)}
                            </code>
                            <button
                              type='button'
                              onClick={() => void copy(destination.address)}
                              className='text-muted-foreground hover:text-foreground'
                              aria-label='Copy address'
                            >
                              {copied === destination.address ? (
                                <Check className='h-3.5 w-3.5' />
                              ) : (
                                <Copy className='h-3.5 w-3.5' />
                              )}
                            </button>
                          </div>
                        ) : (
                          <p className='text-xs text-amber-400'>No wallet or payout address on file. Contact the winner.</p>
                        )}
                        {winner.isPaid && reference && (
                          <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                            Reference:{' '}
                            {winner.txHash && isStellarTxHash(winner.txHash) ? (
                              <a
                                href={explorerTxUrl(winner.txHash)}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 text-primary hover:underline'
                              >
                                {shorten(winner.txHash)}
                                <ExternalLink className='h-3 w-3' />
                              </a>
                            ) : (
                              <span className='break-all text-foreground'>{reference}</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div className='flex shrink-0 items-center gap-2'>
                        {!resultsPublished ? (
                          <Badge variant='outline' className='text-muted-foreground'>
                            Publish results first
                          </Badge>
                        ) : (
                          <>
                            <Badge
                              className={cn(
                                'border-0',
                                winner.isPaid
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                              )}
                            >
                              {winner.isPaid ? 'Paid' : 'Awaiting payment'}
                            </Badge>
                            {!winner.isPaid && (
                              <Button size='sm' onClick={() => setMarking(winner)}>
                                Mark paid
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={marking !== null} onOpenChange={(open) => !open && !busy && closeDialog()}>
        <DialogContent className='bg-card border-border sm:max-w-[480px]'>
          <DialogHeader>
            <DialogTitle>Mark prize as paid</DialogTitle>
            <DialogDescription>
              {marking
                ? `Position #${marking.position}: ${Number(marking.prizeAmount).toLocaleString()} ${currency} to ${marking.user.username || marking.user.email}. Only do this after the payment has been sent. It can't be undone.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='payout-tx-hash'>Transaction hash</Label>
              <Input
                id='payout-tx-hash'
                className={inputClass}
                placeholder='Stellar transaction hash'
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='payout-note'>Payment reference or note</Label>
              <Textarea
                id='payout-note'
                placeholder='e.g. bank transfer ID, if not paid on Stellar'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <p className='text-xs text-muted-foreground'>Provide a transaction hash, a reference, or both.</p>
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={closeDialog} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={submitMarkPaid} disabled={busy}>
                {busy && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Mark paid
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
