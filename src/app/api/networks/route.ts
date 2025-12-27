import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all networks
export async function GET() {
  try {
    const networks = await db.cPANetwork.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        offers: {
          where: {
            status: 'active',
          },
        },
      },
    })

    return NextResponse.json(networks)
  } catch (error) {
    console.error('Error fetching networks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch networks' },
      { status: 500 }
    )
  }
}

// POST create new network
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, apiKey, apiSecret, postbackUrl } = body

    const network = await db.cPANetwork.create({
      data: {
        name,
        displayName,
        apiKey,
        apiSecret,
        postbackUrl,
        status: 'active',
      },
    })

    return NextResponse.json(network, { status: 201 })
  } catch (error) {
    console.error('Error creating network:', error)
    return NextResponse.json(
      { error: 'Failed to create network' },
      { status: 500 }
    )
  }
}
