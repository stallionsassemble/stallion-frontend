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
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Types
interface Hackathon {
  id: string
  host: {
    name: string
    logo: string
  }
  title: string
  description: string
  status: 'Active' | 'Completed' | 'Reviewing'
  duration: string
  participants: number
  prizePool: string
}

// Mock Data
const mockHackathons: Hackathon[] = [
  {
    id: '1',
    host: { name: 'Stellar', logo: '/assets/icons/sdollar.png' },
    title: 'Smart Contract Security Audit',
    description: 'Find and fix vulnerabilities in smart, Create innovati...',
    status: 'Active',
    duration: '2024-02-10 - 2024-02-10',
    participants: 4000,
    prizePool: '$30,000 USDC',
  },
  {
    id: '2',
    host: { name: 'Stellar', logo: '/assets/icons/sdollar.png' },
    title: 'Smart Contract Security Audit',
    description: 'Find and fix vulnerabilities in smart, Create innovati...',
    status: 'Completed',
    duration: '2024-02-10 - 2024-02-10',
    participants: 4000,
    prizePool: '$30,000 USDC',
  },
  {
    id: '3',
    host: { name: 'Stellar', logo: '/assets/icons/sdollar.png' },
    title: 'Smart Contract Security Audit',
    description: 'Find and fix vulnerabilities in smart, Create innovati...',
    status: 'Reviewing',
    duration: '2024-02-10 - 2024-02-10',
    participants: 4000,
    prizePool: '$30,000 USDC',
  },
]

// Status badge styling helper
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
    case 'Completed':
      return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0'
    case 'Reviewing':
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

  const totalPages = Math.ceil(mockHackathons.length / rowsPerPage)

  return (
    <div className='space-y-6'>
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
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Download className='h-4 w-4' />
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
              2,420
            </span>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              1 currently active
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
              $145,000
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
              357
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
              104
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
            placeholder='Search bounties'
            className='pl-10 bg-background border-border'
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
                Participant
              </TableHead>
              <TableHead className='text-muted-foreground font-medium'>
                Prize Pool
              </TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHackathons.map((hackathon, index) => (
              <TableRow
                key={`${hackathon.id}-${index}`}
                className='border-border hover:bg-muted/30'
              >
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-7 w-7'>
                      <AvatarImage
                        src={hackathon.host.logo}
                        alt={hackathon.host.name}
                      />
                      <AvatarFallback>
                        {hackathon.host.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-foreground text-sm font-medium'>
                      {hackathon.host.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className='text-foreground text-sm font-medium'>
                      {hackathon.title}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {hackathon.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(hackathon.status)}>
                    {hackathon.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                  {hackathon.duration}
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                  {hackathon.participants.toLocaleString()}
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                  {hackathon.prizePool}
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
                      <DropdownMenuItem className='gap-2 cursor-pointer'>
                        <Edit className='h-4 w-4' />
                        Edit Hackathon
                      </DropdownMenuItem>
                      <DropdownMenuItem className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                        <StopCircle className='h-4 w-4' />
                        Stop Hackathon
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            0 of 68 row(s) selected.
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
                  <SelectValue placeholder='https://x.com/shadcn' />
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
                placeholder="Introduce yourself and explain why you're the best fit for this project. Include relevant experience, approach to the problem and what makes you stand out..."
                className='bg-background border-border min-h-[120px]'
              />
            </div>

            {/* Deliverables */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Deliverables *</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Deliverables'
                  className='bg-background border-border flex-1'
                />
                <Button size='icon' className='bg-primary hover:bg-primary/90'>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Deadline & Announcement Date */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>Deadline *</Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Select date'
                    className='bg-background border-border pl-10'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-foreground'>
                  Announcement Date *
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Select date'
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

            {/* Prize Pool */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>
                Prize Pool ($20,000) *
              </Label>
              <div className='space-y-2'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='1st Place'
                    className='bg-background border-border flex-1'
                  />
                  <div className='flex items-center gap-2 flex-1'>
                    <span className='text-primary'>$</span>
                    <Input
                      placeholder='10,000'
                      className='bg-background border-border'
                    />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Input
                    placeholder='2nd Place'
                    className='bg-background border-border flex-1'
                  />
                  <div className='flex items-center gap-2 flex-1'>
                    <span className='text-primary'>$</span>
                    <Input
                      placeholder='7,000'
                      className='bg-background border-border'
                    />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Input
                    placeholder='3rd Place'
                    className='bg-background border-border flex-1'
                  />
                  <div className='flex items-center gap-2 flex-1'>
                    <span className='text-primary'>$</span>
                    <Input
                      placeholder='3,000'
                      className='bg-background border-border'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>Tags *</Label>
              <Input
                placeholder='Select Tags'
                className='bg-background border-border'
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {[
                  'Frontend',
                  'Backend',
                  'UI/UX Design',
                  'Writing',
                  'Digital Marketing',
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='bg-muted text-muted-foreground gap-1'
                  >
                    {tag}
                    <X className='h-3 w-3 cursor-pointer' />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hackathon Document */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>
                Hackathon Document *
              </Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Link title'
                  className='bg-background border-border flex-1'
                />
                <Input
                  placeholder='https://'
                  className='bg-background border-border flex-1'
                />
                <Button size='icon' className='bg-primary hover:bg-primary/90'>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Additional Attachments */}
            <div className='space-y-2'>
              <Label className='text-sm text-foreground'>
                Additional Attachments (Optional)
              </Label>
              <p className='text-xs text-muted-foreground'>
                Attach relevant documents, screenshots, or files (max 5 files)
              </p>
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Upload className='h-5 w-5 text-primary' />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Choose or drag and drop media
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Maximum size 5 MB
                  </p>
                </div>
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
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Upload className='h-5 w-5 text-primary' />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Choose or drag and drop media
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Maximum size 5 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className='space-y-4'>
              <Label className='text-sm text-foreground'>Socials</Label>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>
                    X(Formerly Twitter) *
                  </Label>
                  <div className='relative'>
                    <X className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Enter your X Username'
                      className='bg-background border-border pl-10'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>
                    Website *
                  </Label>
                  <Input
                    placeholder='Enter your website URL'
                    className='bg-background border-border'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>
                    Linkedin
                  </Label>
                  <div className='relative'>
                    <Linkedin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Enter your Linkedin Username'
                      className='bg-background border-border pl-10'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>
                    Instagram
                  </Label>
                  <div className='relative'>
                    <Instagram className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Enter your Instagram Username'
                      className='bg-background border-border pl-10'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='p-6 pt-0 sticky bottom-0 bg-card'>
            <Button className='w-full gap-2 bg-primary hover:bg-primary/90'>
              <Download className='h-4 w-4' />
              Create Bounty
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
