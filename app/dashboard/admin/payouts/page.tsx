"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  MoreVertical,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { useAdminPayouts, useAdminPayoutsStats } from '@/lib/api/admin/queries'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
    case 'PENDING':
      return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0'
    case 'COMPLETED':
      return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0'
    case 'FAILED':
      return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0'
    case 'BLOCKED':
      return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

export default function PayoutAdministrationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<string>('Transactions')
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; payoutId: string } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  const { data: stats } = useAdminPayoutsStats()
  
  // Map tab to status for API
  const getStatusFromTab = () => {
    switch (activeTab) {
      case 'Completed': return 'COMPLETED'
      case 'Issues': return 'FAILED'
      case 'Transactions': return undefined
      default: return undefined
    }
  }

  const { 
    data: payoutsData, 
    isLoading,
    refetch 
  } = useAdminPayouts({
    page: currentPage,
    limit: rowsPerPage,
    status: getStatusFromTab() as any,
    search: searchQuery || undefined
  })

  const payouts = payoutsData?.data || []
  const totalItems = payoutsData?.meta?.total || 0
  const totalPages = payoutsData?.meta?.totalPages || 1

  const handleRetryPayout = async (payoutId: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'retry', payoutId })
      setStepUpOpen(true)
      return
    }

    const token = stepUpToken!
    const toastId = toast.loading('Retrying payout...')
    
    try {
      await adminService.retryPayout(payoutId, token)
      toast.success('Payout retry initiated', { id: toastId })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to retry payout', { id: toastId })
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction?.type === 'retry') {
      handleRetryPayout(pendingAction.payoutId)
      setPendingAction(null)
    }
  }

  const handleViewDetails = (payout: any) => {
    setSelectedPayout(payout)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className='space-y-6'>
      <StepUpModal 
        open={stepUpOpen} 
        onOpenChange={setStepUpOpen} 
        onSuccess={onStepUpSuccess} 
      />

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>
            Payout Administration
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage payouts, approve transactions, and audit financial activity
          </p>
        </div>
        <Button className='gap-2 bg-primary hover:bg-primary/90'>
          <Download className='h-4 w-4' />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Pending Approval
            </h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <Clock className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.pendingApproval || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Awaiting approval
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Pending Amount
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <CheckCircle className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              ${(stats?.pendingAmountUsd || 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Processing payouts
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Completed (30d)
            </h3>
            <div className='bg-green-500/10 p-1.5 rounded-lg'>
              <CheckCircle className='w-4 h-4 text-green-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              ${(stats?.completed30dUsd || 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Last 30 days
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Issues
            </h3>
            <div className='bg-destructive/10 p-1.5 rounded-lg'>
              <AlertTriangle className='w-4 h-4 text-destructive' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.issues || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Requiring attention
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex items-center gap-1 border-b border-border'>
        {['Transactions', 'Completed', 'Issues', 'Audit log'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setCurrentPage(1)
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search payouts'
            className='pl-10 bg-background border-border'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {['All', 'USDC', 'USGLO', 'XLM'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }
            >
              {filter}
            </Button>
          ))}
          <Button
            variant='outline'
            size='sm'
            className='gap-2 border-border text-muted-foreground'
          >
            <SlidersHorizontal className='h-4 w-4' />
            More Filters
          </Button>
        </div>
      </div>

      {/* Payouts Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        {activeTab === 'Audit log' ? (
          /* Audit Log Table - Placeholder if not available in API */
          <div className="p-12 text-center text-muted-foreground">
            Audit logs are coming soon to the platform.
          </div>
        ) : (
          /* Regular Payouts Table */
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead className='text-muted-foreground font-medium'>
                  ID
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Contributor
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Bounty / Milestone
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Amount
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Status
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Requested
                </TableHead>
                <TableHead className='w-10'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-12'>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : payouts.length > 0 ? (
                payouts.map((payout: any) => (
                  <TableRow
                    key={payout.id}
                    className='border-border hover:bg-muted/30'
                  >
                    <TableCell className='font-medium text-foreground text-sm'>
                      {payout.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-7 w-7'>
                          <AvatarImage
                            src={payout.contributor?.profilePicture}
                            alt={payout.contributor?.username}
                          />
                          <AvatarFallback>
                            {(payout.contributor?.username || 'C').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium text-foreground text-sm'>
                            {payout.contributor?.username || 'Unknown'}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {payout.contributor?.walletAddress?.slice(0, 6)}...{payout.contributor?.walletAddress?.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='text-foreground text-sm'>
                          {payout.bounty?.title || 'Unknown Bounty'}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {payout.milestone?.title || 'No Milestone'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm font-medium'>
                      ${payout.amountUsd?.toLocaleString() || payout.amount?.toLocaleString()} {payout.token || payout.currency || 'USDC'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(payout.status)}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-foreground'
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='bg-popover border-border'
                        >
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(payout)}
                            className='gap-2 cursor-pointer'
                          >
                            <Eye className='h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          {(payout.status === 'FAILED' || activeTab === 'Issues') && (
                            <DropdownMenuItem 
                              className='gap-2 cursor-pointer'
                              onClick={() => handleRetryPayout(payout.id)}
                            >
                              <RefreshCw className='h-4 w-4' />
                              Retry
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <Trash2 className='h-4 w-4' />
                            Delete (Coming Soon)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                    No payouts found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Showing {payouts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} payouts
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(v) => {
                  setRowsPerPage(Number(v))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className='w-16 h-8 bg-background border-border'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <span>
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className='flex items-center gap-1 ml-2'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 border-border'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  <ChevronLeft className='h-4 w-4' />
                  <ChevronLeft className='h-4 w-4 -ml-2' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 border-border'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 border-border'
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 border-border'
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  <ChevronRight className='h-4 w-4' />
                  <ChevronRight className='h-4 w-4 -ml-2' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className='bg-card border-border max-w-lg p-0 overflow-hidden'>
          <DialogHeader className='p-6 pb-0'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                {selectedPayout && (
                  <Badge className={getStatusBadgeClass(selectedPayout.status)}>
                    {selectedPayout.status}
                  </Badge>
                )}
                <DialogTitle className='text-2xl font-bold text-foreground'>
                  Payout Details
                </DialogTitle>
                <p className='text-sm text-muted-foreground font-mono'>
                  {selectedPayout?.id}
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsDetailsModalOpen(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          {selectedPayout && (
            <div className='p-6 space-y-6'>
              {/* Contributor */}
              <div className='flex items-center gap-3'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage
                    src={selectedPayout.contributor?.profilePicture}
                    alt={selectedPayout.contributor?.username}
                  />
                  <AvatarFallback>
                    {(selectedPayout.contributor?.username || 'C').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-semibold text-foreground'>
                    {selectedPayout.contributor?.username || 'Unknown'}
                  </div>
                  <div className='text-sm text-muted-foreground font-mono'>
                    {selectedPayout.contributor?.walletAddress}
                  </div>
                </div>
              </div>

              {/* Bounty & Milestone */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Bounty</p>
                  <p className='text-sm text-foreground'>
                    {selectedPayout.bounty?.title || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Milestone
                  </p>
                  <p className='text-sm text-foreground'>
                    {selectedPayout.milestone?.title || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className='border-t border-border pt-4'>
                <p className='text-xs text-muted-foreground mb-1'>Amount</p>
                <div className='flex items-center gap-2'>
                  <span className='text-3xl font-bold text-foreground'>
                    ${selectedPayout.amountUsd?.toLocaleString() || selectedPayout.amount?.toLocaleString()}
                  </span>
                  <Badge
                    variant='outline'
                    className='border-primary/30 text-primary text-xs'
                  >
                    {selectedPayout.token || selectedPayout.currency || 'USDC'}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className='border-t border-border pt-4'>
                <p className='text-xs text-muted-foreground mb-2'>Timeline</p>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Requested On</span>
                  <span className='text-foreground'>{new Date(selectedPayout.createdAt).toLocaleString()}</span>
                </div>
                {selectedPayout.processedAt && (
                  <div className='flex justify-between text-sm mt-1'>
                    <span className='text-muted-foreground'>Processed At</span>
                    <span className='text-foreground'>{new Date(selectedPayout.processedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex gap-3 pt-4 border-t border-primary/20'>
                {selectedPayout.status === 'FAILED' && (
                  <Button 
                    className='flex-1 gap-2 bg-primary hover:bg-primary/90'
                    onClick={() => handleRetryPayout(selectedPayout.id)}
                  >
                    <RefreshCw className='h-4 w-4' />
                    Retry Payout
                  </Button>
                )}
                {selectedPayout.status === 'PENDING' && (
                  <p className="text-sm text-muted-foreground text-center w-full italic">
                    Payout is awaiting automatic processing or project owner action.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
