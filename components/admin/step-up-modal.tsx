'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminService } from '@/lib/api/admin'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { startAuthentication } from '@simplewebauthn/browser'

interface StepUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (token: string) => void
}

export function StepUpModal({ open, onOpenChange, onSuccess }: StepUpModalProps) {
  const [totpCode, setTotpCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setStepUpToken = useAdminStore((state) => state.setStepUpToken)

  const handleTotpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (totpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsSubmitting(true)
    try {
      const { token, expiresInSeconds } = await adminService.stepUpTotp(totpCode)
      setStepUpToken(token, expiresInSeconds)
      onSuccess(token)
      onOpenChange(false)
      toast.success('Step-up verification successful')
      setTotpCode('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasskeyStepUp = async () => {
    setIsSubmitting(true)
    try {
      const options = await adminService.stepUpPasskeyOptions()
      const authResponse = await startAuthentication(options)
      const { token, expiresInSeconds } = await adminService.stepUpPasskeyVerify(authResponse)
      
      setStepUpToken(token, expiresInSeconds)
      onSuccess(token)
      onOpenChange(false)
      toast.success('Step-up verification successful')
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Passkey verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Admin Security Step-Up
          </DialogTitle>
          <DialogDescription>
            This is a sensitive action. Please verify your identity using your authentication app or a passkey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">TOTP Code</label>
              <Input
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || totpCode.length !== 6}
            >
              Verify with Code
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handlePasskeyStepUp}
            disabled={isSubmitting}
          >
            <KeyRound className="w-4 h-4" />
            Verify with Passkey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
