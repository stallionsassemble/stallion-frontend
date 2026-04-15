'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Briefcase, DollarSign, Users, Loader2 } from 'lucide-react'
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
import { useAdminDashboardStats } from '@/lib/api/admin/queries'
import { useMemo } from 'react'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboardStats()
  console.log("Admin Stats", stats)

  const userGrowthData = useMemo(() => {
    if (!stats?.userGrowth?.currentMonthDailyRegistrations) return []
    return Object.entries(stats.userGrowth.currentMonthDailyRegistrations).map(([date, count]) => ({
      name: date.split('-').slice(2).join('/'), // Just Day/Month or similar
      talents: count, // The API doesn't split by role in daily registrations yet, so we use count
      fullDate: date
    }))
  }, [stats])

  const workStatusData = useMemo(() => {
    if (!stats?.workStatus?.normalized) return []
    const normalized = stats.workStatus.normalized
    return [
      { name: 'Active', value: normalized.active, color: '#3b82f6' },
      { name: 'Completed', value: normalized.completed, color: '#10b981' },
      { name: 'Cancelled', value: normalized.cancelled, color: '#f43f5e' },
      { name: 'Closed', value: normalized.closed, color: '#64748b' },
    ]
  }, [stats])

  const payoutAnalyticsData = useMemo(() => {
    if (!stats?.payoutAnalytics) return []
    // Group by month
    const months: Record<string, any> = {}
    stats.payoutAnalytics.forEach(p => {
      if (!months[p.month]) months[p.month] = { name: p.month }
      months[p.month][p.token] = p.totalUsd
    })
    return Object.values(months)
  }, [stats])

  const jobPerformanceData = useMemo(() => {
    if (!stats?.jobPerformance) return []
    return stats.jobPerformance.map(p => ({
      name: p.quarter,
      Bounties: p.bountiesCreated,
      Projects: p.projectsCreated
    }))
  }, [stats])

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='h-8 w-48 animate-pulse rounded bg-muted' />
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className='bg-card border-border'>
              <CardHeader className='pb-2'>
                <div className='h-4 w-24 animate-pulse rounded bg-muted' />
              </CardHeader>
              <CardContent>
                <div className='h-8 w-16 animate-pulse rounded bg-muted' />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='grid gap-6 md:grid-cols-2'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className='bg-card border-border h-[350px]'>
              <CardHeader>
                <div className='h-4 w-32 animate-pulse rounded bg-muted' />
              </CardHeader>
              <CardContent className='flex items-center justify-center h-64'>
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

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
            <div className='text-2xl font-bold text-foreground'>{stats?.totalUsers || 0}</div>
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
            <div className='text-2xl font-bold text-foreground'>{stats?.activeWorks || 0}</div>
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
            <div className='text-2xl font-bold text-foreground'>
              ${(stats?.totalPayoutsUsd || 0).toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>High engagement</p>
          </CardContent>
        </Card>
        <Card className='bg-card border-border'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Register Today
            </CardTitle>
            <AlertCircle className='h-4 w-4 text-primary' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-foreground'>{stats?.userGrowth?.today || 0}</div>
            <p className='text-xs text-muted-foreground'>New signups</p>
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
                Daily registrations this month
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className='mb-4'>
              <span className='text-3xl font-bold font-inter'>{stats?.userGrowth?.monthToDate || 0}</span>
              <span className='text-xs text-muted-foreground ml-2'>MTD</span>
            </div>
            {userGrowthData.length > 0 ? (
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
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground italic border border-dashed border-border rounded-lg">
                No registration data available for this month
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout Analytics Chart */}
        <Card className='bg-card border-border'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-foreground'>
              Payout Analytics
            </CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Monthly payouts by token (USD)
            </p>
          </CardHeader>
          <CardContent>
            {payoutAnalyticsData.length > 0 ? (
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
                  {stats?.payoutAnalytics?.reduce((acc: string[], curr) => {
                    if (!acc.includes(curr.token)) acc.push(curr.token)
                    return acc
                  }, []).map((token, index) => (
                    <Line
                      key={token}
                      type='monotone'
                      dataKey={token}
                      stroke={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground italic border border-dashed border-border rounded-lg">
                No payout history available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Status Chart */}
        <Card className='bg-card border-border'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-foreground'>
              Work Status
            </CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Distribution of curated bounties and projects
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
              Quarterly creation of Bounties and Projects
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
