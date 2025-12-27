import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const recentClicks = await db.click.findMany({
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

    const formattedClicks = recentClicks.map(click => ({
      id: click.id,
      subId: click.subId || 'No Sub ID',
      country: click.country,
      offerName: click.offer.name,
      createdAt: click.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedClicks)
  } catch (error) {
    console.error('Error fetching recent clicks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent clicks' },
      { status: 500 }
    )
  }
}
