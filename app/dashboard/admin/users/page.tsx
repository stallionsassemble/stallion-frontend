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
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// Types
interface User {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  dateOpened: string
  role: 'Contributor' | 'Project Owner' | 'Admin'
  status: 'Active' | 'Flagged' | 'Suspended' | 'Banned'
  reputation: number
  bounties: number
  earnings: string
  lastActive: string
}

// Mock Data - Extended to match design
const mockUsers: User[] = Array.from({ length: 68 }, (_, i) => ({
  id: i + 1,
  name: [
    'Alex Chen',
    'Jane Doe',
    'John Smith',
    'Sarah Williams',
    'Mike Johnson',
  ][i % 5],
  username: ['@alexchen', '@janedoe', '@johnsmith', '@sarahw', '@mikej'][i % 5],
  email: [
    'alex@email.com',
    'jane@email.com',
    'john@email.com',
    'sarah@email.com',
    'mike@email.com',
  ][i % 5],
  avatar: '/assets/icons/sdollar.png',
  dateOpened: '2024-02-10',
  role: (['Contributor', 'Project Owner', 'Admin'] as const)[i % 3],
  status:
    i % 12 === 0
      ? 'Banned'
      : i % 7 === 0
        ? 'Suspended'
        : i % 5 === 0
          ? 'Flagged'
          : 'Active',
  reputation: Number((3.5 + Math.random() * 1.5).toFixed(1)),
  bounties: Math.floor(Math.random() * 50),
  earnings: `$${(Math.random() * 50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
  lastActive: ['2 hours ago', '1 day ago', '3 days ago', '1 week ago'][i % 4],
}))

// Stats calculations
const totalUsers = mockUsers.length
const activeUsers = mockUsers.filter((u) => u.status === 'Active').length
const suspendedUsers = mockUsers.filter((u) => u.status === 'Suspended').length
const bannedUsers = mockUsers.filter((u) => u.status === 'Banned').length

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/20 text-green-400 border-0'
    case 'Flagged':
      return 'bg-amber-500/20 text-amber-400 border-0'
    case 'Suspended':
      return 'bg-orange-500/20 text-orange-400 border-0'
    case 'Banned':
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

  // Filter users based on role and search
  const filteredUsers = useMemo(() => {
    let result = mockUsers

    // Filter by role
    if (activeFilter === 'Talents') {
      result = result.filter((u) => u.role === 'Contributor')
    } else if (activeFilter === 'Project Owners') {
      result = result.filter((u) => u.role === 'Project Owner')
    } else if (activeFilter === 'Admins') {
      result = result.filter((u) => u.role === 'Admin')
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query),
      )
    }

    return result
  }, [activeFilter, searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage,
  )

  // Reset page when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className='space-y-6'>
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
        <Button className='gap-2 bg-primary hover:bg-primary/90'>
          <Download className='h-4 w-4' />
          Export Users
        </Button>
      </div>

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
              {totalUsers}
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
              {activeUsers}
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
              {suspendedUsers}
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
              {bannedUsers}
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
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {['All', 'Talents', 'Project Owners', 'Admins'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleFilterChange(filter)}
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
                Date Opened
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium text-foreground text-sm'>
                          {user.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.dateOpened}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className='border-border text-muted-foreground font-normal'
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.reputation}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.bounties}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.earnings}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {user.lastActive}
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
                        {user.status === 'Active' && (
                          <DropdownMenuItem className='gap-2 cursor-pointer text-amber-500 focus:text-amber-500'>
                            <ShieldAlert className='h-4 w-4' />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {user.status !== 'Banned' && (
                          <DropdownMenuItem className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <Ban className='h-4 w-4' />
                            Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                          <Trash2 className='h-4 w-4' />
                          Delete User
                        </DropdownMenuItem>
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
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + rowsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
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
