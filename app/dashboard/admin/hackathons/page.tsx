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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  StopCircle,
  Trophy,
  Users,
  X,
  Loader2,
  Check,
  ChevronsUpDown,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useAdminHackathons, useAdminHackathonsStats, useAdminUsers } from '@/lib/api/admin/queries'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'
import { exportToCSV } from '@/lib/csv'
import { useAuth } from '@/lib/store/use-auth'
import { AdminHackathon } from '@/lib/types/admin'
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type HackathonAdminListItem = AdminHackathon

type HackathonPrize = {
  position: number
  amount: number
}

type HackathonFormData = {
  title: string
  slug: string
  type: 'VIRTUAL' | 'PHYSICAL'
  description: string
  deadline: string
  announcementDate: string
  totalBudget: string
  token: string
  asset: string
  deliverables: string
  tags: string
  prizePool: HackathonPrize[]
  teamBased: boolean
  maxTeamSize: string
  companyId: string
  tracks: string
}

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

// Status badge styling helper
const getStatusBadgeClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'OPEN':
    case 'PUBLISHED':
      return 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
    case 'COMPLETED':
    case 'CLOSED':
      return 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-0'
    case 'REVIEWING':
    case 'JUDGING':
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

export default function HackathonAdministrationPage() {
  const defaultFormData: HackathonFormData = {
    title: '',
    slug: '',
    type: 'VIRTUAL',
    description: '',
    deadline: '',
    announcementDate: new Date().toISOString().slice(0, 10),
    totalBudget: '',
    token: '',
    asset: 'USDC',
    deliverables: '',
    tags: '',
    prizePool: [
      { position: 1, amount: 0 },
      { position: 2, amount: 0 },
      { position: 3, amount: 0 },
    ],
    teamBased: true,
    maxTeamSize: '4',
    companyId: '',
    tracks: 'Main',
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [teamBasedParticipation, setTeamBasedParticipation] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingHackathon, setEditingHackathon] = useState<HackathonAdminListItem | null>(null)

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

  // Form State
  const [formData, setFormData] = useState(defaultFormData)
  const [userSearchOpen, setUserSearchOpen] = useState(false)

  const { user } = useAuth()

  // Fetch Project Owners for the select
  const { data: ownersData, isLoading: isLoadingOwners } = useAdminUsers({
    role: 'PROJECT_OWNER',
    limit: 100 // Get a reasonable amount of owners
  })

  const projectOwners = useMemo(() => {
    return (ownersData?.data || []).sort((a, b) => 
      (a.firstName || a.username || '').localeCompare(b.firstName || b.username || '')
    )
  }, [ownersData])

  const getOwnerDisplayName = (owner?: any) => {
    if (!owner) return "Select project owner..."
    const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ')
    return name ? `${name} (@${owner.username})` : `@${owner.username}`
  }

  const { data: stats } = useAdminHackathonsStats()
  const { 
    data: hackathonsData, 
    isLoading,
    refetch 
  } = useAdminHackathons({
    page: currentPage,
    limit: rowsPerPage,
    search: searchQuery || undefined
  })

  const hackathons: HackathonAdminListItem[] = hackathonsData?.data || []
  const totalItems = hackathonsData?.meta?.total || 0
  const totalPages = hackathonsData?.meta?.totalPages || 1

  const resetForm = () => {
    setFormData(defaultFormData)
    setTeamBasedParticipation(true)
  }

  const handleCreateModalOpenChange = (open: boolean) => {
    setIsCreateModalOpen(open)
    if (!open) {
      setEditingHackathon(null)
      resetForm()
    }
  }

  const openCreateModal = () => {
    setEditingHackathon(null)
    resetForm()
    setIsCreateModalOpen(true)
  }

  const openEditModal = (hackathon: HackathonAdminListItem) => {
    setEditingHackathon(hackathon)
    setFormData({
      title: hackathon.title || '',
      slug: hackathon.slug || '',
      type: (hackathon.type as any) || 'VIRTUAL',
      description: hackathon.description || '',
      deadline: (hackathon as any).submissionDeadline || hackathon.endDate ? new Date((hackathon as any).submissionDeadline || hackathon.endDate).toISOString().slice(0, 10) : '',
      announcementDate: (hackathon as any).announcementDate ? new Date((hackathon as any).announcementDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      totalBudget: String(hackathon.totalBudget || hackathon.totalPrizePool || hackathon.totalReward || ''),
      token: (hackathon as any).token || '',
      asset: hackathon.asset || hackathon.currency || 'USDC',
      deliverables: (hackathon.deliverables || []).join(', '),
      tags: (hackathon.tags || []).join(', '),
      prizePool: hackathon.prizePool || [
        { position: 1, amount: 0 },
        { position: 2, amount: 0 },
        { position: 3, amount: 0 },
      ],
      teamBased: hackathon.teamBasedParticipation ?? true,
      maxTeamSize: String(hackathon.maxTeamSize || 4),
      companyId: hackathon.ownerId || '',
      tracks: (hackathon.tracks || ['Main']).join(', '),
    })
    setTeamBasedParticipation(
      typeof hackathon.teamBasedParticipation === 'boolean'
        ? hackathon.teamBasedParticipation
        : Number(hackathon.maxTeamSize || 1) > 1
    )
    setIsCreateModalOpen(true)
  }

  const handleCreateHackathon = () => {
    openCreateModal()
  }

  const handleEditHackathon = (hackathon: HackathonAdminListItem) => {
    openEditModal(hackathon)
  }

  const buildHackathonPayload = () => {
    const deliverables = formData.deliverables.split(',').map(s => s.trim()).filter(Boolean);
    const tags = formData.tags.split(',').map(s => s.trim()).filter(Boolean);
    const tracks = formData.tracks.split(',').map(s => s.trim()).filter(Boolean);
    
    if (tracks.length === 0) tracks.push("Main");

    return {
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/\s+/g, '-'),
      type: formData.type,
      description: formData.description.trim(),
      deliverables,
      tags,
      deadline: new Date(formData.deadline).toISOString(),
      announcementDate: new Date(formData.announcementDate).toISOString(),
      totalBudget: parseFloat(formData.totalBudget),
      token: formData.token.trim() || 'native',
      asset: formData.asset,
      prizePool: formData.prizePool,
      teamBased: teamBasedParticipation,
      maxTeamSize: teamBasedParticipation ? parseInt(formData.maxTeamSize, 10) : 1,
      companyId: formData.companyId.trim() || (user?.id as string),
      tracks,
    }
  }

  const handleCreateSubmit = async (token?: string) => {
    if (!formData.title || !formData.description || !formData.deadline || !formData.totalBudget) {
      toast.error('Please fill in all required fields')
      return
    }

    // Step-up authentication check
    const currentStepUpToken = token || stepUpToken
    const isStepUpOk = token ? true : isStepUpValid()
    
    if (!isStepUpOk) {
      setStepUpOpen(true)
      return
    }

    const ownerId = user?.id
    if (!ownerId) {
      toast.error('Unable to determine the hackathon owner')
      return
    }

    const payload = buildHackathonPayload()
    setIsSubmitting(true)
    const toastId = toast.loading(
      editingHackathon ? 'Updating hackathon...' : 'Creating hackathon...'
    )
    
    try {
      if (editingHackathon) {
        await adminService.updateHackathon(editingHackathon.id, payload, currentStepUpToken || undefined)
      } else {
        await adminService.createHackathon({
          ownerId: ownerId as string,
          payload: payload as any,
        }, currentStepUpToken || undefined)
      }
      
      toast.success(
        editingHackathon ? 'Hackathon updated successfully' : 'Hackathon created successfully',
        { id: toastId }
      )
      handleCreateModalOpenChange(false)
      refetch()
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          editingHackathon ? 'Failed to update hackathon' : 'Failed to create hackathon'
        ),
        { id: toastId }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onStepUpSuccess = (token: string) => {
    void handleCreateSubmit(token)
  }

  const handleDelete = async (hackathonId: string) => {
    // Check step-up for delete as well
    if (!isStepUpValid()) {
      setStepUpOpen(true)
      // Note: We don't have a good way to resume delete after step-up without a pending action system
      // For now, the user just has to click delete again.
      return
    }

    const toastId = toast.loading('Deleting hackathon...')
    
    try {
      await adminService.deleteHackathon(hackathonId, stepUpToken || undefined)
      toast.success('Hackathon deleted successfully', { id: toastId })
      refetch()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete hackathon'), { id: toastId })
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const toastId = toast.loading('Preparing export...')
      
      const response = await adminService.getHackathons({
        page: 1,
        limit: 100000,
        search: searchQuery || undefined
      })

      const allData = response.data || []
      
      if (!allData.length) {
        toast.error('No data found to export', { id: toastId })
        return
      }

      exportToCSV(
        allData as any[],
        [
          { header: 'Title', key: 'title' },
          { header: 'Slug', key: 'slug' },
          { header: 'Type', key: 'type' },
          { header: 'Status', key: 'status' },
          { header: 'Participants', key: (h: any) => h.participantsCount || 0 },
          { header: 'Submissions', key: (h: any) => h.submissionsCount || 0 },
          { header: 'Prize Pool', key: (h: any) => h.totalPrizePool || h.totalBudget || 0 },
          { header: 'Currency', key: (h: any) => h.asset || h.currency || 'USDC' },
          { header: 'Deadline', key: (h: any) => h.submissionDeadline || h.endDate ? new Date((h as any).submissionDeadline || h.endDate).toLocaleDateString() : 'N/A' },
        ],
        'hackathons_export'
      )
      toast.success('Export downloaded successfully', { id: toastId })
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
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
            Hackathon Administration
          </h1>
          <p className='text-sm text-muted-foreground'>
            Create, configure, and manage hackathons and competitions
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            className='gap-2 border-border'
            onClick={handleExport}
            disabled={!hackathons.length || isExporting}
          >
            {isExporting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
            Export
          </Button>
          <Button
            className='gap-2 bg-primary hover:bg-primary/90'
            onClick={handleCreateHackathon}
          >
            <Plus className='h-4 w-4' />
            Create Hackathon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Hackathons
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Trophy className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalHackathons || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              {stats?.activeHackathons || 0} currently active
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Prize Pool
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Calendar className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              ${(stats?.totalPrizePoolUsd || 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Across all hackathons
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Participants
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Users className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalParticipants || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Registered participants
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Submissions
            </h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <AlertTriangle className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalSubmissions || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Total project submissions
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search hackathons'
            className='pl-10 bg-background border-border'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Button
          variant='outline'
          size='sm'
          className='gap-2 border-border text-muted-foreground'
        >
          <SlidersHorizontal className='h-4 w-4' />
          More Filters
        </Button>
      </div>

      {/* Hackathons Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='border-border hover:bg-transparent'>
              <TableHead className='text-muted-foreground font-medium'>
                Hackathon
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Participants
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Prize Pool
              </TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-12'>
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : hackathons.length > 0 ? (
              hackathons.map((hackathon) => (
                <TableRow
                  key={hackathon.id}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={hackathon.logo}
                          alt={hackathon.title}
                        />
                        <AvatarFallback>
                          {(hackathon.title || 'H').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='text-foreground text-sm font-medium'>
                          {hackathon.title}
                        </div>
                        <div className='text-xs text-muted-foreground line-clamp-1'>
                          {hackathon.slug}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {(hackathon.participantsCount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    ${(hackathon.totalPrizePool || hackathon.totalBudget || 0).toLocaleString()} {hackathon.asset || hackathon.currency || 'USDC'}
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
                          <Link
                            href={`/dashboard/admin/hackathons/${hackathon.id}`}
                          >
                            <Eye className='h-4 w-4' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer'
                          onClick={() => handleEditHackathon(hackathon)}
                        >
                          <Edit className='h-4 w-4' />
                          Edit Hackathon
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='gap-2 cursor-pointer text-destructive focus:text-destructive'
                          onClick={() => handleDelete(hackathon.id)}
                        >
                          <StopCircle className='h-4 w-4' />
                          Delete Hackathon
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  No hackathons found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Showing {hackathons.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} hackathons
          </div>
          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 border-border'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='px-2'>
              Page {currentPage} of {totalPages || 1}
            </span>
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
          </div>
        </div>
      </div>

      {/* Create Hackathon Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCreateModalOpenChange}>
        <DialogContent className='bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
          <DialogHeader className='p-6 pb-4 sticky top-0 bg-card z-10 border-b border-border'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-xl font-bold text-foreground'>
                {editingHackathon ? 'Edit Hackathon' : 'Create Hackathon'}
              </DialogTitle>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleCreateModalOpenChange(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Title *</Label>
                <Input
                  className='bg-background border-border'
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Slug *</Label>
                <Input
                  className='bg-background border-border'
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as 'VIRTUAL' | 'PHYSICAL' }))}
              >
                <SelectTrigger className='bg-background border-border'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='VIRTUAL'>Virtual</SelectItem>
                  <SelectItem value='PHYSICAL'>Physical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Description *</Label>
              <Textarea
                className='bg-background border-border min-h-[100px]'
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Deliverables *</Label>
                <Input
                  placeholder='Comma-separated'
                  className='bg-background border-border'
                  value={formData.deliverables}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliverables: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Tags *</Label>
                <Input
                  placeholder='Comma-separated'
                  className='bg-background border-border'
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Deadline *</Label>
                <Input
                  type="date"
                  className='bg-background border-border'
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Announcement Date *</Label>
                <Input
                  type="date"
                  className='bg-background border-border'
                  value={formData.announcementDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, announcementDate: e.target.value }))}
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Total Budget *</Label>
                <Input
                  className='bg-background border-border'
                  value={formData.totalBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Asset *</Label>
                <Input
                  placeholder='e.g. USDC'
                  className='bg-background border-border'
                  value={formData.asset}
                  onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Token Address *</Label>
                <Input
                  placeholder='Contract address'
                  className='bg-background border-border'
                  value={formData.token}
                  onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Tracks *</Label>
              <Input
                placeholder='Main, Track 1...'
                className='bg-background border-border'
                value={formData.tracks}
                onChange={(e) => setFormData(prev => ({ ...prev, tracks: e.target.value }))}
              />
            </div>

            <div className='flex items-center justify-between border border-border p-4 rounded-xl'>
              <div>
                <Label className='text-sm text-foreground'>Team Based</Label>
                <p className='text-xs text-muted-foreground'>Allow teams to participate</p>
              </div>
              <Switch
                checked={teamBasedParticipation}
                onCheckedChange={setTeamBasedParticipation}
              />
            </div>

            {teamBasedParticipation && (
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Max Team Size</Label>
                <Input
                  type="number"
                  className='bg-background border-border'
                  value={formData.maxTeamSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTeamSize: e.target.value }))}
                />
              </div>
            )}

            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Project Owner (Judge) *</Label>
              <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={userSearchOpen}
                    className="w-full justify-between bg-background border-border"
                  >
                    {formData.companyId
                      ? getOwnerDisplayName(projectOwners.find((owner) => owner.id === formData.companyId)) || formData.companyId
                      : "Select project owner..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0 border-border bg-card">
                  <Command className="bg-card">
                    <CommandInput placeholder="Search project owners..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No project owner found.</CommandEmpty>
                      <CommandGroup>
                        {projectOwners.map((owner) => (
                          <CommandItem
                            key={owner.id}
                            value={`${owner.firstName} ${owner.lastName} ${owner.username}`}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, companyId: owner.id }))
                              setUserSearchOpen(false)
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={owner.profilePicture} />
                              <AvatarFallback>{owner.firstName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {[owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.username}
                              </span>
                              <span className="text-xs text-muted-foreground">@{owner.username}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.companyId === owner.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-[10px] text-muted-foreground">The project owner who will act as the judge for this hackathon.</p>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm text-foreground font-semibold'>Prize Pool *</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    prizePool: [...prev.prizePool, { position: prev.prizePool.length + 1, amount: 0 }] 
                  }))}
                >
                  Add Prize
                </Button>
              </div>
              <div className='grid gap-3'>
                {formData.prizePool.map((prize, idx) => (
                  <div key={idx} className='flex items-center gap-4 bg-muted/20 p-2 rounded-lg'>
                    <Input
                      type="number"
                      placeholder="Rank"
                      className='w-20'
                      value={prize.position}
                      onChange={(e) => {
                        const newPool = [...formData.prizePool]
                        newPool[idx].position = parseInt(e.target.value) || 0
                        setFormData(prev => ({ ...prev, prizePool: newPool }))
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      className='flex-1'
                      value={prize.amount}
                      onChange={(e) => {
                        const newPool = [...formData.prizePool]
                        newPool[idx].amount = parseFloat(e.target.value) || 0
                        setFormData(prev => ({ ...prev, prizePool: newPool }))
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData(prev => ({ ...prev, prizePool: prev.prizePool.filter((_, i) => i !== idx) }))}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='p-6 sticky bottom-0 bg-card border-t border-border'>
            <Button 
              className='w-full h-12 text-md font-bold'
              disabled={isSubmitting}
              onClick={() => void handleCreateSubmit()}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {editingHackathon ? 'Save Changes' : 'Create Hackathon'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
