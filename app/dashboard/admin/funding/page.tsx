'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info, Loader2, Save, Trash2, Wallet } from 'lucide-react'
import { useState, useEffect } from 'react'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'

import { FundingWalletResponse } from '@/lib/types/admin'

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export default function FundingWalletPage() {
  const [loading, setLoading] = useState(true)
  const [fundingWallet, setFundingWallet] = useState<FundingWalletResponse | null>(null)
  const [newWalletId, setNewWalletId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: 'save' | 'delete' } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  const fetchFundingWallet = async () => {
    try {
      setLoading(true)
      const data = await adminService.getFundingWallet()
      setFundingWallet(data)
      setNewWalletId(data.fundingWalletId || '')
    } catch (error) {
      console.error('Failed to fetch funding wallet:', error)
      toast.error('Failed to load funding wallet configuration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFundingWallet()
  }, [])

  const handleSave = async (stepUpTokenOverride?: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'save' })
      setStepUpOpen(true)
      return
    }

    if (!newWalletId) {
      toast.error('Wallet ID cannot be empty')
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }
    setIsSaving(true)
    const toastId = toast.loading('Saving funding wallet...')

    try {
      await adminService.updateFundingWallet({ fundingWalletId: newWalletId }, token)
      toast.success('Funding wallet updated successfully', { id: toastId })
      fetchFundingWallet()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update funding wallet'), { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (stepUpTokenOverride?: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'delete' })
      setStepUpOpen(true)
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }
    setIsDeleting(true)
    const toastId = toast.loading('Deleting funding wallet...')

    try {
      await adminService.deleteFundingWallet(token)
      toast.success('Funding wallet configuration deleted', { id: toastId })
      fetchFundingWallet()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete funding wallet'), { id: toastId })
    } finally {
      setIsDeleting(false)
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction?.type === 'save') {
      handleSave(token)
    } else if (pendingAction?.type === 'delete') {
      handleDelete(token)
    }
    setPendingAction(null)
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <StepUpModal 
        open={stepUpOpen} 
        onOpenChange={setStepUpOpen} 
        onSuccess={onStepUpSuccess} 
      />

      <div>
        <h1 className='text-2xl font-bold text-foreground'>
          Funding Wallet Configuration
        </h1>
        <p className='text-sm text-muted-foreground'>
          Configure the platform&apos;s primary funding wallet for payouts and escrows
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-400 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-blue-400">Important</h4>
          <p className="text-sm text-blue-400/80">
            The funding wallet is used to route automated payments. Ensure the wallet ID is correct and the account is funded on the Stellar network.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Platform Funding Source</CardTitle>
          <CardDescription>
            Current configuration source: <span className="font-semibold text-primary uppercase">{fundingWallet?.source || 'NONE'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletId">Stellar Public Key (G...)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="walletId"
                  placeholder="GDQP2... (Stellar Public Key)"
                  className="pl-10 bg-background border-border font-mono"
                  value={newWalletId}
                  onChange={(e) => setNewWalletId(e.target.value)}
                />
              </div>
            </div>
            {fundingWallet?.source === 'env' && (
              <p className="text-xs text-amber-500 italic">
                Currently falling back to environment variable configuration. Setting a value here will override it.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => void handleDelete()}
              disabled={isDeleting || !fundingWallet?.fundingWalletId || fundingWallet.source === 'none'}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Clear Configuration
            </Button>
            <Button
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => void handleSave()}
              disabled={isSaving || !newWalletId || newWalletId === fundingWallet?.fundingWalletId}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
