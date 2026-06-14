/* eslint-disable */
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react'
import { truncateAddress } from '@/lib/stellar/contract'

interface ContractActionConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  /** Address being set — shown monospaced for visual verification */
  targetAddress: string
  /** If true, user must type "CONFIRM" before the action button enables */
  requireConfirmPhrase?: boolean
  /** Action button label */
  actionLabel?: string
  /** Loading state while the action executes */
  isLoading?: boolean
  /** Called when the user confirms */
  onConfirm: () => void | Promise<void>
  variant?: 'warning' | 'destructive'
}

export function ContractActionConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  targetAddress,
  requireConfirmPhrase = false,
  actionLabel = 'Confirm',
  isLoading = false,
  onConfirm,
  variant = 'warning',
}: ContractActionConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('')

  const isDestructive = variant === 'destructive'
  const canProceed = !requireConfirmPhrase || confirmText.trim() === 'CONFIRM'

  const handleOpenChange = (v: boolean) => {
    if (!v) setConfirmText('')
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background border-border sm:max-w-[480px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDestructive
                  ? 'bg-destructive/15'
                  : 'bg-amber-500/15'
              }`}
            >
              {isDestructive ? (
                <ShieldAlert className="h-5 w-5 text-destructive" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <DialogTitle className="text-foreground text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Address display */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            New Address
          </p>
          <div
            className={`rounded-lg border p-3 font-mono text-sm break-all ${
              isDestructive
                ? 'border-destructive/40 bg-destructive/5 text-destructive'
                : 'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400'
            }`}
          >
            {targetAddress}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Shown in full — please verify every character carefully.
          </p>
        </div>

        {/* CONFIRM gate */}
        {requireConfirmPhrase && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type{' '}
              <span className="font-mono font-bold text-foreground tracking-widest">
                CONFIRM
              </span>{' '}
              to proceed with this irreversible action:
            </p>
            <Input
              id="confirm-phrase-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="bg-background border-border font-mono tracking-widest text-center uppercase"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            disabled={!canProceed || isLoading}
            onClick={onConfirm}
            className={
              isDestructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
