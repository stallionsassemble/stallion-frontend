'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, Copy, ExternalLink, Loader2, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { walletService } from '@/lib/api/wallet'

const EXPLORER_URL = 'https://stellar.expert/explorer/public/account'

export function AdminWalletCard() {
  const [copied, setCopied] = useState(false)

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['admin-own-wallet'],
    queryFn: () => walletService.getWallet(),
  })

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: () => walletService.getWalletBalances(),
  })

  const assets = balances?.balances ?? []
  const publicKey = wallet?.publicKey

  const copy = async () => {
    if (!publicKey) return
    try {
      await navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable; the address is still selectable
    }
  }

  return (
    <Card className='bg-card border-border'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
          <Wallet className='h-4 w-4 text-primary' />
          Admin wallet (funds hackathon escrow)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {walletLoading ? (
          <Loader2 className='h-5 w-5 animate-spin text-primary' />
        ) : publicKey ? (
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <code className='flex-1 break-all rounded-md bg-muted/40 px-3 py-2 text-xs text-foreground'>
              {publicKey}
            </code>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' className='gap-1.5' onClick={copy}>
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant='outline' size='sm' className='gap-1.5' asChild>
                <a href={`${EXPLORER_URL}/${publicKey}`} target='_blank' rel='noreferrer'>
                  <ExternalLink className='h-4 w-4' />
                  Explorer
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No wallet found for this account.</p>
        )}

        {balancesLoading ? null : assets.length > 0 ? (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {assets.map((a) => (
              <div key={a.currency} className='rounded-lg border border-border bg-background/40 p-3'>
                <p className='text-xs text-muted-foreground'>{a.currency}</p>
                <p className='text-base font-semibold text-foreground'>
                  {Number(a.availableBalance ?? a.balance ?? 0).toLocaleString(undefined, {
                    maximumFractionDigits: 7,
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No balances yet. Deposit USDC and a little XLM to this address to fund hackathons.</p>
        )}
      </CardContent>
    </Card>
  )
}
