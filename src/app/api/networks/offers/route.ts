import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all network offers
export async function GET() {
  try {
    const offers = await db.networkOffer.findMany({
      include: {
        network: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching network offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network offers' },
      { status: 500 }
    )
  }
}

// POST create new network offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { networkId, externalId, name, payout } = body

    const offer = await db.networkOffer.create({
      data: {
        networkId,
        externalId,
        name,
        payout,
        status: 'active',
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating network offer:', error)
    return NextResponse.json(
      { error: 'Failed to create network offer' },
      { status: 500 }
    )
  }
}
