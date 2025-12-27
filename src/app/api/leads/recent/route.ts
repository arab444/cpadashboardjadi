import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const recentLeads = await db.lead.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        offer: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedLeads = recentLeads.map(lead => ({
      id: lead.id,
      subId: lead.subId || 'No Sub ID',
      country: lead.country,
      offerName: lead.offer.name,
      revenue: lead.revenue,
      createdAt: lead.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedLeads)
  } catch (error) {
    console.error('Error fetching recent leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent leads' },
      { status: 500 }
    )
  }
}
