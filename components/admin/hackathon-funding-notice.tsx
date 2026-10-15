'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react'
import { walletService } from '@/lib/api/wallet'
import { cn } from '@/lib/utils'

const CONTRACT_FEE = 0.05
// Stellar keeps a minimum balance locked in every account, plus headroom for network fees.
const XLM_LOCKED_AND_FEES = 1.6

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 7 })

interface Props {
  budget: number
  asset: string
}

export function HackathonFundingNotice({ budget, asset }: Props) {
  const { data: wallet } = useQuery({
    queryKey: ['admin-own-wallet'],
    queryFn: () => walletService.getWallet(),
  })
  const { data: balances, isLoading } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: () => walletService.getWalletBalances(),
  })

  const hasBudget = Number.isFinite(budget) && budget > 0
  const isXlm = asset.toUpperCase() === 'XLM'
  const escrow = hasBudget ? budget * (1 + CONTRACT_FEE) : 0

  const held = (code: string) =>
    Number(balances?.balances?.find((b) => b.currency?.toUpperCase() === code.toUpperCase())?.availableBalance ?? 0)

  const assetHeld = held(asset)
  const xlmHeld = held('XLM')

  // XLM hackathons need everything in XLM; other assets need their own balance plus XLM for fees.
  const assetNeeded = isXlm ? escrow + XLM_LOCKED_AND_FEES : escrow
  const assetShort = hasBudget ? Math.max(0, assetNeeded - assetHeld) : 0
  const xlmShort = !isXlm ? Math.max(0, XLM_LOCKED_AND_FEES - xlmHeld) : 0
  const ready = hasBudget && !isLoading && assetShort === 0 && xlmShort === 0
  const short = hasBudget && !isLoading && !ready

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border p-3 text-xs text-foreground sm:p-4',
        short ? 'border-destructive/40 bg-destructive/10' : ready ? 'border-green-500/40 bg-green-500/10' : 'border-border bg-primary/10'
      )}
    >
      <div className='flex items-center gap-2 text-sm font-semibold'>
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : short ? (
          <AlertTriangle className='h-4 w-4 text-destructive' />
        ) : ready ? (
          <CheckCircle2 className='h-4 w-4 text-green-500' />
        ) : (
          <Info className='h-4 w-4 text-primary' />
        )}
        {short ? 'Your admin wallet needs more funds' : ready ? 'Your admin wallet has enough funds' : 'Funding required to create this hackathon'}
      </div>

      <ul className='list-disc space-y-1 pl-5 text-muted-foreground'>
        <li>
          Creating it <span className='text-foreground'>locks the whole budget in escrow</span> from your admin wallet
          {hasBudget ? (
            <>
              : <span className='text-foreground'>{fmt(budget)} {asset}</span> + 5% platform fee ={' '}
              <span className='font-semibold text-foreground'>{fmt(escrow)} {asset}</span>.
            </>
          ) : (
            <>, plus a 5% platform fee. Enter a budget to see the exact amount.</>
          )}
        </li>
        <li>
          {isXlm ? (
            <>
              Stellar also keeps about <span className='text-foreground'>1.5 XLM</span> locked in the account and you need a little for
              network fees, so the wallet needs about{' '}
              <span className='font-semibold text-foreground'>{hasBudget ? `${fmt(assetNeeded)} XLM` : 'budget + 5% + 1.6 XLM'}</span> in total.
            </>
          ) : (
            <>
              The wallet needs a <span className='text-foreground'>{asset} trustline</span> and about{' '}
              <span className='font-semibold text-foreground'>1.6 XLM</span> for Stellar’s locked minimum balance and network fees.
            </>
          )}
        </li>
        <li>
          This same wallet also pays the 2.5 XLM activation grants for new users, so its XLM drains over time. Keep it topped
          up, or set a separate funding wallet under <span className='text-foreground'>Admin → Funding</span>.
        </li>
      </ul>

      {hasBudget && !isLoading && (
        <div className='rounded-md bg-background/60 p-2 font-medium'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{asset} available</span>
            <span>{fmt(assetHeld)}</span>
          </div>
          {!isXlm && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>XLM available</span>
              <span>{fmt(xlmHeld)}</span>
            </div>
          )}
          {assetShort > 0 && (
            <p className='mt-1 text-destructive'>
              Add at least {fmt(assetShort)} more {asset}
              {wallet?.publicKey ? ' to the address below.' : '.'}
            </p>
          )}
          {xlmShort > 0 && (
            <p className='mt-1 text-destructive'>Add at least {fmt(xlmShort)} more XLM for fees.</p>
          )}
        </div>
      )}

      {wallet?.publicKey && (
        <p className='break-all text-muted-foreground'>
          Admin wallet: <code className='text-foreground'>{wallet.publicKey}</code>
        </p>
      )}
    </div>
  )
}
