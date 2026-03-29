'use client'

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
import {
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreVertical,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  Users,
  Loader2,
  ShieldCheck,
  KeyIcon,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAdminUsers, useAdminUsersStats } from '@/lib/api/admin/queries'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { InviteUserModal } from '@/components/admin/invite-user-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400 border-0'
    case 'SUSPENDED':
      return 'bg-orange-500/20 text-orange-400 border-0'
    case 'BANNED':
      return 'bg-red-500/20 text-red-400 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  
  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; userId: string; data?: any } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  const handleInviteUser = () => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'invite', userId: 'new' })
      setStepUpOpen(true)
      return
    }
    setIsInviteModalOpen(true)
  }

  const { data: stats, isLoading: statsLoading } = useAdminUsersStats()
  
  const roleFilter = activeFilter === 'Talents' ? 'CONTRIBUTOR' : 
                     activeFilter === 'Project Owners' ? 'PROJECT_OWNER' : 
                     activeFilter === 'Admins' ? 'ADMIN' : undefined

  const { data: usersData, isLoading: usersLoading, refetch } = useAdminUsers({
    page: currentPage,
    limit: rowsPerPage,
    role: roleFilter,
    search: searchQuery || undefined
  })

  const users = usersData?.data || []
  const meta = usersData?.meta
  const totalPages = meta?.totalPages || 0

  const handleAction = async (type: string, userId: string, data?: any) => {
    if (!isStepUpValid()) {
      setPendingAction({ type, userId, data })
      setStepUpOpen(true)
      return
    }

    const token = stepUpToken!
    const toastId = toast.loading(`Performing action...`)
    
    try {
      if (type === 'suspend') {
        await adminService.suspendUser(userId, data || { reason: 'Administrative action' }, token)
        toast.success('User suspended successfully', { id: toastId })
      } else if (type === 'ban') {
        await adminService.banUser(userId, data || { reason: 'Administrative action' }, token)
        toast.success('User banned successfully', { id: toastId })
      } else if (type === 'make-admin') {
        await adminService.makeAdmin(userId, token)
        toast.success('User role updated to Admin', { id: toastId })
      } else if (type === 'reset-2fa') {
        await adminService.reset2fa(userId, token)
        toast.success('2FA reset successfully', { id: toastId })
      }
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed', { id: toastId })
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction) {
      handleAction(pendingAction.type, pendingAction.userId, pendingAction.data)
      setPendingAction(null)
    }
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
            User Management
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage platform users, roles, and permissions
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button 
            className='gap-2 bg-primary hover:bg-primary/90'
            onClick={handleInviteUser}
          >
            <UserPlus className='h-4 w-4' />
            Invite User
          </Button>
          <Button variant="outline" className='gap-2 border-border'>
            <Download className='h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      <InviteUserModal 
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSuccess={refetch}
        stepUpToken={stepUpToken}
      />

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Users
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Users className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalUsers || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Platform registered users
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Active Users
            </h3>
            <div className='bg-green-500/10 p-1.5 rounded-lg'>
              <UserCheck className='w-4 h-4 text-green-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.activeUsers || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Currently active
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Suspended Users
            </h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <ShieldAlert className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.suspendedUsers || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Temporarily restricted
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Banned Users
            </h3>
            <div className='bg-destructive/10 p-1.5 rounded-lg'>
              <AlertTriangle className='w-4 h-4 text-destructive' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.bannedUsers || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Permanently banned
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by name, username, or email'
            className='pl-10 bg-background border-border'
            value={searchQuery}
            onChange={(e) => {
               setSearchQuery(e.target.value)
               setCurrentPage(1)
            }}
          />
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {['All', 'Talents', 'Project Owners', 'Admins'].map((filter) => (
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

      {/* Users Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='border-border hover:bg-transparent'>
              <TableHead className='text-muted-foreground font-medium'>
                Users
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Date Joined
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Role
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Reputation
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Bounties
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Earnings
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Last Active
              </TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? (
               <TableRow>
                 <TableCell colSpan={9} className="text-center py-10">
                   <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                 </TableCell>
               </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.profilePicture} alt={user.firstName} />
                        <AvatarFallback>{(user.firstName || user.username || '?').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium text-foreground text-sm'>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className='border-border text-muted-foreground font-normal'
                    >
                      {user.role || 'CONTRIBUTOR'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(user.status || 'ACTIVE')}>
                      {user.status || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.reputationRating || 0}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.bountiesParticipated || 0}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    ${(user.earningsUsd || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'Never'}
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
                          asChild
                          className='gap-2 cursor-pointer'
                        >
                          <Link href={`/dashboard/profile/${user.id}`}>
                            <Eye className='h-4 w-4' />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer'
                          onClick={() => handleAction('reset-2fa', user.id)}
                        >
                           <KeyIcon className='h-4 w-4 text-amber-500' />
                           Reset 2FA
                        </DropdownMenuItem>

                        {user.role !== 'ADMIN' && (
                          <DropdownMenuItem 
                            className='gap-2 cursor-pointer'
                            onClick={() => handleAction('make-admin', user.id)}
                          >
                             <ShieldCheck className='h-4 w-4 text-blue-500' />
                             Make Admin
                          </DropdownMenuItem>
                        )}

                        {user.status === 'ACTIVE' && (
                          <DropdownMenuItem 
                            className='gap-2 cursor-pointer text-amber-500 focus:text-amber-500'
                            onClick={() => handleAction('suspend', user.id)}
                          >
                            <ShieldAlert className='h-4 w-4' />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {(user.status as string) !== 'BANNED' && (
                          <DropdownMenuItem 
                            className='gap-2 cursor-pointer text-destructive focus:text-destructive'
                            onClick={() => handleAction('ban', user.id)}
                          >
                            <Ban className='h-4 w-4' />
                            Ban User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='text-center py-8 text-muted-foreground'
                >
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, meta?.total || 0)} of{' '}
            {meta?.total || 0} users
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
    </div>
  )
}
