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
import { useAdminProjects, useAdminProjectsStats } from '@/lib/api/admin/queries'
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Trash2,
  Loader2,
  Star,
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
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

export default function ProjectManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; projectId: string; data?: any } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  const { data: stats } = useAdminProjectsStats()

  const {
    data: projectsData,
    isLoading,
    refetch
  } = useAdminProjects({
    page: currentPage,
    limit: rowsPerPage,
    status: activeFilter !== 'All' ? activeFilter.toUpperCase() : undefined,
    search: searchQuery || undefined,
  })

  const projects = projectsData?.data || []
  const totalItems = projectsData?.meta?.total || 0
  const totalPages = projectsData?.meta?.totalPages || 1

  const handleDelete = async (projectId: string, stepUpTokenOverride?: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'delete', projectId })
      setStepUpOpen(true)
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }
    const toastId = toast.loading('Deleting project...')
    
    try {
      await adminService.deleteProject(projectId, token)
      toast.success('Project deleted successfully', { id: toastId })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete project', { id: toastId })
    }
  }

  const handleFeature = async (projectId: string, isFeatured: boolean, stepUpTokenOverride?: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'feature', projectId, data: { isFeatured } })
      setStepUpOpen(true)
      return
    }

    const token = stepUpTokenOverride || stepUpToken
    if (!token) {
      toast.error('Step-up verification required')
      return
    }
    const toastId = toast.loading(isFeatured ? 'Featuring project...' : 'Unfeaturing project...')
    
    try {
      await adminService.featureProject(projectId, isFeatured, token)
      toast.success(isFeatured ? 'Project featured' : 'Project unfeatured', { id: toastId })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed', { id: toastId })
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction?.type === 'delete') {
      handleDelete(pendingAction.projectId, token)
    } else if (pendingAction?.type === 'feature') {
      handleFeature(pendingAction.projectId, pendingAction.data.isFeatured, token)
    }
    setPendingAction(null)
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
            Project Management
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage all projects, applications, and payouts
          </p>
        </div>
        <Button
          className='gap-2 bg-primary hover:bg-primary/90'
          onClick={() => toast.info('Exporting...')}
        >
          <Download className='h-4 w-4' />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>Active</h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Briefcase className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>{stats?.active || 0}</span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>Ongoing projects</div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>Completed</h3>
            <div className='bg-green-500/10 p-1.5 rounded-lg'>
              <CheckCircle className='w-4 h-4 text-green-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>{stats?.completed || 0}</span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>Successfully delivered</div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>Total Prize Pool</h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <Star className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              ${(typeof stats?.escrowLocked === 'number' ? stats.escrowLocked : 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>Across all projects</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search projects by title or owner'
            className='pl-10 bg-background border-border'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {['All', 'Active', 'Completed', 'Cancelled'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size='sm'
              onClick={() => {
                setActiveFilter(filter)
                setCurrentPage(1)
              }}
              className={activeFilter === filter ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='border-border hover:bg-transparent'>
              <TableHead className='text-muted-foreground font-medium'>Project</TableHead>
              <TableHead className='text-muted-foreground font-medium'>Owner</TableHead>
              <TableHead className='text-muted-foreground font-medium'>Status</TableHead>
              <TableHead className='text-muted-foreground font-medium'>Reward</TableHead>
              <TableHead className='text-muted-foreground font-medium'>Deadline</TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-12'>
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : projects.length > 0 ? (
              projects.map((project: any) => (
                <TableRow key={project.id} className='border-border hover:bg-muted/30'>
                  <TableCell>
                    <div>
                      <div className='font-medium text-foreground text-sm flex items-center gap-2'>
                        {project.title}
                        {project.isFeatured && <Badge className="bg-amber-500/20 text-amber-500 border-0 h-4 px-1 text-[10px]">FEATURED</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-7 w-7'>
                        <AvatarImage src={project.owner?.profilePicture} alt={project.owner?.username} />
                        <AvatarFallback>{(project.owner?.username || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className='text-foreground text-sm'>@{project.owner?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-foreground text-sm font-medium'>
                    ${(project.reward || 0).toLocaleString()} {project.rewardCurrency || 'USDC'}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='bg-popover border-border'>
                        <DropdownMenuItem asChild className='gap-2 cursor-pointer'>
                          <Link href={`/dashboard/projects/${project.id}`}>
                            <Eye className='h-4 w-4' /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer'
                          onClick={() => handleFeature(project.id, !project.isFeatured)}
                        >
                          <Star className='h-4 w-4 text-amber-500' />
                          {project.isFeatured ? 'Unfeature' : 'Feature Project'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer text-destructive focus:text-destructive'
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className='h-4 w-4' /> Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination placeholder */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex items-center gap-2'>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
