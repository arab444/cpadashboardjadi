import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const PORT = 3001

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

let connectedClients = 0

// Broadcast stats update every 5 seconds
setInterval(async () => {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const [todayLeads, todayClicks, yesterdayLeads, yesterdayClicks] = await Promise.all([
      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
      prisma.click.findMany({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lt: todayStart,
          },
        },
      }),
      prisma.click.findMany({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lt: todayStart,
          },
        },
      }),
    ])

    const todayRevenue = todayLeads.reduce((sum, lead) => sum + lead.revenue, 0)
    const yesterdayRevenue = yesterdayLeads.reduce((sum, lead) => sum + lead.revenue, 0)

    const todayTotalClicks = todayClicks.length
    const todayTotalLeads = todayLeads.length

    const todayEpc = todayTotalClicks > 0 ? todayRevenue / todayTotalClicks : 0

    const yesterdayEpc = yesterdayClicks.length > 0
      ? yesterdayRevenue / yesterdayClicks.length
      : 0

    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0

    const epcChange = yesterdayEpc > 0
      ? ((todayEpc - yesterdayEpc) / yesterdayEpc) * 100
      : 0

    const [totalLeads, totalClicks] = await Promise.all([
      prisma.lead.count(),
      prisma.click.count(),
    ])

    const stats = {
      todayRevenue,
      todayEpc,
      totalLeads,
      totalClicks,
      revenueChange: Math.round(revenueChange * 100) / 100,
      epcChange: Math.round(epcChange * 100) / 100,
    }

    io.emit('stats_update', stats)
  } catch (error) {
    console.error('Error broadcasting stats:', error)
  }
}, 5000)

// Listen for database changes (simulated by polling)
// In production, you'd use Prisma's webhook or database triggers
setInterval(async () => {
  try {
    // Check for new clicks in the last 2 seconds
    const twoSecondsAgo = new Date(Date.now() - 2000)

    const recentClicks = await prisma.click.findMany({
      where: {
        createdAt: {
          gte: twoSecondsAgo,
        },
      },
      include: {
        offer: {
          select: {
            name: true,
          },
        },
      },
    })

    const recentLeads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: twoSecondsAgo,
        },
      },
      include: {
        offer: {
          select: {
            name: true,
          },
        },
      },
    })

    // Broadcast new clicks
    for (const click of recentClicks) {
      const formattedClick = {
        id: click.id,
        subId: click.subId || 'No Sub ID',
        country: click.country,
        offerName: click.offer.name,
        createdAt: click.createdAt.toISOString(),
      }
      io.emit('new_click', formattedClick)
    }

    // Broadcast new leads
    for (const lead of recentLeads) {
      const formattedLead = {
        id: lead.id,
        subId: lead.subId || 'No Sub ID',
        country: lead.country,
        offerName: lead.offer.name,
        revenue: lead.revenue,
        createdAt: lead.createdAt.toISOString(),
      }
      io.emit('new_lead', formattedLead)
    }
  } catch (error) {
    console.error('Error polling database:', error)
  }
}, 2000)

io.on('connection', (socket) => {
  connectedClients++
  console.log(`Client connected. Total: ${connectedClients}`)

  socket.on('disconnect', () => {
    connectedClients--
    console.log(`Client disconnected. Total: ${connectedClients}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})
