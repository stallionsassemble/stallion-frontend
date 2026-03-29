import { CreateBountyModal } from '@/components/dashboard/owner/create-bounty-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useAdminBounties, useAdminBountiesStats } from '@/lib/api/admin/queries'
import { Bounty } from '@/lib/types/bounties'
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Coins,
  Download,
  Edit,
  Eye,
  Gift,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Trash2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'OPEN':
      return 'bg-green-500/20 text-green-400 border-0'
    case 'COMPLETED':
    case 'CLOSED':
      return 'bg-blue-500/20 text-blue-400 border-0'
    case 'IN_PROGRESS':
      return 'bg-amber-500/20 text-amber-400 border-0'
    case 'DISPUTED':
      return 'bg-red-500/20 text-red-400 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

// Format status for display
const formatStatus = (status: string) => {
  if (!status) return 'Unknown'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function BountyManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; bountyId: string } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  // Edit State
  const [selectedBounty, setSelectedBounty] = useState<Bounty | undefined>(
    undefined,
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: stats } = useAdminBountiesStats()

  // Fetch all bounties with pagination
  const {
    data: bountiesData,
    isLoading,
    refetch
  } = useAdminBounties({
    page: currentPage,
    limit: rowsPerPage,
    status:
      activeFilter !== 'All'
        ? (activeFilter.toUpperCase() as any)
        : undefined,
    search: searchQuery || undefined,
  })

  const bounties = bountiesData?.data || []
  const totalItems = bountiesData?.meta?.total || 0
  const totalPages = bountiesData?.meta?.totalPages || 1

  const handleEditBounty = (bounty: Bounty) => {
    if (!isStepUpValid()) {
      setSelectedBounty(bounty)
      setPendingAction({ type: 'edit', bountyId: bounty.id })
      setStepUpOpen(true)
      return
    }
    setSelectedBounty(bounty)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (bountyId: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'delete', bountyId })
      setStepUpOpen(true)
      return
    }

    const token = stepUpToken!
    const toastId = toast.loading('Deleting bounty...')
    
    try {
      await adminService.deleteBounty(bountyId, token)
      toast.success('Bounty deleted successfully', { id: toastId })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete bounty', { id: toastId })
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction?.type === 'delete') {
      handleDelete(pendingAction.bountyId)
      setPendingAction(null)
    } else if (pendingAction?.type === 'edit') {
      setIsEditModalOpen(true)
      setPendingAction(null)
    }
  }

  // Handle Export
  const handleExport = () => {
    if (!bounties.length) return

    const headers = [
      'Title',
      'Owner',
      'Status',
      'Reward',
      'Currency',
      'Deadline',
      'Applicants',
    ]
    const csvContent = [
      headers.join(','),
      ...bounties.map((b) =>
        [
          `"${(b.title || '').replace(/"/g, '""')}"`,
          `"${(b.owner?.username || b.owner?.companyName || '').replace(/"/g, '""')}"`,
          b.status,
          b.reward,
          b.rewardCurrency,
          b.submissionDeadline,
          b.submissionCount || 0,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'bounties_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            Bounty Management
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage all bounties, escrow, and milestones
          </p>
        </div>
        <Button
          className='gap-2 bg-primary hover:bg-primary/90'
          onClick={handleExport}
          disabled={!bounties.length}
        >
          <Download className='h-4 w-4' />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Active
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Gift className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.active || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Active bounties
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Completed
            </h3>
            <div className='bg-green-500/10 p-1.5 rounded-lg'>
              <CheckCircle className='w-4 h-4 text-green-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.completed || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Completed bounties
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Disputed
            </h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <AlertTriangle className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.disputed || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              In dispute
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Escrow Locked
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Coins className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {typeof stats?.escrowLocked === 'number' ? `$${stats.escrowLocked.toLocaleString()}` : stats?.escrowLocked || '$0'}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Total locked value
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search bounties by title or owner'
            className='pl-10 bg-background border-border'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {['All', 'Active', 'Completed', 'Disputed'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size='sm'
              onClick={() => {
                setActiveFilter(filter)
                setCurrentPage(1)
              }}
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
            More Filter
          </Button>
        </div>
      </div>

      {/* Bounties Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='border-border hover:bg-transparent'>
              <TableHead className='text-muted-foreground font-medium'>
                Bounty
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Owner
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Reward
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Escrow
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Deadline
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Applicants
              </TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center py-12'
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : bounties.length > 0 ? (
              bounties.map((bounty: Bounty) => (
                <TableRow
                  key={bounty.id}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell>
                    <div>
                      <div className='font-medium text-foreground text-sm'>
                        {bounty.title}
                      </div>
                      <div className='text-xs text-muted-foreground line-clamp-1'>
                        {bounty.description
                          ?.slice(0, 50)
                          .replace(/<[^>]*>/g, '')}
                        ...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-7 w-7'>
                        <AvatarImage
                          src={bounty.owner?.profilePicture}
                          alt={
                            bounty.owner?.companyName || bounty.owner?.username
                          }
                        />
                        <AvatarFallback>
                          {(
                            bounty.owner?.companyName ||
                            bounty.owner?.username ||
                            'U'
                          ).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-foreground text-sm uppercase'>
                        {bounty.owner?.companyName ||
                          bounty.owner?.username ||
                          'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(bounty.status)}>
                      {formatStatus(bounty.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-foreground text-sm font-medium'>
                    $
                    {(bounty as any).totalReward?.toLocaleString() ||
                      bounty.reward ||
                      '0'}{' '}
                    {(bounty as any).currency || bounty.rewardCurrency || 'USDC'}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    $
                    {(bounty as any).totalReward?.toLocaleString() ||
                      bounty.reward ||
                      '0'}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {bounty.submissionDeadline
                      ? new Date(bounty.submissionDeadline).toLocaleDateString()
                      : 'No deadline'}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {bounty.submissionCount || (bounty as any).applicantsCount || 0}
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
                          className='gap-2 cursor-pointer'
                          onClick={() => handleEditBounty(bounty)}
                        >
                          <Edit className='h-4 w-4' />
                          Edit Bounty
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className='gap-2 cursor-pointer'
                        >
                          <Link href={`/dashboard/bounties/${bounty.id}`}>
                            <Eye className='h-4 w-4' />
                            View Details
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer text-destructive focus:text-destructive'
                          onClick={() => handleDelete(bounty.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                          Delete Bounty
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center py-8 text-muted-foreground'
                >
                  No bounties found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Showing{' '}
            {bounties.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}{' '}
            bounties
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
                  disabled={currentPage >= totalPages}
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
                  disabled={currentPage >= totalPages}
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

      <CreateBountyModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedBounty(undefined)
        }}
        existingBounty={selectedBounty}
        isAdmin={true}
        stepUpToken={stepUpToken || undefined}
      />
    </div>
  )
}
