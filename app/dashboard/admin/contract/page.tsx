/* eslint-disable */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Wallet,
  RefreshCw,
  Copy,
  CheckCheck,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Settings,
  ChevronRight,
  BadgeCheck,
  BadgeX,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ContractActionConfirmDialog } from '@/components/admin/contract-action-confirm-dialog'
import { useStellarWallet } from '@/lib/store/use-stellar-wallet'
import {
  connectWallet,
  signTransaction as signTx,
} from '@/lib/stellar/wallet-kit'
import {
  readContractAdmin,
  readFeeAccount,
  buildUpdateAdminTx,
  buildUpdateFeeAccountTx,
  submitSignedTx,
  isValidStellarAddress,
  truncateAddress,
  STELLAR_CONTRACT_ID,
  STELLAR_NETWORK_PASSPHRASE,
} from '@/lib/stellar/contract'

// ---------------------------------------------------------------------------
// Sub-component: wallet address badge
// ---------------------------------------------------------------------------
function AddressBadge({ address, label }: { address: string | null; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!address) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3">
        <span className="text-sm text-muted-foreground italic">Not available</span>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-4 py-3 transition-colors hover:bg-muted/20">
      <span className="font-mono text-xs text-foreground break-all flex-1">{address}</span>
      <button
        onClick={copy}
        title={`Copy ${label}`}
        className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: status indicator
// ---------------------------------------------------------------------------
function ConnectionStatus({
  isConnected,
  address,
  isAdminVerified,
  adminMismatchWarning,
  onConnect,
  onDisconnect,
  isConnecting,
}: {
  isConnected: boolean
  address: string | null
  isAdminVerified: boolean
  adminMismatchWarning: boolean
  onConnect: () => void
  onDisconnect: () => void
  isConnecting: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* Top accent bar */}
      <div
        className={`h-1 w-full transition-all duration-700 ${
          isConnected && isAdminVerified
            ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-600'
            : isConnected && adminMismatchWarning
            ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600'
            : isConnected
            ? 'bg-gradient-to-r from-blue-500 via-primary to-blue-600'
            : 'bg-border'
        }`}
      />

      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: status */}
          <div className="flex items-center gap-4">
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                isConnected && isAdminVerified
                  ? 'border-green-500/40 bg-green-500/10'
                  : isConnected && adminMismatchWarning
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : isConnected
                  ? 'border-primary/40 bg-primary/10'
                  : 'border-border bg-muted/20'
              }`}
            >
              <Wallet
                className={`h-7 w-7 transition-colors ${
                  isConnected && isAdminVerified
                    ? 'text-green-500'
                    : isConnected && adminMismatchWarning
                    ? 'text-amber-500'
                    : isConnected
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              />
              {isConnected && (
                <span
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                    isAdminVerified ? 'bg-green-500' : adminMismatchWarning ? 'bg-amber-500' : 'bg-primary'
                  }`}
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {isConnected ? 'Wallet Connected' : 'No Wallet Connected'}
                </h3>
                {isConnected && isAdminVerified && (
                  <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 text-[10px] gap-1">
                    <BadgeCheck className="h-3 w-3" /> Admin Verified
                  </Badge>
                )}
                {isConnected && adminMismatchWarning && (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] gap-1">
                    <BadgeX className="h-3 w-3" /> Not Contract Admin
                  </Badge>
                )}
              </div>
              {isConnected && address ? (
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                >
                  {truncateAddress(address, 8)}
                  {copied ? (
                    <CheckCheck className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              ) : (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Connect your admin Stellar wallet to manage the contract
                </p>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex gap-2">
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="border-border text-muted-foreground hover:text-foreground gap-2"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={onConnect}
                disabled={isConnecting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold"
                id="connect-wallet-btn"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mismatch warning */}
        {isConnected && adminMismatchWarning && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/8 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-semibold">Warning:</span> The connected wallet does not match
              the on-chain admin address. Write operations will fail unless you connect the correct
              admin wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: contract info card
// ---------------------------------------------------------------------------
function ContractInfoCard({
  onChainAdmin,
  onChainFeeAccount,
  isLoadingChain,
  onRefresh,
}: {
  onChainAdmin: string | null
  onChainFeeAccount: string | null
  isLoadingChain: boolean
  onRefresh: () => void
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              On-Chain Contract State
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Live data from the Stallion smart contract
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoadingChain}
            title="Refresh from chain"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingChain ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin Address
          </Label>
          {isLoadingChain ? (
            <div className="h-11 animate-pulse rounded-lg bg-muted/30" />
          ) : (
            <AddressBadge address={onChainAdmin} label="Admin Address" />
          )}
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Fee Account
          </Label>
          {isLoadingChain ? (
            <div className="h-11 animate-pulse rounded-lg bg-muted/30" />
          ) : (
            <AddressBadge address={onChainFeeAccount} label="Fee Account" />
          )}
        </div>

        {STELLAR_CONTRACT_ID && (
          <>
            <Separator className="bg-border/50" />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contract ID
              </Label>
              <AddressBadge address={STELLAR_CONTRACT_ID} label="Contract ID" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: update form
// ---------------------------------------------------------------------------
function UpdateAddressForm({
  title,
  description,
  currentAddress,
  onSubmit,
  isLoading,
  isDisabled,
  disabledReason,
  confirmDialogTitle,
  confirmDialogDescription,
  requireConfirmPhrase,
  confirmActionLabel,
  confirmVariant,
  inputId,
}: {
  title: string
  description: string
  currentAddress: string | null
  onSubmit: (newAddress: string) => void
  isLoading: boolean
  isDisabled: boolean
  disabledReason?: string
  confirmDialogTitle: string
  confirmDialogDescription: string
  requireConfirmPhrase?: boolean
  confirmActionLabel: string
  confirmVariant?: 'warning' | 'destructive'
  inputId: string
}) {
  const [newAddress, setNewAddress] = useState('')
  const [touched, setTouched] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isValidInput = isValidStellarAddress(newAddress)
  const isSameAsCurrent = newAddress.trim() === currentAddress
  const showError = touched && newAddress.length > 0 && (!isValidInput || isSameAsCurrent)

  const errorMessage = isSameAsCurrent
    ? 'New address is the same as the current one'
    : 'Invalid Stellar address — must start with G and be 56 characters'

  const canSubmit = isValidInput && !isSameAsCurrent && !isDisabled && !isLoading

  return (
    <>
      <Card className="bg-card border-border overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current value */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Current Value
            </Label>
            <AddressBadge address={currentAddress} label="Current address" />
          </div>

          <Separator className="bg-border/50" />

          {/* Input */}
          <div className="space-y-1.5">
            <Label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              New Address
            </Label>
            <div className="relative">
              <Input
                id={inputId}
                value={newAddress}
                onChange={(e) => {
                  setNewAddress(e.target.value)
                  if (!touched) setTouched(true)
                }}
                onBlur={() => setTouched(true)}
                placeholder="G…"
                className={`h-12 font-mono text-sm bg-background border pr-10 transition-colors ${
                  showError
                    ? 'border-destructive focus-visible:ring-destructive/30'
                    : isValidInput && newAddress
                    ? 'border-green-500/50 focus-visible:ring-green-500/20'
                    : 'border-border'
                }`}
                spellCheck={false}
                autoComplete="off"
                disabled={isDisabled || isLoading}
              />
              {newAddress && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidInput && !isSameAsCurrent ? (
                    <CheckCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {showError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errorMessage}
              </p>
            )}
            {isDisabled && disabledReason && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {disabledReason}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!canSubmit}
            className="w-full h-11 font-bold gap-2 group"
            id={`submit-${inputId}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Transaction…
              </>
            ) : (
              <>
                {title}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <ContractActionConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={confirmDialogTitle}
        description={confirmDialogDescription}
        targetAddress={newAddress}
        requireConfirmPhrase={requireConfirmPhrase}
        actionLabel={confirmActionLabel}
        isLoading={isLoading}
        onConfirm={() => {
          setShowConfirm(false)
          onSubmit(newAddress.trim())
          setNewAddress('')
          setTouched(false)
        }}
        variant={confirmVariant}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ContractManagementPage() {
  const {
    address: connectedAddress,
    isAdminVerified,
    adminMismatchWarning,
    setAddress,
    setIsConnecting,
    setAdminVerified,
    setAdminMismatchWarning,
    disconnect,
  } = useStellarWallet()

  const [isConnecting, setIsConnectingLocal] = useState(false)
  const [onChainAdmin, setOnChainAdmin] = useState<string | null>(null)
  const [onChainFeeAccount, setOnChainFeeAccount] = useState<string | null>(null)
  const [isLoadingChain, setIsLoadingChain] = useState(false)
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false)
  const [isUpdatingFee, setIsUpdatingFee] = useState(false)

  // ── Fetch on-chain state ──────────────────────────────────────────────────
  const fetchChainState = useCallback(async () => {
    if (!STELLAR_CONTRACT_ID) return
    setIsLoadingChain(true)
    try {
      const [admin, fee] = await Promise.all([readContractAdmin(), readFeeAccount()])
      setOnChainAdmin(admin)
      setOnChainFeeAccount(fee)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingChain(false)
    }
  }, [])

  // Verify connected address against on-chain admin
  const verifyAdminAddress = useCallback(
    (addr: string, onChainAdminAddr: string | null) => {
      if (!onChainAdminAddr) return
      if (addr === onChainAdminAddr) {
        setAdminVerified(true)
        setAdminMismatchWarning(false)
      } else {
        setAdminVerified(false)
        setAdminMismatchWarning(true)
      }
    },
    [setAdminVerified, setAdminMismatchWarning],
  )

  // On mount: fetch chain state and re-verify if already connected
  useEffect(() => {
    fetchChainState().then(() => {
      if (connectedAddress) {
        verifyAdminAddress(connectedAddress, onChainAdmin)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-verify whenever chain state or connected address changes
  useEffect(() => {
    if (connectedAddress && onChainAdmin) {
      verifyAdminAddress(connectedAddress, onChainAdmin)
    }
  }, [connectedAddress, onChainAdmin, verifyAdminAddress])

  // ── Wallet connect ────────────────────────────────────────────────────────
  const handleConnect = async () => {
    try {
      setIsConnectingLocal(true)
      const addr = await connectWallet()
      setAddress(addr)
      toast.success('Wallet connected', {
        description: truncateAddress(addr, 8),
      })
      // Verify after connecting
      if (onChainAdmin) {
        verifyAdminAddress(addr, onChainAdmin)
      } else {
        // Try to fetch admin now
        const admin = await readContractAdmin()
        setOnChainAdmin(admin)
        verifyAdminAddress(addr, admin)
      }
    } catch (error) {
      const err = error as Error
      // User dismissed the modal — not an error worth toasting
      if (err?.message?.includes('User') || err?.message?.includes('cancel')) return
      toast.error('Failed to connect wallet', { description: err?.message })
    } finally {
      setIsConnectingLocal(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.info('Wallet disconnected')
  }

  // ── Explorer URL helper ───────────────────────────────────────────────────
  const getExplorerUrl = (hash: string) => {
    const isTestnet = STELLAR_NETWORK_PASSPHRASE.includes('Test SDF Network')
    return `https://stellar.expert/explorer/${isTestnet ? 'testnet' : 'public'}/tx/${hash}`
  }

  // ── Update admin ──────────────────────────────────────────────────────────
  const handleUpdateAdmin = async (newAdmin: string) => {
    if (!connectedAddress) return
    setIsUpdatingAdmin(true)
    try {
      toast.loading('Building transaction…', { id: 'update-admin' })
      const txXdr = await buildUpdateAdminTx(connectedAddress, newAdmin)

      toast.loading('Waiting for wallet signature…', { id: 'update-admin' })
      const signedXdr = await signTx(txXdr, connectedAddress, STELLAR_NETWORK_PASSPHRASE)

      toast.loading('Submitting to Stellar network…', { id: 'update-admin' })
      const result = await submitSignedTx(signedXdr)

      if (result.success) {
        toast.success('Admin address updated!', {
          id: 'update-admin',
          description: `Transaction: ${truncateAddress(result.hash ?? '', 8)}`,
          action: {
            label: 'View Explorer',
            onClick: () => window.open(getExplorerUrl(result.hash as string), '_blank'),
          },
          duration: 10000,
        })
        await fetchChainState()
        // Disconnect because admin control has changed
        disconnect()
      } else {
        toast.error('Transaction failed', {
          id: 'update-admin',
          description: result.error,
        })
      }
    } catch (error) {
      const err = error as Error
      toast.error('Failed to update admin', {
        id: 'update-admin',
        description: err?.message ?? 'Unknown error',
      })
    } finally {
      setIsUpdatingAdmin(false)
    }
  }

  // ── Update fee account ────────────────────────────────────────────────────
  const handleUpdateFeeAccount = async (newFeeAccount: string) => {
    if (!connectedAddress) return
    setIsUpdatingFee(true)
    try {
      toast.loading('Building transaction…', { id: 'update-fee' })
      const txXdr = await buildUpdateFeeAccountTx(connectedAddress, newFeeAccount)

      toast.loading('Waiting for wallet signature…', { id: 'update-fee' })
      const signedXdr = await signTx(txXdr, connectedAddress, STELLAR_NETWORK_PASSPHRASE)

      toast.loading('Submitting to Stellar network…', { id: 'update-fee' })
      const result = await submitSignedTx(signedXdr)

      if (result.success) {
        toast.success('Fee account updated!', {
          id: 'update-fee',
          description: `Transaction: ${truncateAddress(result.hash ?? '', 8)}`,
          action: {
            label: 'View Explorer',
            onClick: () => window.open(getExplorerUrl(result.hash as string), '_blank'),
          },
          duration: 10000,
        })
        await fetchChainState()
      } else {
        toast.error('Transaction failed', {
          id: 'update-fee',
          description: result.error,
        })
      }
    } catch (error) {
      const err = error as Error
      toast.error('Failed to update fee account', {
        id: 'update-fee',
        description: err?.message ?? 'Unknown error',
      })
    } finally {
      setIsUpdatingFee(false)
    }
  }

  const isConnected = !!connectedAddress
  const writeActionsDisabled = !isConnected
  const writeDisabledReason = !isConnected
    ? 'Connect your admin wallet first to perform this action'
    : undefined

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Contract Management</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Contract Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
          Connect your Stellar admin wallet to perform privileged operations on the Stallion
          smart contract — such as transferring admin control or updating the platform fee
          account.
        </p>
      </div>

      {/* No contract ID warning */}
      {!STELLAR_CONTRACT_ID && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/8 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Contract ID not configured
            </p>
            <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-500">
              Set <code className="font-mono">NEXT_PUBLIC_STELLAR_CONTRACT_ID</code> in your{' '}
              <code className="font-mono">.env</code> file to enable contract interactions.
              On-chain reads and writes will not work until this is set.
            </p>
          </div>
        </div>
      )}

      {/* Wallet connection panel */}
      <ConnectionStatus
        isConnected={isConnected}
        address={connectedAddress}
        isAdminVerified={isAdminVerified}
        adminMismatchWarning={adminMismatchWarning}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      {/* On-chain info */}
      <ContractInfoCard
        onChainAdmin={onChainAdmin}
        onChainFeeAccount={onChainFeeAccount}
        isLoadingChain={isLoadingChain}
        onRefresh={fetchChainState}
      />

      {/* ── Write actions ─────────────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">Admin Actions</h2>
          {!isConnected && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
              Wallet required
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {/* Change admin */}
          <UpdateAddressForm
            title="Transfer Admin Control"
            description="Change the admin address that controls privileged operations on this contract. This action transfers full control — make absolutely sure the address is correct."
            currentAddress={onChainAdmin}
            onSubmit={handleUpdateAdmin}
            isLoading={isUpdatingAdmin}
            isDisabled={writeActionsDisabled}
            disabledReason={writeDisabledReason}
            confirmDialogTitle="Transfer Admin Control"
            confirmDialogDescription="You are about to transfer admin control of the Stallion smart contract to a new address. This action is irreversible. Once submitted, the current wallet will no longer have admin privileges."
            requireConfirmPhrase={true}
            confirmActionLabel="Transfer Admin"
            confirmVariant="destructive"
            inputId="new-admin-address"
          />

          {/* Change fee account */}
          <UpdateAddressForm
            title="Update Fee Account"
            description="Change the address that receives platform fees from bounty and project creations. The new address must differ from the current fee account."
            currentAddress={onChainFeeAccount}
            onSubmit={handleUpdateFeeAccount}
            isLoading={isUpdatingFee}
            isDisabled={writeActionsDisabled}
            disabledReason={writeDisabledReason}
            confirmDialogTitle="Update Fee Account"
            confirmDialogDescription="You are about to change the platform fee account to a new address. All future platform fees will be routed to this address. Verify it carefully — fees cannot be retrieved if sent to a wrong address."
            requireConfirmPhrase={false}
            confirmActionLabel="Update Fee Account"
            confirmVariant="warning"
            inputId="new-fee-account-address"
          />
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
        <p>
          All write operations require your wallet's signature and are executed directly on the
          Stellar blockchain. Transactions are irreversible once confirmed. The contract enforces
          admin-only access — submitting from a non-admin wallet will fail on-chain.
        </p>
      </div>
    </div>
  )
}
