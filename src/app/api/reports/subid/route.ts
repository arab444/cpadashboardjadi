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

    // Get all clicks within the date range
    const clicks = await db.click.findMany({
      where: {
        createdAt: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    })

    // Get all leads within the date range
    const leads = await db.lead.findMany({
      where: {
        createdAt: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    })

    // Group clicks by subId
    const clicksBySubId = clicks.reduce((acc, click) => {
      const subId = click.subId || 'No Sub ID'
      if (!acc[subId]) {
        acc[subId] = 0
      }
      acc[subId]++
      return acc
    }, {} as Record<string, number>)

    // Group leads by subId
    const leadsBySubId = leads.reduce((acc, lead) => {
      const subId = lead.subId || 'No Sub ID'
      if (!acc[subId]) {
        acc[subId] = 0
      }
      acc[subId] += lead.revenue
      return acc
    }, {} as Record<string, number>)

    // Count leads by subId
    const leadCountBySubId = leads.reduce((acc, lead) => {
      const subId = lead.subId || 'No Sub ID'
      if (!acc[subId]) {
        acc[subId] = 0
      }
      acc[subId]++
      return acc
    }, {} as Record<string, number>)

    // Get all unique subIds
    const allSubIds = new Set([
      ...Object.keys(clicksBySubId),
      ...Object.keys(leadsBySubId),
    ])

    // Generate report
    const report = Array.from(allSubIds).map(subId => {
      const clickCount = clicksBySubId[subId] || 0
      const leadCount = leadCountBySubId[subId] || 0
      const revenue = leadsBySubId[subId] || 0
      const conversionRate = clickCount > 0 ? (leadCount / clickCount) * 100 : 0

      return {
        subId,
        clicks: clickCount,
        leads: leadCount,
        revenue,
        conversionRate,
      }
    })

    // Sort by revenue descending
    report.sort((a, b) => b.revenue - a.revenue)

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error fetching sub ID reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sub ID reports' },
      { status: 500 }
    )
  }
}
