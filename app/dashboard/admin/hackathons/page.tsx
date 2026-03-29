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
  Instagram,
  Linkedin,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  StopCircle,
  Trophy,
  Upload,
  Users,
  X,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAdminHackathons, useAdminHackathonsStats } from '@/lib/api/admin/queries'
import { adminService } from '@/lib/api/admin'
import { StepUpModal } from '@/components/admin/step-up-modal'
import { useAdminStore } from '@/lib/store/use-admin-store'
import { toast } from 'sonner'

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'OPEN':
      return 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
    case 'COMPLETED':
    case 'CLOSED':
      return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0'
    case 'REVIEWING':
    case 'IN_PROGRESS':
      return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0'
    default:
      return 'bg-muted text-muted-foreground border-0'
  }
}

export default function HackathonAdministrationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [teamBasedParticipation, setTeamBasedParticipation] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Admin Step-up State
  const [stepUpOpen, setStepUpOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; hackathonId: string } | null>(null)
  const isStepUpValid = useAdminStore((state) => state.isStepUpValid)
  const stepUpToken = useAdminStore((state) => state.stepUpToken)

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

  const hackathons = hackathonsData?.data || []
  const totalItems = hackathonsData?.meta?.total || 0
  const totalPages = hackathonsData?.meta?.totalPages || 1

  const handleCreateHackathon = () => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'create', hackathonId: 'new' })
      setStepUpOpen(true)
      return
    }
    setIsCreateModalOpen(true)
  }

  const handleEditHackathon = (hackathonId: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'edit', hackathonId })
      setStepUpOpen(true)
      return
    }
    // For now, edit logic is just opening the modal with existing data if we had it
    // But the current UI doesn't seem to have a separate edit modal or pre-filled create modal
    // I'll just open the create modal for now as a placeholder for "edit"
    setIsCreateModalOpen(true)
  }

  const handleDelete = async (hackathonId: string) => {
    if (!isStepUpValid()) {
      setPendingAction({ type: 'delete', hackathonId })
      setStepUpOpen(true)
      return
    }

    const token = stepUpToken!
    const toastId = toast.loading('Deleting hackathon...')
    
    try {
      await adminService.deleteHackathon(hackathonId, token)
      toast.success('Hackathon deleted successfully', { id: toastId })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete hackathon', { id: toastId })
    }
  }

  const onStepUpSuccess = (token: string) => {
    if (pendingAction?.type === 'delete') {
      handleDelete(pendingAction.hackathonId)
    } else if (pendingAction?.type === 'create') {
      setIsCreateModalOpen(true)
    } else if (pendingAction?.type === 'edit') {
      setIsCreateModalOpen(true)
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
            Hackathon Administration
          </h1>
          <p className='text-sm text-muted-foreground'>
            Create, configure, and manage hackathons and competitions
          </p>
        </div>
        <Button
          className='gap-2 bg-primary hover:bg-primary/90'
          onClick={handleCreateHackathon}
        >
          <Plus className='h-4 w-4' />
          Create Hackathon
        </Button>
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
                Host
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Hackathon
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Duration
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
                <TableCell colSpan={7} className='text-center py-12'>
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : hackathons.length > 0 ? (
              hackathons.map((hackathon: any) => (
                <TableRow
                  key={hackathon.id}
                  className='border-border hover:bg-muted/30'
                >
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-7 w-7'>
                        <AvatarImage
                          src={hackathon.hostLogo || hackathon.logo}
                          alt={hackathon.hostName || hackathon.title}
                        />
                        <AvatarFallback>
                          {(hackathon.hostName || hackathon.title || 'H').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-foreground text-sm font-medium'>
                        {hackathon.hostName || 'Generic Host'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='text-foreground text-sm font-medium'>
                        {hackathon.title}
                      </div>
                      <div className='text-xs text-muted-foreground line-clamp-1'>
                        {hackathon.description?.replace(/<[^>]*>/g, '')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 'N/A'} - {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {(hackathon.participantsCount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    ${(hackathon.totalPrizePool || 0).toLocaleString()} {hackathon.currency || 'USDC'}
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
                          onClick={() => handleEditHackathon(hackathon.id)}
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
                <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
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

      {/* Create Hackathon Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className='bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
          <DialogHeader className='p-6 pb-4 sticky top-0 bg-card z-10 border-b border-border'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='text-xl font-bold text-foreground'>
                  Create Hackathon
                </DialogTitle>
                <p className='text-xs text-muted-foreground mt-1'>
                  Configure all aspects of your hackathon including prizes,
                  judges, and scoring
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsCreateModalOpen(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          <div className='p-6 space-y-6'>
            {/* Hackathon Name */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>
                Hackathon Name *
              </Label>
              <Input
                placeholder='e.g Bounty Hub'
                className='bg-background border-border'
              />
            </div>

            {/* Hackathon Type */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>
                Hackathon Type *
              </Label>
              <Select>
                <SelectTrigger className='bg-background border-border'>
                  <SelectValue placeholder='Select Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='online'>Online</SelectItem>
                  <SelectItem value='hybrid'>Hybrid</SelectItem>
                  <SelectItem value='in-person'>In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Description *</Label>
              <Textarea
                placeholder="Introduce your hackathon..."
                className='bg-background border-border min-h-[120px]'
              />
            </div>

            {/* Deadline & Announcement Date */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Start Date *</Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type="date"
                    className='bg-background border-border pl-10'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>
                  End Date *
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type="date"
                    className='bg-background border-border pl-10'
                  />
                </div>
              </div>
            </div>

            {/* Total Budget */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Total Budget *</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='20,000'
                  className='bg-background border-border flex-1'
                />
                <Select defaultValue='usdc'>
                  <SelectTrigger className='w-24 bg-background border-border'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='usdc'>USDC</SelectItem>
                    <SelectItem value='usglo'>USGLO</SelectItem>
                    <SelectItem value='xlm'>XLM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Team-Based Participation */}
            <div className='flex items-center justify-between'>
              <div>
                <Label className='text-sm text-foreground'>
                  Team-Based Participation
                </Label>
                <p className='text-xs text-muted-foreground'>
                  Allow participants to form teams
                </p>
              </div>
              <Switch
                checked={teamBasedParticipation}
                onCheckedChange={setTeamBasedParticipation}
              />
            </div>

            {/* Maximum Team Size */}
            {teamBasedParticipation && (
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>
                  Maximum Team Size
                </Label>
                <Input
                  placeholder='Size'
                  className='bg-background border-border'
                />
              </div>
            )}

            {/* Company Name */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Company Name *</Label>
              <Input
                placeholder='Company Name'
                className='bg-background border-border'
              />
            </div>

            {/* Company Logo */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Company Logo *</Label>
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground'>
                Logo upload placeholder
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='p-6 pt-0 sticky bottom-0 bg-card'>
            <Button className='w-full gap-2 bg-primary hover:bg-primary/90'>
              <Plus className='h-4 w-4' />
              Create Hackathon
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
