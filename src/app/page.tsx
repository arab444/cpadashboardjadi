'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, MousePointer2, Users, BarChart3, Settings } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface Click {
  id: string
  subId: string
  country: string
  offerName: string
  createdAt: string
}

interface Lead {
  id: string
  subId: string
  country: string
  offerName: string
  revenue: number
  createdAt: string
}

interface Stats {
  todayRevenue: number
  todayEpc: number
  totalLeads: number
  totalClicks: number
  revenueChange: number
  epcChange: number
}

interface SubIdReport {
  subId: string
  clicks: number
  leads: number
  revenue: number
  conversionRate: number
}

export default function Dashboard() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [stats, setStats] = useState<Stats>({
    todayRevenue: 0,
    todayEpc: 0,
    totalLeads: 0,
    totalClicks: 0,
    revenueChange: 0,
    epcChange: 0,
  })
  const [recentClicks, setRecentClicks] = useState<Click[]>([])
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [subIdReports, setSubIdReports] = useState<SubIdReport[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [filterPeriod, setFilterPeriod] = useState('today')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('/?XTransformPort=3001')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    newSocket.on('stats_update', (data) => {
      setStats(data)
    })

    newSocket.on('new_click', (click) => {
      setRecentClicks((prev) => [click, ...prev].slice(0, 10))
    })

    newSocket.on('new_lead', (lead) => {
      setRecentLeads((prev) => [lead, ...prev].slice(0, 10))
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    // Fetch initial data
    fetchStats()
    fetchRecentClicks()
    fetchRecentLeads()
    fetchSubIdReports()
  }, [filterPeriod, startDate, endDate])

  const fetchStats = async () => {
    try {
      const url = filterPeriod === 'custom'
        ? `/api/stats?startDate=${startDate}&endDate=${endDate}`
        : `/api/stats?period=${filterPeriod}`
      const response = await fetch(url)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentClicks = async () => {
    try {
      const response = await fetch('/api/clicks/recent')
      const data = await response.json()
      setRecentClicks(data)
    } catch (error) {
      console.error('Error fetching recent clicks:', error)
    }
  }

  const fetchRecentLeads = async () => {
    try {
      const response = await fetch('/api/leads/recent')
      const data = await response.json()
      setRecentLeads(data)
    } catch (error) {
      console.error('Error fetching recent leads:', error)
    }
  }

  const fetchSubIdReports = async () => {
    try {
      const url = filterPeriod === 'custom'
        ? `/api/reports/subid?startDate=${startDate}&endDate=${endDate}`
        : `/api/reports/subid?period=${filterPeriod}`
      const response = await fetch(url)
      const data = await response.json()
      setSubIdReports(data)
    } catch (error) {
      console.error('Error fetching subid reports:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'ID': '🇮🇩',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'BR': '🇧🇷',
      'IN': '🇮🇳',
      'JP': '🇯🇵',
    }
    return flags[country] || '🌍'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  CPA Network
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time Performance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Period Filter */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {filterPeriod === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          )}
          <Button onClick={() => {
            fetchStats()
            fetchSubIdReports()
          }} size="sm">
            Apply Filter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Today's Revenue */}
              <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Today's Revenue</span>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">{formatCurrency(stats.todayRevenue)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    {stats.revenueChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stats.revenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
                    </span>
                    <span className="text-slate-500 ml-2">vs yesterday</span>
                  </div>
                </CardContent>
              </Card>

              {/* EPC */}
              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Today's EPC</span>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">${stats.todayEpc.toFixed(3)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    {stats.epcChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stats.epcChange >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {stats.epcChange >= 0 ? '+' : ''}{stats.epcChange}%
                    </span>
                    <span className="text-slate-500 ml-2">vs yesterday</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Leads */}
              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Total Leads</span>
                    <Users className="h-4 w-4 text-purple-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">{formatNumber(stats.totalLeads)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-slate-500">
                    <span>Converting at</span>
                    <Badge variant="secondary" className="ml-2">
                      {stats.totalClicks > 0 ? ((stats.totalLeads / stats.totalClicks) * 100).toFixed(2) : 0}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Total Clicks */}
              <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Total Clicks</span>
                    <MousePointer2 className="h-4 w-4 text-orange-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">{formatNumber(stats.totalClicks)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-slate-500">
                    <span>Across all campaigns</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Feeds */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Clicks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer2 className="h-5 w-5 text-orange-500" />
                    Recent Clicks
                    <Badge variant="outline" className="ml-auto">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {recentClicks.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No clicks yet</p>
                    ) : (
                      recentClicks.map((click) => (
                        <div
                          key={click.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCountryFlag(click.country)}</span>
                            <div>
                              <p className="font-medium text-sm">{click.subId || 'No Sub ID'}</p>
                              <p className="text-xs text-slate-500">{click.offerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">{formatTime(click.createdAt)}</p>
                            <Badge variant="outline" className="text-xs">Click</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Recent Leads
                    <Badge variant="outline" className="ml-auto">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {recentLeads.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No leads yet</p>
                    ) : (
                      recentLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-950/30 dark:hover:to-teal-950/30 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCountryFlag(lead.country)}</span>
                            <div>
                              <p className="font-medium text-sm">{lead.subId || 'No Sub ID'}</p>
                              <p className="text-xs text-slate-500">{lead.offerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(lead.revenue)}
                            </p>
                            <p className="text-xs text-slate-500">{formatTime(lead.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sub ID Performance Report</CardTitle>
                <CardDescription>Detailed breakdown of clicks, leads, and revenue by Sub ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sub ID</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">Leads</TableHead>
                        <TableHead className="text-right">Conversion Rate</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subIdReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        subIdReports.map((report) => (
                          <TableRow key={report.subId}>
                            <TableCell className="font-medium">{report.subId || 'No Sub ID'}</TableCell>
                            <TableCell className="text-right">{formatNumber(report.clicks)}</TableCell>
                            <TableCell className="text-right">{formatNumber(report.leads)}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={report.conversionRate > 5 ? 'default' : 'secondary'}>
                                {report.conversionRate.toFixed(2)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(report.revenue)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} CPA Network Dashboard. Built with Next.js 15 & WebSocket.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
