'use client'

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
  X
} from 'lucide-react'
import { useState } from 'react'

// Types
interface Payout {
  id: string
  contributor: {
    name: string
    wallet: string
    avatar: string
  }
  bounty: {
    title: string
    milestone: string
  }
  amount: string
  currency: string
  status: 'Approved' | 'Pending' | 'Completed' | 'Failed' | 'Blocked'
  requested: string
  timeline?: string
}

interface AuditLogEntry {
  timestamp: string
  action: 'Failed' | 'Blocked' | 'Approved' | 'Completed'
  payoutId: string
  admin: string
  amount: string
  currency: string
  details: string
}

// Mock Data for different tabs
const transactionsPayouts: Payout[] = Array.from({ length: 68 }, (_, i) => ({
  id: `TR0000${i + 2}`,
  contributor: {
    name: 'John Doe',
    wallet: 'GDQP2...X7K9',
    avatar: '/assets/icons/sdollar.png',
  },
  bounty: {
    title: 'Smart Contract Security Audit',
    milestone: 'Milestone 2: Code Review',
  },
  amount: '$30,000',
  currency: 'USDC',
  status: i % 3 === 0 ? 'Approved' : 'Pending',
  requested: '2024-02-10',
  timeline: '2024-01-15 14:30',
}))

const completedPayouts: Payout[] = Array.from({ length: 4 }, (_, i) => ({
  id: `TR0000${i + 2}`,
  contributor: {
    name: 'John Doe',
    wallet: 'GDQP2...X7K9',
    avatar: '/assets/icons/sdollar.png',
  },
  bounty: {
    title: 'Smart Contract Security Audit',
    milestone: 'Milestone 2: Code Review',
  },
  amount: '$30,000',
  currency: 'USDC',
  status: 'Completed',
  requested: '2024-02-10',
  timeline: '2024-01-15 14:30',
}))

const issuesPayouts: Payout[] = [
  {
    id: 'TR00002',
    contributor: {
      name: 'John Doe',
      wallet: 'GDQP2...X7K9',
      avatar: '/assets/icons/sdollar.png',
    },
    bounty: {
      title: 'Smart Contract Security Audit',
      milestone: 'Milestone 2: Code Review',
    },
    amount: '$30,000',
    currency: 'USDC',
    status: 'Failed',
    requested: '2024-02-10',
    timeline: '2024-01-15 14:30',
  },
  {
    id: 'TR00002',
    contributor: {
      name: 'John Doe',
      wallet: 'GDQP2...X7K9',
      avatar: '/assets/icons/sdollar.png',
    },
    bounty: {
      title: 'Smart Contract Security Audit',
      milestone: 'Milestone 2: Code Review',
    },
    amount: '$30,000',
    currency: 'USDC',
    status: 'Blocked',
    requested: '2024-02-10',
    timeline: '2024-01-15 14:30',
  },
]

// Audit Log Data
const auditLogData: AuditLogEntry[] = [
  {
    timestamp: '2024-01-15 14:35',
    action: 'Failed',
    payoutId: 'TR00002',
    admin: 'John Doe',
    amount: '$30,000',
    currency: 'USDC',
    details: 'Approved payout PAY-003 after verification',
  },
  {
    timestamp: '2024-01-15 14:35',
    action: 'Blocked',
    payoutId: 'TR00002',
    admin: 'John Doe',
    amount: '$30,000',
    currency: 'USDC',
    details: 'Approved payout PAY-003 after verification',
  },
  {
    timestamp: '2024-01-15 14:35',
    action: 'Approved',
    payoutId: 'TR00002',
    admin: 'John Doe',
    amount: '$30,000',
    currency: 'USDC',
    details: 'Approved payout PAY-003 after verification',
  },
  {
    timestamp: '2024-01-15 14:35',
    action: 'Completed',
    payoutId: 'TR00002',
    admin: 'John Doe',
    amount: '$30,000',
    currency: 'USDC',
    details: 'Approved payout PAY-003 after verification',
  },
]

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
    case 'Pending':
      return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0'
    case 'Completed':
      return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0'
    case 'Failed':
      return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0'
    case 'Blocked':
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
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Get data based on active tab
  const getPayoutsForTab = () => {
    switch (activeTab) {
      case 'Completed':
        return completedPayouts
      case 'Issues':
        return issuesPayouts
      default:
        return transactionsPayouts
    }
  }

  const currentPayouts = getPayoutsForTab()
  const totalPages = Math.ceil(currentPayouts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedPayouts = currentPayouts.slice(
    startIndex,
    startIndex + rowsPerPage,
  )

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className='space-y-6'>
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
              3
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
              $156K
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
              $122K
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
              8
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
            placeholder='Search bounties'
            className='pl-10 bg-background border-border'
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
          /* Audit Log Table */
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead className='text-muted-foreground font-medium'>
                  Timestamp
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Action
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Payout ID
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Admin
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Amount
                </TableHead>
                <TableHead className='text-muted-foreground font-medium'>
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogData.map((entry, index) => (
                <TableRow
                  key={`audit-${index}`}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell className='text-muted-foreground text-sm'>
                    {entry.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(entry.action)}>
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-medium text-foreground text-sm'>
                    {entry.payoutId}
                  </TableCell>
                  <TableCell className='text-foreground text-sm'>
                    {entry.admin}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {entry.amount} {entry.currency}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {entry.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              {paginatedPayouts.map((payout, index) => (
                <TableRow
                  key={`${payout.id}-${index}`}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell className='font-medium text-foreground text-sm'>
                    {payout.id}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-7 w-7'>
                        <AvatarImage
                          src={payout.contributor.avatar}
                          alt={payout.contributor.name}
                        />
                        <AvatarFallback>
                          {payout.contributor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium text-foreground text-sm'>
                          {payout.contributor.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {payout.contributor.wallet}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='text-foreground text-sm'>
                        {payout.bounty.title}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {payout.bounty.milestone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {payout.amount} {payout.currency}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {payout.requested}
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
                        {activeTab === 'Issues' ? (
                          <DropdownMenuItem className='gap-2 cursor-pointer'>
                            <RefreshCw className='h-4 w-4' />
                            Retry
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className='gap-2 cursor-pointer'>
                            <CheckCircle className='h-4 w-4' />
                            Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                          <Trash2 className='h-4 w-4' />
                          Delete Bounty
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            0 of {currentPayouts.length} row(s) selected.
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
                <p className='text-sm text-muted-foreground'>
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
                    src={selectedPayout.contributor.avatar}
                    alt={selectedPayout.contributor.name}
                  />
                  <AvatarFallback>
                    {selectedPayout.contributor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-semibold text-foreground'>
                    {selectedPayout.contributor.name}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedPayout.contributor.wallet}
                  </div>
                </div>
              </div>

              {/* Bounty & Milestone */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Bounty</p>
                  <p className='text-sm text-foreground'>
                    {selectedPayout.bounty.title}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Milestone
                  </p>
                  <p className='text-sm text-foreground'>
                    {selectedPayout.bounty.milestone}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className='border-t border-border pt-4'>
                <p className='text-xs text-muted-foreground mb-1'>Amount</p>
                <div className='flex items-center gap-2'>
                  <span className='text-3xl font-bold text-foreground'>
                    $3,500
                  </span>
                  <Badge
                    variant='outline'
                    className='border-primary/30 text-primary text-xs'
                  >
                    {selectedPayout.currency}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className='border-t border-border pt-4'>
                <p className='text-xs text-muted-foreground mb-2'>Timeline</p>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Milestone One</span>
                  <span className='text-foreground'>2024-01-15 14:30</span>
                </div>
                <div className='flex justify-between text-sm mt-1'>
                  <span className='text-muted-foreground'></span>
                  <span className='text-foreground'>2024-01-15 14:30</span>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-3 pt-4 border-t border-primary/20'>
                <Button
                  variant='outline'
                  className='flex-1 gap-2 border-border'
                >
                  <Ban className='h-4 w-4' />
                  Block
                </Button>
                <Button className='flex-1 gap-2 bg-primary hover:bg-primary/90'>
                  <CheckCircle className='h-4 w-4' />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
