/* eslint-disable */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Info,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  type: 'VIRTUAL' | 'PHYSICAL' | 'HYBRID'
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
    'message' in error.response.data
  ) {
    const message = (error.response.data as { message: unknown }).message
    if (typeof message === 'string' && message) return message
    if (Array.isArray(message) && message.length > 0) return message.join('. ')
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

// Returns a specific, user-facing problem with the create form, or null if it looks valid.
const validateHackathonForm = (
  data: { totalBudget: string; asset: string; deadline: string; announcementDate: string; prizePool: HackathonPrize[] },
  isEditing: boolean
): string | null => {
  const budget = parseFloat(data.totalBudget)
  if (!Number.isFinite(budget) || budget <= 0) {
    return 'Total budget must be a number greater than 0.'
  }
  if (!data.asset.trim()) {
    return 'Choose the asset the prizes are paid in (e.g. USDC).'
  }

  const deadline = new Date(data.deadline)
  if (Number.isNaN(deadline.getTime())) return 'Enter a valid deadline.'
  if (!isEditing && deadline.getTime() <= Date.now()) {
    return 'The deadline must be in the future.'
  }

  if (data.announcementDate) {
    const announcement = new Date(data.announcementDate)
    if (!Number.isNaN(announcement.getTime()) && announcement.getTime() >= deadline.getTime()) {
      return 'The announcement date must be before the deadline.'
    }
  }

  if (data.prizePool.length === 0) return 'Add at least one prize.'
  if (data.prizePool.some((p) => !(Number(p.amount) > 0))) {
    return 'Every prize must have an amount greater than 0. Remove any empty prize rows.'
  }
  const positions = data.prizePool.map((p) => p.position)
  if (new Set(positions).size !== positions.length) {
    return 'Prize positions must be unique (1, 2, 3 …).'
  }
  const prizeSum = data.prizePool.reduce((sum, p) => sum + Number(p.amount), 0)
  if (Math.abs(prizeSum - budget) > 0.0000001) {
    return `The prizes add up to ${prizeSum} ${data.asset}, but the total budget is ${budget} ${data.asset}. They must match exactly.`
  }

  return null
}

const HACKATHON_TYPES: { value: 'VIRTUAL' | 'PHYSICAL' | 'HYBRID'; label: string; hint: string }[] = [
  { value: 'VIRTUAL', label: 'Virtual', hint: 'Fully online. Participants join from anywhere.' },
  { value: 'PHYSICAL', label: 'Physical', hint: 'In person at a venue.' },
  { value: 'HYBRID', label: 'Hybrid', hint: 'Both online and in person participation.' },
]

const HACKATHON_ASSETS = ['USDC', 'XLM', 'EURC', 'USDGLO']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

// Short random suffix keeps the generated slug unique without asking the admin to pick one.
const generateSlug = (title: string) => {
  const base = slugify(title) || 'hackathon'
  return `${base}-${Math.random().toString(36).slice(2, 6)}`
}

const inputClass =
  'h-[42px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary'

const ordinal = (n: number) => {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='space-y-4'>
      <h3 className='text-base font-bold text-foreground font-inter border-b border-border pb-2'>{title}</h3>
      {children}
    </section>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-2'>
      <Label className='text-foreground text-sm font-semibold'>
        {label} {required && <span className='text-destructive'>*</span>}
      </Label>
      {children}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  )
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
  const getValidStepUpToken = useAdminStore((state) => state.getValidStepUpToken)
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

  const prizeTotal = formData.prizePool.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const prizeRemaining = Math.round((Number(formData.totalBudget || 0) - prizeTotal) * 1e7) / 1e7

  const renumber = (pool: HackathonPrize[]) => pool.map((p, i) => ({ ...p, position: i + 1 }))

  const addPrize = () =>
    setFormData(prev => ({ ...prev, prizePool: renumber([...prev.prizePool, { position: 0, amount: 0 }]) }))

  const removePrize = (idx: number) =>
    setFormData(prev => ({ ...prev, prizePool: renumber(prev.prizePool.filter((_, i) => i !== idx)) }))

  const updatePrizeAmount = (idx: number, amount: number) =>
    setFormData(prev => ({
      ...prev,
      prizePool: prev.prizePool.map((p, i) => (i === idx ? { ...p, amount } : p)),
    }))

  const splitPrizesEvenly = () =>
    setFormData(prev => {
      const budget = parseFloat(prev.totalBudget)
      const n = prev.prizePool.length
      if (!(budget > 0) || n === 0) return prev
      const each = Math.floor((budget / n) * 1e7) / 1e7
      const pool = prev.prizePool.map((p) => ({ ...p, amount: each }))
      // Put any rounding remainder on first place so the total matches the budget exactly.
      pool[0].amount = Math.round((budget - each * (n - 1)) * 1e7) / 1e7
      return { ...prev, prizePool: pool }
    })

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
      slug: editingHackathon ? formData.slug.trim() || generateSlug(formData.title) : generateSlug(formData.title),
      type: formData.type,
      description: formData.description.trim(),
      deliverables,
      tags,
      deadline: new Date(formData.deadline).toISOString(),
      // A date that isn't in the future means "publish immediately", which the API expects as no date.
      ...(formData.announcementDate && new Date(formData.announcementDate).getTime() > Date.now()
        ? { announcementDate: new Date(formData.announcementDate).toISOString() }
        : {}),
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

    const formProblem = validateHackathonForm(formData, Boolean(editingHackathon))
    if (formProblem) {
      toast.error('Check the hackathon details', { description: formProblem, duration: 8000 })
      return
    }

    // Step-up authentication check
    const currentStepUpToken = token || getValidStepUpToken()
    
    if (!currentStepUpToken) {
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
        editingHackathon ? 'Hackathon updated' : 'Hackathon created',
        {
          id: toastId,
          description: editingHackathon
            ? undefined
            : `${formData.totalBudget} ${formData.asset} has been placed in escrow on-chain.`,
        }
      )
      handleCreateModalOpenChange(false)
      refetch()
    } catch (error: unknown) {
      toast.error(
        editingHackathon ? 'Could not update the hackathon' : 'Could not create the hackathon',
        {
          id: toastId,
          description: getErrorMessage(
            error,
            'Something went wrong. Please check your details and try again.'
          ),
          duration: 15000,
        }
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
    if (!getValidStepUpToken()) {
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
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-foreground'>
            Hackathon Administration
          </h1>
          <p className='text-sm text-muted-foreground'>
            Create, configure, and manage hackathons and competitions
          </p>
        </div>
        <div className='flex items-center gap-2 sm:gap-3'>
          <Button
            variant='outline'
            className='flex-1 sm:flex-none gap-2 border-border'
            onClick={handleExport}
            disabled={!hackathons.length || isExporting}
          >
            {isExporting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
            Export
          </Button>
          <Button
            className='flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90'
            onClick={handleCreateHackathon}
          >
            <Plus className='h-4 w-4' />
            Create Hackathon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-4 sm:p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Hackathons
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Trophy className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalHackathons || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              {stats?.activeHackathons || 0} currently active
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-4 sm:p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Prize Pool
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Calendar className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground'>
              ${(stats?.totalPrizePoolUsd || 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Across all hackathons
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-4 sm:p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total Participants
            </h3>
            <div className='bg-primary/10 p-1.5 rounded-lg'>
              <Users className='w-4 h-4 text-primary' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground'>
              {stats?.totalParticipants || 0}
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              Registered participants
            </div>
          </div>
        </div>
        <div className='rounded-xl border border-border bg-card p-4 sm:p-5 relative overflow-hidden group hover:border-primary/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Submissions
            </h3>
            <div className='bg-amber-500/10 p-1.5 rounded-lg'>
              <AlertTriangle className='w-4 h-4 text-amber-500' />
            </div>
          </div>
          <div className='space-y-1'>
            <span className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground'>
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
          className='w-full sm:w-auto gap-2 border-border text-muted-foreground'
        >
          <SlidersHorizontal className='h-4 w-4' />
          More Filters
        </Button>
      </div>

      {/* Hackathons Table */}
      <div className='rounded-lg border border-border bg-card overflow-hidden'>
        <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-border hover:bg-transparent'>
              <TableHead className='text-muted-foreground font-medium'>
                Hackathon
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Status
              </TableHead>
              <TableHead className='hidden sm:table-cell text-muted-foreground font-medium'>
                Participants
              </TableHead>
              <TableHead className='hidden md:table-cell text-muted-foreground font-medium'>
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
                      <div className='min-w-0'>
                        <div className='text-foreground text-sm font-medium truncate max-w-[10rem] sm:max-w-xs'>
                          {hackathon.title}
                        </div>
                        <div className='text-xs text-muted-foreground truncate max-w-[10rem] sm:max-w-xs'>
                          <span className='md:hidden'>
                            ${(hackathon.totalPrizePool || hackathon.totalBudget || 0).toLocaleString()} {hackathon.asset || hackathon.currency || 'USDC'}
                            {' · '}
                          </span>
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
                  <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>
                    {(hackathon.participantsCount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-muted-foreground text-sm whitespace-nowrap'>
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
        </div>

        {/* Pagination */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-border'>
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

      {/* Create / Edit Hackathon Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCreateModalOpenChange}>
        <DialogContent className='bg-card border-border w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0'>
          <DialogHeader className='p-4 sm:p-6 border-b border-border text-left'>
            <DialogTitle className='text-xl sm:text-2xl font-bold text-foreground font-inter'>
              {editingHackathon ? 'Edit Hackathon' : 'Create Hackathon'}
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              {editingHackathon
                ? 'Update the details of this hackathon.'
                : 'The prize budget is locked in escrow when you create the hackathon.'}
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-8'>
            {/* Basics */}
            <FormSection title='Basics'>
              <Field label='Title' required>
                <Input
                  placeholder='e.g. Stellar Builders Hackathon'
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {(editingHackathon ? formData.slug : slugify(formData.title)) && (
                  <p className='text-xs text-muted-foreground break-all'>
                    URL: /hackathons/
                    <span className='text-foreground'>
                      {editingHackathon ? formData.slug : `${slugify(formData.title)}-xxxx`}
                    </span>
                  </p>
                )}
              </Field>

              <Field label='Hackathon type' required>
                <Tabs
                  value={formData.type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as HackathonFormData['type'] }))}
                >
                  <TabsList className='grid w-full grid-cols-3 h-11 p-1 rounded-lg bg-muted-foreground/20'>
                    {HACKATHON_TYPES.map((t) => (
                      <TabsTrigger
                        key={t.value}
                        value={t.value}
                        className='text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                      >
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <p className='text-xs text-muted-foreground'>
                  {HACKATHON_TYPES.find((t) => t.value === formData.type)?.hint}
                </p>
              </Field>

              <Field label='Description' required>
                <Textarea
                  placeholder='What is this hackathon about?'
                  className='min-h-[110px] rounded-lg border-[1.19px] border-input bg-transparent text-foreground focus-visible:border-primary'
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </Field>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field label='Deliverables' hint='Separate with commas'>
                  <Input
                    placeholder='GitHub repo, Demo video'
                    className={inputClass}
                    value={formData.deliverables}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliverables: e.target.value }))}
                  />
                </Field>
                <Field label='Tags' hint='Separate with commas'>
                  <Input
                    placeholder='DeFi, Soroban'
                    className={inputClass}
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </Field>
              </div>

              <Field label='Tracks' hint='Separate with commas. Defaults to “Main”.'>
                <Input
                  placeholder='Main, Track 1'
                  className={inputClass}
                  value={formData.tracks}
                  onChange={(e) => setFormData(prev => ({ ...prev, tracks: e.target.value }))}
                />
              </Field>
            </FormSection>

            {/* Schedule */}
            <FormSection title='Schedule'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field label='Submission deadline' required>
                  <Input
                    type='date'
                    className={inputClass}
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </Field>
                <Field label='Publish on' hint='Today or earlier publishes immediately.'>
                  <Input
                    type='date'
                    className={inputClass}
                    value={formData.announcementDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, announcementDate: e.target.value }))}
                  />
                </Field>
              </div>
            </FormSection>

            {/* Prizes */}
            <FormSection title='Prizes & funding'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field label='Total budget' required>
                  <Input
                    type='number'
                    inputMode='decimal'
                    min='0'
                    placeholder='1000'
                    className={inputClass}
                    value={formData.totalBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                  />
                </Field>
                <Field label='Paid in' required>
                  <Select
                    value={formData.asset}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, asset: v }))}
                  >
                    <SelectTrigger className='w-full h-[42px] bg-transparent border-[1.19px] border-input text-foreground'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-card border-[1.19px] border-input text-foreground'>
                      {HACKATHON_ASSETS.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {!editingHackathon && (
                <div className='flex gap-2 rounded-lg bg-primary/10 p-3 text-xs text-foreground'>
                  <Info className='h-4 w-4 shrink-0 mt-0.5 text-primary' />
                  <p>
                    {formData.totalBudget || 'The total budget'} {formData.asset} is taken from your admin wallet and
                    locked in escrow, plus a 5% platform fee
                    {Number(formData.totalBudget) > 0 &&
                      ` (${(Number(formData.totalBudget) * 1.05).toLocaleString(undefined, { maximumFractionDigits: 7 })} ${formData.asset} in total)`}
                    . The wallet also needs a {formData.asset} trustline and some XLM for fees
                    (Stellar keeps about 1.5 XLM locked in every account).
                  </p>
                </div>
              )}

              <div className='space-y-3'>
                <div className='flex items-center justify-between gap-2'>
                  <Label className='text-foreground text-sm font-semibold'>
                    Prize positions <span className='text-destructive'>*</span>
                  </Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='gap-1 border-input'
                    onClick={addPrize}
                  >
                    <Plus className='h-4 w-4' /> Add position
                  </Button>
                </div>

                <div className='space-y-2'>
                  {formData.prizePool.map((prize, idx) => (
                    <div
                      key={idx}
                      className='flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2 pl-3'
                    >
                      <Badge className='shrink-0 w-12 justify-center bg-primary/10 text-primary border-0 hover:bg-primary/10'>
                        {ordinal(prize.position)}
                      </Badge>
                      <Input
                        type='number'
                        inputMode='decimal'
                        min='0'
                        aria-label={`Prize for ${ordinal(prize.position)} place`}
                        placeholder='Amount'
                        className={cn(inputClass, 'flex-1 min-w-0')}
                        value={prize.amount || ''}
                        onChange={(e) => updatePrizeAmount(idx, parseFloat(e.target.value) || 0)}
                      />
                      <span className='hidden sm:block text-xs text-muted-foreground w-12'>{formData.asset}</span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='shrink-0 text-muted-foreground hover:text-destructive'
                        aria-label='Remove position'
                        disabled={formData.prizePool.length <= 1}
                        onClick={() => removePrize(idx)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <p
                    className={cn(
                      'text-xs',
                      prizeRemaining === 0 && Number(formData.totalBudget) > 0
                        ? 'text-green-500'
                        : prizeRemaining < 0
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    )}
                  >
                    Allocated {prizeTotal} of {Number(formData.totalBudget) || 0} {formData.asset}
                    {Number(formData.totalBudget) > 0 &&
                      (prizeRemaining === 0
                        ? ' — fully allocated'
                        : prizeRemaining > 0
                          ? ` — ${prizeRemaining} left`
                          : ` — over by ${Math.abs(prizeRemaining)}`)}
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2 text-xs text-primary'
                      disabled={!(Number(formData.totalBudget) > 0)}
                      onClick={splitPrizesEvenly}
                    >
                      Split evenly
                    </Button>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Participation */}
            <FormSection title='Participation & judging'>
              <div className='flex items-center justify-between gap-4 rounded-lg border border-border p-4'>
                <div>
                  <Label className='text-foreground text-sm font-semibold'>Team based</Label>
                  <p className='text-xs text-muted-foreground'>Allow teams to participate</p>
                </div>
                <Switch checked={teamBasedParticipation} onCheckedChange={setTeamBasedParticipation} />
              </div>

              {teamBasedParticipation && (
                <Field label='Max team size'>
                  <Input
                    type='number'
                    min='2'
                    className={inputClass}
                    value={formData.maxTeamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeamSize: e.target.value }))}
                  />
                </Field>
              )}

              <Field label='Project owner (judge)' hint='Optional. Defaults to you if left empty.'>
                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={userSearchOpen}
                      className='w-full h-[42px] justify-between bg-transparent border-[1.19px] border-input font-normal text-foreground'
                    >
                      <span className='truncate'>
                        {formData.companyId
                          ? getOwnerDisplayName(projectOwners.find((owner) => owner.id === formData.companyId)) || formData.companyId
                          : 'Select project owner...'}
                      </span>
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-(--radix-popover-trigger-width) p-0 border-[1.19px] border-input bg-card'>
                    <Command className='bg-card'>
                      <CommandInput placeholder='Search project owners...' className='h-9' />
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
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <Avatar className='h-6 w-6'>
                                <AvatarImage src={owner.profilePicture} />
                                <AvatarFallback>{owner.firstName?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className='flex flex-col min-w-0'>
                                <span className='text-sm font-medium truncate'>
                                  {[owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.username}
                                </span>
                                <span className='text-xs text-muted-foreground'>@{owner.username}</span>
                              </div>
                              <Check
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  formData.companyId === owner.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>
            </FormSection>
          </div>

          <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end p-4 sm:p-6 border-t border-border'>
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground'
              onClick={() => handleCreateModalOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-primary hover:bg-primary/90 text-primary-foreground sm:min-w-[160px]'
              disabled={isSubmitting}
              onClick={() => void handleCreateSubmit()}
            >
              {isSubmitting ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
              {editingHackathon ? 'Save changes' : 'Create hackathon'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
