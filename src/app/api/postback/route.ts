import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Postback endpoint for CPA networks to send conversion data
export async function GET(request: NextRequest) {
  return handlePostback(request)
}

export async function POST(request: NextRequest) {
  return handlePostback(request)
}

async function handlePostback(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Get postback parameters
    const networkName = searchParams.get('network') || searchParams.get('net')
    const apiKey = searchParams.get('api_key')
    const externalId = searchParams.get('external_id') || searchParams.get('offer_id')
    const subId = searchParams.get('subid') || searchParams.get('sub_id') || searchParams.get('subid1')
    const payout = searchParams.get('payout')
    const revenue = searchParams.get('revenue') || payout
    const country = searchParams.get('country') || searchParams.get('ctry') || 'US'
    const status = searchParams.get('status') || 'approved'
    const ip = searchParams.get('ip') || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Validate API key
    if (!networkName || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: network and api_key' },
        { status: 400 }
      )
    }

    // Find the network
    const network = await db.cPANetwork.findFirst({
      where: {
        name: networkName,
        apiKey: apiKey,
        status: 'active',
      },
    })

    if (!network) {
      return NextResponse.json(
        { error: 'Invalid network or API key' },
        { status: 401 }
      )
    }

    // Find the offer by external ID
    const offer = await db.networkOffer.findFirst({
      where: {
        networkId: network.id,
        externalId: externalId,
        status: 'active',
      },
    })

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found for this network' },
        { status: 404 }
      )
    }

    // Check if this conversion already exists
    const existingLead = await db.lead.findFirst({
      where: {
        externalId: externalId,
        networkId: network.id,
      },
    })

    if (existingLead) {
      // Return success if already processed (idempotent)
      return NextResponse.json({
        success: true,
        message: 'Conversion already processed',
        leadId: existingLead.id,
      })
    }

    // Create or find the offer in our system
    const ourOffer = await db.offer.findFirst({
      where: {
        name: { contains: offer.name },
      },
    })

    if (!ourOffer) {
      // Create a new offer if it doesn't exist
      await db.offer.create({
        data: {
          campaignId: 'default', // You might want to handle this differently
          name: offer.name,
          description: `Imported from ${network.displayName || network.name}`,
          payout: parseFloat(revenue) || offer.payout,
          status: 'active',
        },
      })
    }

    // Create the lead record
    const lead = await db.lead.create({
      data: {
        offerId: ourOffer?.id || 'default',
        networkId: network.id,
        externalId: externalId,
        subId: subId,
        country: country,
        revenue: parseFloat(revenue) || offer.payout || 0,
        status: status,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Conversion recorded successfully',
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Error processing postback:', error)
    return NextResponse.json(
      { error: 'Failed to process postback' },
      { status: 500 }
    )
  }
}
