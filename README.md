# CPA Network Real-time Dashboard

🚀 **Professional Real-time CPA Dashboard** with live updates, built with Next.js 15, TypeScript, and WebSocket.

## ✨ Features

- 📊 **Real-time Statistics** - Revenue, EPC, Clicks, and Leads with live updates
- 🎯 **Live Feeds** - Real-time click and lead notifications
- 📈 **Sub ID Reports** - Detailed performance breakdown by Sub ID
- 🗓️ **Date Filtering** - Today, Yesterday, Last 7/30 Days, Custom Range
- 🎨 **Modern UI** - Responsive design with dark mode support
- 📱 **Mobile Ready** - Works on all devices

## 🚀 Quick Start (3 Steps)

### Option 1: Using Start Script (Recommended)

```bash
# 1. Install dependencies
bun install

# 2. Start everything (WebSocket + Next.js)
./start.sh

# 3. Open browser
# http://localhost:3000
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
bun install

# 2. Setup database
bun run db:push

# 3. Generate sample data
curl -X POST http://localhost:3000/api/seed

# 4. Start WebSocket service (in one terminal)
cd mini-services/cpa-ws-service
bun run dev

# 5. Start Next.js (in another terminal)
bun run dev

# 6. Open browser
# http://localhost:3000
```

## 📱 Access Points

Once running:
- **Dashboard**: http://localhost:3000
- **WebSocket**: http://localhost:3001

## 🌍 Deploy to Free Hosting

### Option 1: Vercel (Easiest) ⭐

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main

# 2. Go to vercel.com and import your repo
# That's it! Your dashboard is live in minutes.
```

📖 **Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Option 2: Railway (Full Stack)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Deploy
railway init
railway up

# That's it! Railway handles everything including database.
```

## 📊 API Endpoints

```bash
# Statistics
GET /api/stats?period=today
GET /api/stats?period=week
GET /api/stats?startDate=2024-01-01&endDate=2024-01-31

# Recent Data
GET /api/clicks/recent
GET /api/leads/recent

# Reports
GET /api/reports/subid?period=today
GET /api/reports/subid?startDate=2024-01-01&endDate=2024-01-31

# Generate Sample Data
POST /api/seed
```

## 🏗️ Architecture

```
├── src/app/
│   ├── api/
│   │   ├── stats/          # Statistics API
│   │   ├── clicks/         # Click tracking
│   │   ├── leads/          # Lead tracking
│   │   ├── reports/        # Sub ID reports
│   │   └── seed/           # Sample data
│   ├── page.tsx            # Main dashboard
│   └── layout.tsx          # Root layout
├── mini-services/
│   └── cpa-ws-service/     # WebSocket service (port 3001)
├── prisma/
│   └── schema.prisma       # Database schema
└── db/
    └── custom.db           # SQLite database
```

## 🎯 Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Real-time**: Socket.io
- **ORM**: Prisma

## 📚 Documentation

- [Full Documentation](./CPA_README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🛠️ Troubleshooting

### WebSocket Not Connecting
```bash
# Check if WebSocket is running
ps aux | grep "bun --hot index.ts"

# View WebSocket logs
tail -f mini-services/cpa-ws-service/ws.log
```

### Database Issues
```bash
# Reset database
rm -rf db/custom.db
bun run db:push
curl -X POST http://localhost:3000/api/seed
```

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules
bun install
bun run build
```

## 📝 Environment Variables

Create `.env` file:
```
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

## 🚢 Production Tips

- Use PostgreSQL for production (see Deployment Guide)
- Deploy WebSocket service separately
- Enable caching headers
- Set up monitoring

## 🎨 Customization

### Add New Offers
```bash
# Via API or directly in database
```

### Modify Design
Edit `src/app/page.tsx` and `src/app/globals.css`

### Add New Features
- Add new API routes in `src/app/api/`
- Add new components in `src/components/`

## 📊 Sample Data

The dashboard includes sample data generator:
- 500 clicks (random dates over 7 days)
- 50 leads (random dates over 7 days)
- 10 Sub IDs
- 10 Countries

Generate anytime:
```bash
curl -X POST http://localhost:3000/api/seed
```

## 🤝 Support

- Check logs: `tail -f dev.log`
- WebSocket logs: `tail -f mini-services/cpa-ws-service/ws.log`
- Review documentation files

## 📄 License

MIT License - Free to use for any purpose!

---

**Built with ❤️ using Next.js 15, TypeScript, and Socket.io**

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
