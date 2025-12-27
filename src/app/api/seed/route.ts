import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const countries = ['US', 'UK', 'DE', 'FR', 'ID', 'CA', 'AU', 'BR', 'IN', 'JP']
const subIds = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'sub8', 'sub9', 'sub10']

export async function POST() {
  try {
    // Create a campaign and offers if they don't exist
    let campaign = await db.campaign.findFirst({
      where: { name: 'Main Campaign' },
    })

    if (!campaign) {
      campaign = await db.campaign.create({
        data: {
          name: 'Main Campaign',
          description: 'Primary CPA campaign',
          status: 'active',
        },
      })
    }

    const offers = await db.offer.findMany({
      where: { campaignId: campaign.id },
    })

    let offerId = offers[0]?.id

    if (!offerId) {
      const offer = await db.offer.create({
        data: {
          campaignId: campaign.id,
          name: 'Email Submit Offer',
          description: 'Simple email submit CPA offer',
          payout: 2.50,
          status: 'active',
        },
      })
      offerId = offer.id
    }

    // Generate sample clicks for the last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const clickCount = 500
    const leadCount = 50

    // Create clicks
    for (let i = 0; i < clickCount; i++) {
      const randomTime = new Date(
        sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
      )

      await db.click.create({
        data: {
          offerId,
          subId: subIds[Math.floor(Math.random() * subIds.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0',
          createdAt: randomTime,
        },
      })
    }

    // Create leads
    for (let i = 0; i < leadCount; i++) {
      const randomTime = new Date(
        sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
      )

      await db.lead.create({
        data: {
          offerId,
          subId: subIds[Math.floor(Math.random() * subIds.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
          revenue: 2.50,
          status: 'approved',
          createdAt: randomTime,
        },
      })
    }

    return NextResponse.json({
      message: `Successfully created ${clickCount} clicks and ${leadCount} leads`,
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
