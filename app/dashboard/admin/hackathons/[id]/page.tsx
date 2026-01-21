'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Award,
  BadgeDollarSign,
  Calendar,
  Check,
  CheckCircle,
  Download,
  Edit,
  Eye,
  File,
  Share2,
  SlidersHorizontal,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Types
interface Submission {
  id: string
  teamName: string
  avatar: string
  description: string
  teamMembers: number
  date: string
  status: 'Pending Review' | 'Approved' | 'In Review'
  members: TeamMember[]
}

interface TeamMember {
  id: string
  name: string
  avatar: string
  isFairPayer?: boolean
}

interface Winner {
  name: string
  amount: string
  icon: string
}

// Mock data for submissions
const mockSubmissions: Submission[] = [
  {
    id: '1',
    teamName: 'Team Vicks',
    avatar: '/assets/icons/sdollar.png',
    description:
      'Full-stack developer with 4 years experience building SaaS dashboards. I can deliver high-quality work within',
    teamMembers: 3,
    date: '2/2/2024',
    status: 'Pending Review',
    members: [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: '/assets/icons/sdollar.png',
        isFairPayer: true,
      },
      {
        id: '2',
        name: 'Alex Thompson',
        avatar: '/assets/icons/sdollar.png',
        isFairPayer: true,
      },
      {
        id: '3',
        name: 'Alex Chen',
        avatar: '/assets/icons/sdollar.png',
        isFairPayer: true,
      },
    ],
  },
  {
    id: '2',
    teamName: 'Team Tom',
    avatar: '/assets/icons/sdollar.png',
    description:
      'Full-stack developer with 4 years experience building SaaS dashboards. I can deliver high-quality work within',
    teamMembers: 3,
    date: '2/2/2024',
    status: 'Approved',
    members: [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: '/assets/icons/sdollar.png',
        isFairPayer: true,
      },
      {
        id: '2',
        name: 'Alex Thompson',
        avatar: '/assets/icons/sdollar.png',
        isFairPayer: true,
      },
    ],
  },
]

// Mock data for hackathon details
const hackathonDetails = {
  id: '1',
  title: 'Best Stellar DeFi Dashboard Design',
  host: 'Stellar Foundation',
  status: 'Active',
  participants: 250,
  deadline: 'Jan 15, 2024',
  submissionOpen: true,
  end: 'Jan 2024+',
  tags: ['React', 'TypeScript', 'UI/UX'],
  heroImage: '/assets/dashboardMobile.png',
  logo: '/assets/icons/sdollar.png',
  stats: {
    submissions: 12,
    deadline: 'Jan 15, 2024',
    participants: 230,
    prizePool: '$105,000',
  },
  totalPrizes: '$10,000',
  distribution: [
    { rank: 1, percentage: 50 },
    { rank: 2, percentage: 30 },
    { rank: 3, percentage: 20 },
  ],
  description: `We are looking for an experienced security auditor to perform a comprehensive security audit on our DeFi protocol smart contracts.

The audit should cover:
• Reentrancy vulnerabilities
• Integer overflow/underflow
• Access control issues
• Flash loan attack vectors
• Oracle manipulation risks
• Gas optimization opportunities

Our protocol consists of 5 main contracts with approximately 2,500 lines of Solidity code. We expect a detailed report with severity classifications and recommended fixes.`,
  deliverables: [
    'Comprehensive security audit report',
    'Severity classification for each finding',
    'Recommended fixes and code suggestions',
    'Executive summary for non-technical stakeholders',
    'Follow-up review after fixes are implemented',
  ],
  attachments: [
    { name: 'Architecture_Diagram.png', size: '2.4 MB' },
    { name: 'Contract_Specifications Product...', size: '2.4 MB' },
  ],
  hackers: Array.from({ length: 8 }, (_, i) => ({
    id: `hacker-${i}`,
    name: 'Alex Thompson',
    title: 'I am a experienced practicing CSE (Data Science)',
    avatar: '/assets/icons/sdollar.png',
    tags: ['React', 'TypeScript', 'UI/UX'],
    bounties: 10,
    projects: 5,
  })),
}

// Selected winners for confirm modal
const selectedWinners: Winner[] = [
  { name: 'Alex Chen', amount: '$5,000', icon: '🥇' },
  { name: 'Bolu Aye', amount: '$3,000', icon: '🥈' },
  { name: 'Tunde Balogun', amount: '$1,000', icon: '🥉' },
]

// Helper functions
const getAmount = (percentage: number) => {
  const total = parseFloat(hackathonDetails.totalPrizes.replace(/[^0-9.]/g, ''))
  if (isNaN(total) || isNaN(percentage)) return 0
  return (total * percentage) / 100
}

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function HackathonDetailsPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [isSelectWinnerOpen, setIsSelectWinnerOpen] = useState(false)
  const [isConfirmWinnersOpen, setIsConfirmWinnersOpen] = useState(false)
  const [isSubmissionDetailsOpen, setIsSubmissionDetailsOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)

  const tabs = [
    { name: 'Overview', count: null },
    { name: 'All Submission', count: 20 },
    { name: 'In Review', count: 2 },
    { name: 'Winners', count: 2 },
  ]

  const handleSelectWinner = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsSelectWinnerOpen(true)
  }

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsSubmissionDetailsOpen(true)
  }

  return (
    <div className='space-y-6'>
      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <Link
          href='/dashboard/admin/hackathons'
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Hackathons
        </Link>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-2 border-border'>
            <Edit className='h-4 w-4' />
            Edit
          </Button>
          <Button variant='outline' size='sm' className='gap-2 border-border'>
            <Share2 className='h-4 w-4' />
            Share
          </Button>
        </div>
      </div>

      <div className='grid lg:grid-cols-[1fr_320px] gap-6'>
        {/* Main Content */}
        <div className='space-y-6'>
          {/* Hero Section */}
          <div className='relative rounded-xl overflow-hidden h-[280px]'>
            <Image
              src={hackathonDetails.heroImage}
              alt={hackathonDetails.title}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
            <div className='absolute bottom-0 left-0 right-0 p-6'>
              <div className='flex items-center gap-4 mb-3'>
                <div className='h-12 w-12 rounded-lg bg-background/20 backdrop-blur-sm flex items-center justify-center overflow-hidden'>
                  <Image
                    src={hackathonDetails.logo}
                    alt='Logo'
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <Badge className='bg-green-500/20 text-green-400 border-0 mb-2'>
                {hackathonDetails.status}
              </Badge>
              <h1 className='text-2xl font-bold text-white mb-2'>
                {hackathonDetails.title}
              </h1>
              <div className='flex items-center gap-4 text-sm text-white/70'>
                <span>@ {hackathonDetails.host}</span>
                <span>• {hackathonDetails.participants}</span>
                <span>• Submission Open</span>
                <span>• Hackathon</span>
                <span>• End {hackathonDetails.end}</span>
              </div>
              <div className='flex gap-2 mt-3'>
                {hackathonDetails.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='bg-primary/20 text-primary border-0'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className='grid grid-cols-4 gap-4'>
            <Card className='bg-card border-border'>
              <CardContent className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>Submissions</p>
                  <p className='text-2xl font-bold text-foreground'>
                    {hackathonDetails.stats.submissions}
                  </p>
                </div>
                <File className='h-5 w-5 text-muted-foreground' />
              </CardContent>
            </Card>
            <Card className='bg-card border-border'>
              <CardContent className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>Deadline</p>
                  <p className='text-lg font-bold text-foreground'>
                    {hackathonDetails.stats.deadline}
                  </p>
                </div>
                <Calendar className='h-5 w-5 text-muted-foreground' />
              </CardContent>
            </Card>
            <Card className='bg-card border-border'>
              <CardContent className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>Participants</p>
                  <p className='text-2xl font-bold text-foreground'>
                    {hackathonDetails.stats.participants}
                  </p>
                </div>
                <Users className='h-5 w-5 text-muted-foreground' />
              </CardContent>
            </Card>
            <Card className='bg-card border-border'>
              <CardContent className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>Prize Pool</p>
                  <p className='text-2xl font-bold text-foreground'>
                    {hackathonDetails.stats.prizePool}
                  </p>
                </div>
                <Trophy className='h-5 w-5 text-muted-foreground' />
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className='flex items-center justify-between border-b border-border'>
            <div className='flex items-center gap-1'>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.name
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tab.name} {tab.count !== null && `(${tab.count})`}
                  {activeTab === tab.name && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
                  )}
                </button>
              ))}
            </div>
            {activeTab !== 'Overview' && (
              <div className='flex items-center gap-2 pb-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2 border-border text-muted-foreground'
                >
                  <SlidersHorizontal className='h-4 w-4' />
                  More Filter
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2 border-border text-muted-foreground'
                >
                  <Download className='h-4 w-4' />
                  Export
                </Button>
              </div>
            )}
          </div>

          {/* Conditional Content Based on Tab */}
          {activeTab === 'Overview' ? (
            <>
              {/* Description */}
              <Card className='bg-card border-border'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <CheckCircle className='h-5 w-5 text-primary' />
                    <h2 className='text-lg font-semibold text-foreground'>
                      Description
                    </h2>
                  </div>
                  <div className='text-sm text-muted-foreground whitespace-pre-line'>
                    {hackathonDetails.description}
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card className='bg-card border-border'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <File className='h-5 w-5 text-primary' />
                    <h2 className='text-lg font-semibold text-foreground'>
                      Deliverables
                    </h2>
                  </div>
                  <ul className='space-y-2'>
                    {hackathonDetails.deliverables.map((item, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 text-sm text-muted-foreground'
                      >
                        <span className='text-primary'>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card className='bg-card border-border'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <File className='h-5 w-5 text-primary' />
                    <h2 className='text-lg font-semibold text-foreground'>
                      Attachments
                    </h2>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {hackathonDetails.attachments.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm'
                      >
                        <File className='h-4 w-4 text-muted-foreground' />
                        <span className='text-foreground'>{file.name}</span>
                        <span className='text-muted-foreground'>
                          {file.size}
                        </span>
                        <Download className='h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground' />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Submissions Content */
            <div className='space-y-4'>
              {mockSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className='bg-card border-border border-l-4 border-l-primary'
                >
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-4'>
                        <Avatar className='h-12 w-12'>
                          <AvatarImage
                            src={submission.avatar}
                            alt={submission.teamName}
                          />
                          <AvatarFallback>
                            {submission.teamName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='space-y-2'>
                          <h3 className='font-semibold text-foreground'>
                            {submission.teamName}
                          </h3>
                          <p className='text-sm text-muted-foreground max-w-xl'>
                            {submission.description}
                          </p>
                          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Users className='h-3 w-3' />
                              {submission.teamMembers} Team members
                            </span>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {submission.date}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 pt-2'>
                            {submission.status === 'Pending Review' && (
                              <Button
                                variant='outline'
                                size='sm'
                                className='gap-2 border-border text-muted-foreground'
                              >
                                <Check className='h-4 w-4' />
                                Mark under review
                              </Button>
                            )}
                            <Button
                              size='sm'
                              className='gap-2 bg-primary hover:bg-primary/90'
                              onClick={() => handleViewSubmission(submission)}
                            >
                              <Eye className='h-4 w-4' />
                              View Submissions
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              className='gap-2 border-border'
                              onClick={() => handleSelectWinner(submission)}
                            >
                              <Award className='h-4 w-4' />
                              Select Winner
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          submission.status === 'Approved'
                            ? 'bg-green-500/20 text-green-400 border-0'
                            : 'bg-amber-500/20 text-amber-400 border-0'
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Hackers */}
          <Card className='bg-card border-border'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Users className='h-5 w-5 text-primary' />
                <h2 className='text-lg font-semibold text-foreground'>
                  Hackers
                </h2>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {hackathonDetails.hackers.map((hacker) => (
                  <Card key={hacker.id} className='bg-muted/30 border-border'>
                    <CardContent className='p-4'>
                      <div className='flex flex-wrap gap-1 mb-3'>
                        {hacker.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='bg-primary/20 text-primary border-0 text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={hacker.avatar} alt={hacker.name} />
                          <AvatarFallback>
                            {hacker.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            {hacker.name}
                          </p>
                          <p className='text-xs text-muted-foreground truncate max-w-[120px]'>
                            {hacker.title}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 text-xs text-muted-foreground mb-2'>
                        <span>📋 {hacker.bounties} Bounties</span>
                        <span>📁 {hacker.projects} Project</span>
                      </div>
                      <Button
                        variant='link'
                        size='sm'
                        className='p-0 h-auto text-primary text-xs'
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className='flex justify-center mt-4'>
                <Button variant='outline' className='border-border'>
                  View More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Total Prizes Card - Using project styling */}
          <div className='rounded-xl border-[0.69px] border-primary bg-card overflow-hidden'>
            <div className='p-6 text-center border-b border-[1.16px] border-primary/30 bg-primary/10'>
              <div className='flex justify-center mb-2'>
                <BadgeDollarSign className='h-5 w-5 text-foreground' />
              </div>
              <p className='text-sm text-muted-foreground mb-1'>Total Prizes</p>
              <h2 className='text-4xl font-bold text-foreground'>
                {hackathonDetails.totalPrizes}
              </h2>
            </div>

            <div className='p-4 space-y-3'>
              {selectedWinners.length > 0
                ? selectedWinners.map((winner, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 rounded-lg bg-primary/10'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-xl'>{winner.icon}</span>
                      <span className='text-sm font-medium text-muted-foreground'>
                        {winner.name}
                      </span>
                    </div>
                    <span className='font-bold text-foreground'>
                      {winner.amount}
                    </span>
                  </div>
                ))
                : hackathonDetails.distribution.map((dist, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 rounded-lg bg-primary/10'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-xl'>
                        {dist.rank === 1
                          ? '🥇'
                          : dist.rank === 2
                            ? '🥈'
                            : dist.rank === 3
                              ? '🥉'
                              : '🏅'}
                      </span>
                      <span className='text-sm font-medium text-muted-foreground'>
                        {dist.rank === 1
                          ? 'Winner'
                          : dist.rank === 2
                            ? '1st Runner up'
                            : dist.rank === 3
                              ? '2nd Runner up'
                              : `${getOrdinal(dist.rank)} Place`}
                      </span>
                    </div>
                    <span className='font-bold text-foreground'>
                      ${getAmount(dist.percentage).toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>

            <div className='p-4 pt-0'>
              <Button
                className='w-full bg-green-500 hover:bg-green-600 text-white font-bold h-11'
                onClick={() => setIsConfirmWinnersOpen(true)}
              >
                Confirm Winners
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Select Winner Modal */}
      <Dialog open={isSelectWinnerOpen} onOpenChange={setIsSelectWinnerOpen}>
        <DialogContent className='bg-card border-border max-w-lg p-0 overflow-hidden'>
          <DialogHeader className='p-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='text-xl font-bold text-foreground'>
                  Select Winner
                </DialogTitle>
                <p className='text-xs text-muted-foreground mt-1'>
                  Choose a prize for {selectedSubmission?.teamName} Submission
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSelectWinnerOpen(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          <div className='px-6 pb-6 space-y-6'>
            {/* Team Info */}
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12'>
                <AvatarImage
                  src={selectedSubmission?.avatar}
                  alt={selectedSubmission?.teamName}
                />
                <AvatarFallback>
                  {selectedSubmission?.teamName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-foreground'>
                  {selectedSubmission?.teamName}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {selectedSubmission?.teamMembers} Members
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className='text-sm text-muted-foreground mb-3'>Team Members</p>
              <div className='flex items-center gap-4'>
                {selectedSubmission?.members.map((member) => (
                  <div key={member.id} className='flex flex-col items-center'>
                    <div className='relative'>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member.isFairPayer && (
                        <Badge className='absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 py-0'>
                          ⭐ Fair Payer
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs text-foreground mt-1'>
                      {member.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Position */}
            <div>
              <p className='text-sm text-muted-foreground mb-2'>
                Select Position
              </p>
              <Select>
                <SelectTrigger className='bg-background border-border'>
                  <SelectValue placeholder='Choose a position' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>🥇 Winner - $5,000</SelectItem>
                  <SelectItem value='2'>🥈 1st Runner up - $3,000</SelectItem>
                  <SelectItem value='3'>🥉 2nd Runner up - $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback */}
            <div>
              <p className='text-sm text-muted-foreground mb-2'>Feedback</p>
              <Textarea
                placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore'
                className='bg-background border-border min-h-[80px]'
              />
            </div>

            {/* Actions */}
            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='flex-1 gap-2 border-border'
                onClick={() => setIsSelectWinnerOpen(false)}
              >
                <X className='h-4 w-4' />
                Cancel Selection
              </Button>
              <Button className='flex-1 gap-2 bg-primary hover:bg-primary/90'>
                <Trophy className='h-4 w-4' />
                Confirm Winner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Winners Modal */}
      <Dialog
        open={isConfirmWinnersOpen}
        onOpenChange={setIsConfirmWinnersOpen}
      >
        <DialogContent className='bg-card border-border max-w-lg p-0 overflow-hidden'>
          <DialogHeader className='p-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='text-xl font-bold text-foreground'>
                  Confirm Winners & Distribute Prizes
                </DialogTitle>
                <p className='text-xs text-muted-foreground mt-1'>
                  Choose a prize for Team Vicks Submission
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsConfirmWinnersOpen(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          <div className='px-6 pb-6 space-y-4'>
            <p className='text-sm text-muted-foreground'>
              You&apos;re about to confirm the final winners for this hackathon
              and distribute the prize funds as follows:
            </p>

            <div className='space-y-2'>
              {selectedWinners.map((winner, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-xl'>{winner.icon}</span>
                    <span className='text-sm font-medium text-foreground'>
                      {winner.name}
                    </span>
                  </div>
                  <span className='font-bold text-foreground'>
                    {winner.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                className='flex-1 gap-2 border-border'
                onClick={() => setIsConfirmWinnersOpen(false)}
              >
                <X className='h-4 w-4' />
                Cancel Selection
              </Button>
              <Button className='flex-1 gap-2 bg-primary hover:bg-primary/90'>
                <Trophy className='h-4 w-4' />
                Confirm Winners
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hackathon Submission Details Modal */}
      <Dialog
        open={isSubmissionDetailsOpen}
        onOpenChange={setIsSubmissionDetailsOpen}
      >
        <DialogContent className='bg-card border-border max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='p-6 pb-4 border-b border-border'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='text-xl font-bold text-foreground'>
                  Hackathon Submission Details
                </DialogTitle>
                <p className='text-xs text-muted-foreground mt-1'>
                  View hackathon submission details
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSubmissionDetailsOpen(false)}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          <div className='p-6 space-y-6'>
            {/* Main Project URL */}
            <div>
              <p className='text-sm text-foreground mb-1'>
                Main Project URL <span className='text-destructive'>*</span>
              </p>
              <Link href='#' className='text-sm text-primary hover:underline'>
                View Submission
              </Link>
            </div>

            {/* Description */}
            <div>
              <p className='text-sm text-foreground mb-1'>
                Description <span className='text-destructive'>*</span>
              </p>
              <p className='text-sm text-muted-foreground'>
                Introduce yourself and explain why you&apos;re the best fit for
                this project. Include relevant experience, approach to the
                problem and what makes you stand out...
              </p>
            </div>

            {/* Showcase Video */}
            <div>
              <p className='text-sm text-foreground mb-1'>Showcase Video</p>
              <Link href='#' className='text-sm text-primary hover:underline'>
                View Submission
              </Link>
            </div>

            {/* Useful Links */}
            <div>
              <p className='text-sm text-foreground mb-2'>
                Useful Links <span className='text-destructive'>*</span>
              </p>
              <div className='space-y-1'>
                <Link
                  href='#'
                  className='block text-sm text-primary hover:underline'
                >
                  Strategy Design Document
                </Link>
                <Link
                  href='#'
                  className='block text-sm text-primary hover:underline'
                >
                  Strategy Design Document
                </Link>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className='text-sm text-foreground mb-3'>Team Members</p>
              <div className='grid grid-cols-2 gap-4'>
                {selectedSubmission?.members.map((member) => (
                  <Card key={member.id} className='bg-muted/30 border-border'>
                    <CardContent className='p-4'>
                      <div className='flex flex-wrap gap-1 mb-3'>
                        <Badge
                          variant='secondary'
                          className='bg-primary/20 text-primary border-0 text-xs'
                        >
                          React
                        </Badge>
                        <Badge
                          variant='secondary'
                          className='bg-primary/20 text-primary border-0 text-xs'
                        >
                          TypeScript
                        </Badge>
                        <Badge
                          variant='secondary'
                          className='bg-primary/20 text-primary border-0 text-xs'
                        >
                          UI/UX
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            Alex Thompson
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            I am a sophomore pursuing CSE (Data Science)
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 text-xs text-muted-foreground mb-2'>
                        <span>📋 10 Bounties</span>
                        <span>📁 15 Project</span>
                      </div>
                      <Button
                        variant='link'
                        size='sm'
                        className='p-0 h-auto text-foreground text-xs underline'
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Additional Attachments */}
            <div>
              <p className='text-sm text-foreground mb-2'>
                Additional Attachments
              </p>
              <p className='text-sm text-muted-foreground'>No Attachments</p>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-4'>
              <Button variant='outline' className='flex-1 gap-2 border-border'>
                <Check className='h-4 w-4' />
                Mark under review
              </Button>
              <Button className='flex-1 gap-2 bg-primary hover:bg-primary/90'>
                <Trophy className='h-4 w-4' />
                Confirm Winner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
