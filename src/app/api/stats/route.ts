import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'today'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateStart: Date
    let dateEnd: Date

    if (period === 'custom' && startDate && endDate) {
      dateStart = new Date(startDate)
      dateEnd = new Date(endDate)
      dateEnd.setHours(23, 59, 59, 999)
    } else if (period === 'yesterday') {
      const today = new Date()
      dateStart = new Date(today)
      dateStart.setDate(dateStart.getDate() - 1)
      dateStart.setHours(0, 0, 0, 0)
      dateEnd = new Date(today)
      dateEnd.setHours(0, 0, 0, 0)
    } else if (period === 'week') {
      dateEnd = new Date()
      dateStart = new Date(dateEnd)
      dateStart.setDate(dateStart.getDate() - 7)
    } else if (period === 'month') {
      dateEnd = new Date()
      dateStart = new Date(dateEnd)
      dateStart.setDate(dateStart.getDate() - 30)
    } else {
      // Today
      dateStart = new Date()
      dateStart.setHours(0, 0, 0, 0)
      dateEnd = new Date()
    }

    // Calculate today's stats
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const [todayLeadsResult, todayClicksResult] = await Promise.all([
      db.lead.findMany({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
      db.click.findMany({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
    ])

    const [yesterdayLeadsResult, yesterdayClicksResult] = await Promise.all([
      db.lead.findMany({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lt: todayStart,
          },
        },
      }),
      db.click.findMany({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lt: todayStart,
          },
        },
      }),
    ])

    const todayRevenue = todayLeadsResult.reduce((sum, lead) => sum + lead.revenue, 0)
    const yesterdayRevenue = yesterdayLeadsResult.reduce((sum, lead) => sum + lead.revenue, 0)

    const todayTotalClicks = todayClicksResult.length
    const todayTotalLeads = todayLeadsResult.length

    const todayEpc = todayTotalClicks > 0 ? todayRevenue / todayTotalClicks : 0

    const yesterdayEpc = yesterdayClicksResult.length > 0
      ? yesterdayRevenue / yesterdayClicksResult.length
      : 0

    // Calculate change percentages
    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0

    const epcChange = yesterdayEpc > 0
      ? ((todayEpc - yesterdayEpc) / yesterdayEpc) * 100
      : 0

    // Get total all-time stats
    const [totalLeads, totalClicks] = await Promise.all([
      db.lead.count(),
      db.click.count(),
    ])

    const stats = {
      todayRevenue,
      todayEpc,
      totalLeads,
      totalClicks,
      revenueChange: Math.round(revenueChange * 100) / 100,
      epcChange: Math.round(epcChange * 100) / 100,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
