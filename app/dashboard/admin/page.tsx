'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Briefcase, DollarSign, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Mock Data
const userGrowthData = [
  { name: 'Jan', talents: 400, companies: 240 },
  { name: 'Feb', talents: 300, companies: 139 },
  { name: 'Mar', talents: 200, companies: 980 },
  { name: 'Apr', talents: 278, companies: 390 },
  { name: 'May', talents: 189, companies: 480 },
  { name: 'Jun', talents: 239, companies: 380 },
  { name: 'Jul', talents: 349, companies: 430 },
]

const workStatusData = [
  { name: 'Active', value: 400, color: '#0088FE' },
  { name: 'Completed', value: 300, color: '#00C49F' },
  { name: 'Pending', value: 50, color: '#FFBB28' }, // Changed Disputed to Pending to match requirement
  // { name: 'Cancelled', value: 100, color: '#FF8042' },
]

const payoutAnalyticsData = [
  { name: 'July', USDC: 45, USGLO: 65, NGNC: 85 },
  { name: 'Aug', USDC: 55, USGLO: 60, NGNC: 75 },
  { name: 'Sep', USDC: 40, USGLO: 70, NGNC: 60 },
  { name: 'Oct', USDC: 60, USGLO: 90, NGNC: 80 },
  { name: 'Nov', USDC: 80, USGLO: 85, NGNC: 110 },
  { name: 'Dec', USDC: 95, USGLO: 100, NGNC: 95 },
  { name: 'Jan', USDC: 110, USGLO: 95, NGNC: 125 },
]

const jobPerformanceData = [
  { name: 'Q1', Bounties: 40, Projects: 30 },
  { name: 'Q2', Bounties: 60, Projects: 45 },
  { name: 'Q3', Bounties: 80, Projects: 60 },
  { name: 'Q4', Bounties: 95, Projects: 85 },
]

export default function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Admin Dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Overview of platform performance and management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Users
            </CardTitle>
            <Users className='h-4 w-4 text-primary' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-foreground'>481</div>
            <p className='text-xs text-muted-foreground'>Growing community</p>
          </CardContent>
        </Card>
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Active Works
            </CardTitle>
            <Briefcase className='h-4 w-4 text-primary' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-foreground'>20</div>
            <p className='text-xs text-muted-foreground'>
              Ongoing opportunities
            </p>
          </CardContent>
        </Card>
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Payouts
            </CardTitle>
            <DollarSign className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-foreground'>$1K</div>
            <p className='text-xs text-muted-foreground'>High engagement</p>
          </CardContent>
        </Card>
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Active Disputes
            </CardTitle>
            <AlertCircle className='h-4 w-4 text-destructive' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-foreground'>0</div>
            <p className='text-xs text-muted-foreground'>Low disputes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* User Growth Chart */}
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='text-base font-bold text-foreground'>
                User Growth
              </CardTitle>
              <p className='text-xs text-muted-foreground mt-1'>
                Monthly new user registrations
              </p>
            </div>
            <div className='px-3 py-1 text-xs border rounded cursor-pointer hover:bg-muted'>
              View Report
            </div>
          </CardHeader>
          <CardContent>
            <div className='mb-4'>
              <span className='text-3xl font-bold font-inter'>481</span>
            </div>
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(255,255,255,0.05)'
                />
                <XAxis
                  dataKey='name'
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                {/* Gradient definition would normally go here but simplified for Line */}
                <Line
                  type='monotone'
                  dataKey='talents'
                  stroke='#3b82f6'
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: '#3b82f6',
                    stroke: '#09090B',
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='companies'
                  stroke='#ffffff'
                  strokeWidth={1}
                  dot={false}
                  strokeOpacity={0.2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payout Analytics Chart */}
        <Card className='bg-card border-border'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-foreground'>
              Payout Analytics
            </CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Monthly payouts by token
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={payoutAnalyticsData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(255,255,255,0.05)'
                />
                <XAxis
                  dataKey='name'
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType='square'
                  align='right'
                  verticalAlign='top'
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
                />
                <Line
                  type='monotone'
                  dataKey='USDC'
                  stroke='#3b82f6'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type='monotone'
                  dataKey='USGLO'
                  stroke='#9ca3af'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type='monotone'
                  dataKey='NGNC'
                  stroke='#60a5fa'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Work Status Chart */}
        <Card className='bg-card border-border'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-foreground'>
              Work Status
            </CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Distribution by status
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={workStatusData}
                  cx='50%'
                  cy='50%'
                  innerRadius={70}
                  outerRadius={100}
                  fill='#8884d8'
                  paddingAngle={0}
                  dataKey='value'
                  stroke='none'
                >
                  {workStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType='square'
                  align='right'
                  verticalAlign='top'
                  wrapperStyle={{ fontSize: '12px' }}
                  layout='horizontal'
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Job Performance Chart */}
        <Card className='bg-card border-border'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-foreground'>
              Job Performance
            </CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Quarterly show of Bounties and Projects
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={jobPerformanceData} barGap={8}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(255,255,255,0.05)'
                />
                <XAxis
                  dataKey='name'
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke='#666'
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend
                  iconType='square'
                  align='right'
                  verticalAlign='top'
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar
                  dataKey='Bounties'
                  fill='#3b82f6'
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey='Projects'
                  fill='#1e3a8a'
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
