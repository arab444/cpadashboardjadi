# CPA Network Real-time Dashboard

A professional real-time CPA (Cost Per Action) dashboard built with Next.js 15, TypeScript, Tailwind CSS, and WebSocket for live updates.

## Features

✨ **Real-time Statistics**
- Today's Revenue with daily comparison
- Earnings Per Click (EPC) tracking
- Total Clicks and Leads counters
- Percentage change indicators

📊 **Live Feeds**
- Real-time Click notifications
- Real-time Lead conversions
- Country flags for geographic tracking
- Timestamp updates

📈 **Reports & Analytics**
- Sub ID performance breakdown
- Click-to-lead conversion rates
- Revenue by Sub ID
- Date range filtering (Today, Yesterday, Last 7 Days, Last 30 Days, Custom)

🎨 **Modern UI**
- Responsive design (Mobile, Tablet, Desktop)
- Dark mode support
- Smooth animations
- shadcn/ui components
- Tailwind CSS styling

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Real-time**: Socket.io WebSocket (port 3001)
- **State Management**: React Hooks

### Project Structure
```
my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── stats/          # Statistics endpoint
│   │   │   ├── clicks/         # Click tracking
│   │   │   ├── leads/          # Lead tracking
│   │   │   ├── reports/        # Sub ID reports
│   │   │   └── seed/           # Sample data generator
│   │   ├── page.tsx            # Main dashboard
│   │   └── layout.tsx          # Root layout
│   └── components/ui/           # shadcn/ui components
├── mini-services/
│   └── cpa-ws-service/         # WebSocket service
│       ├── index.ts            # Socket.io server
│       └── package.json
├── prisma/
│   └── schema.prisma           # Database schema
└── db/
    └── custom.db               # SQLite database
```

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- SQLite (included)

### Local Development

1. **Install dependencies**
```bash
bun install
```

2. **Setup database**
```bash
bun run db:push
```

3. **Generate sample data** (optional but recommended)
```bash
curl -X POST http://localhost:3000/api/seed
```

4. **Start WebSocket service** (in one terminal)
```bash
cd mini-services/cpa-ws-service
bun run dev
```

The WebSocket service will run on port 3001.

5. **Start Next.js development server** (in another terminal)
```bash
bun run dev
```

6. **Access the dashboard**
Open your browser and visit:
```
http://localhost:3000
```

## API Endpoints

### Statistics
```
GET /api/stats?period=today
GET /api/stats?period=yesterday
GET /api/stats?period=week
GET /api/stats?period=month
GET /api/stats?startDate=2024-01-01&endDate=2024-01-31
```

### Recent Clicks
```
GET /api/clicks/recent
```

### Recent Leads
```
GET /api/leads/recent
```

### Sub ID Reports
```
GET /api/reports/subid?period=today
GET /api/reports/subid?period=week
GET /api/reports/subid?startDate=2024-01-01&endDate=2024-01-31
```

### Generate Sample Data
```
POST /api/seed
```

## Database Schema

### Models

**Campaign**
- id, name, description, status, timestamps
- Has many Offers

**Offer**
- id, campaignId, name, description, payout, status, timestamps
- Belongs to Campaign, has many Clicks and Leads

**Click**
- id, offerId, subId, country, ip, userAgent, timestamp
- Belongs to Offer

**Lead**
- id, offerId, subId, country, revenue, status, timestamp
- Belongs to Offer

## Real-time Updates

The dashboard uses Socket.io for real-time updates:

### Events
- `stats_update`: Broadcast every 5 seconds with latest statistics
- `new_click`: Emitted when a new click is detected
- `new_lead`: Emitted when a new lead/conversion is detected

### WebSocket Connection
```javascript
const socket = io('/?XTransformPort=3001')

socket.on('connect', () => {
  console.log('Connected to WebSocket')
})

socket.on('stats_update', (data) => {
  // Handle stats update
})

socket.on('new_click', (click) => {
  // Handle new click
})

socket.on('new_lead', (lead) => {
  // Handle new lead
})
```

## Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   - Commit and push your code to a GitHub repository

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository

3. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   DATABASE_URL=file:./data.db
   ```
   Note: For production, use a managed database like PostgreSQL

4. **Deploy WebSocket Service**
   - Deploy to a separate service (e.g., Railway, Render, Heroku)
   - Update WebSocket URL in production:
     ```javascript
     const socket = io('YOUR_WSS_URL')
     ```

### Deploy to Netlify

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "bun run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Environment Variables**
   - Set `DATABASE_URL` in Netlify dashboard

3. **Deploy WebSocket Separately**
   - Use Netlify Functions or external service

### Deploy with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install -g bun && bun install

COPY . .
RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
```

Build and run:
```bash
docker build -t cpa-dashboard .
docker run -p 3000:3000 cpa-dashboard
```

## Production Considerations

### Database
- **Development**: SQLite (current setup)
- **Production**: PostgreSQL or MySQL recommended
  - Update `DATABASE_URL` in `.env`
  - Update Prisma schema provider
  - Run `bun run db:push`

### Authentication
Add authentication for production:
```bash
bun add next-auth
```

Implement user authentication in the dashboard.

### WebSocket Scaling
For high-traffic applications:
- Use Redis Socket.io adapter
- Deploy multiple WebSocket instances
- Use a load balancer

### Performance Optimization
- Enable Prisma Accelerate for faster queries
- Implement database indexing
- Use CDN for static assets
- Enable caching headers

## Monitoring & Analytics

### WebSocket Logs
```bash
tail -f mini-services/cpa-ws-service/ws.log
```

### Application Logs
```bash
tail -f dev.log
```

### Database Queries
Enable Prisma logging in `.env`:
```
LOG_LEVEL=debug
```

## Troubleshooting

### WebSocket Not Connecting
- Verify WebSocket service is running on port 3001
- Check firewall settings
- Ensure correct URL format: `/?XTransformPort=3001`

### Sample Data Not Appearing
- Check database connection
- Verify `/api/seed` completed successfully
- Refresh dashboard page

### Stats Not Updating
- Check WebSocket connection in browser console
- Verify polling intervals in `cpa-ws-service/index.ts`
- Ensure database is being updated

## License

MIT License - feel free to use this project for your CPA network!

## Support

For issues and questions:
- Check the GitHub Issues
- Review API documentation
- Examine WebSocket service logs

## Future Enhancements

- [ ] User authentication & authorization
- [ ] Multiple campaign management
- [ ] Advanced filtering & search
- [ ] Export reports (CSV, PDF)
- [ ] Customizable dashboard widgets
- [ ] Email notifications for leads
- [ ] Integration with affiliate networks
- [ ] Mobile app (React Native)
- [ ] Admin panel for network management
- [ ] Real-time chat support

---

**Built with ❤️ using Next.js 15, TypeScript, and Socket.io**
