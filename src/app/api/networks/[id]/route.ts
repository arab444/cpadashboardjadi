import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single network
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const network = await db.cPANetwork.findUnique({
      where: { id: params.id },
      include: {
        offers: true,
      },
    })

    if (!network) {
      return NextResponse.json(
        { error: 'Network not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(network)
  } catch (error) {
    console.error('Error fetching network:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network' },
      { status: 500 }
    )
  }
}

// PUT update network
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, displayName, apiKey, apiSecret, postbackUrl, status } = body

    const network = await db.cPANetwork.update({
      where: { id: params.id },
      data: {
        name,
        displayName,
        apiKey,
        apiSecret,
        postbackUrl,
        status,
      },
    })

    return NextResponse.json(network)
  } catch (error) {
    console.error('Error updating network:', error)
    return NextResponse.json(
      { error: 'Failed to update network' },
      { status: 500 }
    )
  }
}

// DELETE network
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cPANetwork.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Network deleted successfully' })
  } catch (error) {
    console.error('Error deleting network:', error)
    return NextResponse.json(
      { error: 'Failed to delete network' },
      { status: 500 }
    )
  }
}
