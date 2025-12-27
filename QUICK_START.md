# Quick Start Guide - CPA Dashboard

## 📦 File ZIP Information

- **File:** cpa-dashboard.zip
- **Size:** 4.2 MB
- **Contains:** Complete Next.js 15 CPA dashboard with all features

## 🚀 Quick Installation

### 1. Extract the ZIP

```bash
unzip cpa-dashboard.zip
cd my-project
```

### 2. Install Dependencies

```bash
bun install
```

Or if using npm:
```bash
npm install
```

### 3. Setup Database

```bash
bun run db:push
```

### 4. Generate Sample Data (Optional)

```bash
curl -X POST http://localhost:3000/api/seed
```

### 5. Start Services

**Option A: Automatic Start (Recommended)**
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual Start**

Terminal 1 - WebSocket Service:
```bash
cd mini-services/cpa-ws-service
bun install
bun run dev
```

Terminal 2 - Next.js App:
```bash
bun run dev
```

### 6. Access Dashboard

Open your browser:
```
http://localhost:3000
```

## 📱 What's Included

### Frontend
- ✅ Real-time Dashboard
- ✅ Statistics Cards (Revenue, EPC, Clicks, Leads)
- ✅ Recent Clicks & Leads feeds
- ✅ Sub ID Reports with date filtering
- ✅ Network Settings page
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark mode support
- ✅ Toast notifications

### Backend
- ✅ Next.js 15 API routes
- ✅ Prisma ORM with SQLite
- ✅ WebSocket service (Socket.io)
- ✅ Postback endpoint for CPA networks
- ✅ Network management API

### Integrations
- ✅ ClickDealer support
- ✅ Trafee support
- ✅ Adverten support
- ✅ Extensible for more networks

### Documentation
- 📄 CPA_README.md - Main README
- 📄 CPA_INTEGRATION_GUIDE.md - Integration guide
- 📄 DEPLOYMENT_GUIDE.md - Deployment instructions
- 📄 THIS_FILE - Quick start guide

## 🔧 Configuration

### Environment Variables

Create `.env` file (already included):
```
DATABASE_URL=file:./db/custom.db
```

### Database Location

Database files are in:
```
db/custom.db
```

## 🌐 Deploy to Hosting

### Vercel (Recommended - Free)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"

3. **Set Environment Variables**
   - Add `DATABASE_URL` in Vercel settings
   - For production, use PostgreSQL (see DEPLOYMENT_GUIDE.md)

### Railway (Free with Database)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Netlify (Free)

1. Create `netlify.toml`:
```toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Push to GitHub and connect Netlify

### Render.com (Free)

1. Push to GitHub
2. Create Web Service on Render
3. Configure:
   - Build: `bun install && bun run build`
   - Start: `bun start`
   - Port: 3000

## 🔌 CPA Network Integration

### Quick Steps

1. **Access Settings**
   - Go to: `http://localhost:3000/settings`
   - Click "Add Network"

2. **Select Network**
   - Choose: ClickDealer, Trafee, or Adverten
   - Enter API key from network

3. **Get Postback URL**
   - Copy the generated postback URL
   - It looks like:
     ```
     https://yourdomain.com/api/postback?network=clickdealer&api_key=YOUR_KEY&...
     ```

4. **Configure in Network**
   - Paste postback URL in CPA network settings
   - Replace placeholders with network variables

5. **Test Integration**
   ```bash
   curl "http://localhost:3000/api/postback?network=clickdealer&api_key=YOUR_KEY&external_id=TEST&subid=test&revenue=2.50&country=US&status=approved"
   ```

See `CPA_INTEGRATION_GUIDE.md` for detailed instructions.

## 📊 Features Overview

### Real-time Dashboard
- Live statistics updates every 5 seconds
- New click notifications
- New lead notifications
- Animated status indicators

### Analytics
- Today's revenue with daily comparison
- EPC (Earnings Per Click)
- Total clicks and leads
- Conversion rate tracking

### Reports
- Sub ID performance breakdown
- Date range filtering (Today, Yesterday, 7 Days, 30 Days, Custom)
- Click-to-lead conversion rates
- Revenue by Sub ID

### Network Management
- Add multiple CPA networks
- Edit network configurations
- Delete unused networks
- Status management (Active/Inactive)
- Postback URL generation

## 🛡️ Security

- API key validation for postbacks
- Password protection for sensitive fields
- No duplicate conversions (idempotent)
- Input validation

## 📱 Responsive Design

- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)
- ✅ Touch-friendly interface
- ✅ Optimized for all screen sizes

## 🎨 UI Components

Built with shadcn/ui:
- Cards, Buttons, Inputs
- Tables, Badges, Dialogs
- Tabs, Select, Textarea
- Toasts, Alerts, Progress bars
- And 40+ more components!

## 🐛 Troubleshooting

### Database Error
```bash
# Delete and recreate database
rm db/custom.db
bun run db:push
```

### WebSocket Not Connecting
```bash
# Check if service is running
ps aux | grep "bun --hot index.ts"

# Check logs
tail -f mini-services/cpa-ws-service/ws.log
```

### Error: "Cannot find package 'socket.io'"

This error occurs when WebSocket service dependencies aren't installed properly.

**Solution:**
```bash
# Install WebSocket service dependencies
cd mini-services/cpa-ws-service
rm -rf node_modules bun.lock
bun install

# Restart WebSocket service
bun run dev
```

Or use the start script:
```bash
./start.sh
```

### Error: "Cannot find package 'socket.io-client'"

This error occurs when frontend dependencies aren't installed.

**Solution:**
```bash
# Install frontend dependencies
bun add socket.io-client @types/socket.io-client

# Or reinstall all dependencies
rm -rf node_modules bun.lock
bun install
```

### Build Errors
```bash
# Clear cache
rm -rf .next
bun run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

## 📚 Documentation Files

1. **README.md** - Original scaffold documentation
2. **CPA_README.md** - Complete CPA dashboard README
3. **CPA_INTEGRATION_GUIDE.md** - Integration with CPA networks
4. **DEPLOYMENT_GUIDE.md** - Free hosting deployment guide
5. **QUICK_START.md** - This file

## 🆘 Support & Help

### For Issues
1. Check troubleshooting section above
2. Review logs in `dev.log`
3. Review WebSocket logs in `mini-services/cpa-ws-service/ws.log`
4. Read documentation files

### Documentation
- Check `CPA_INTEGRATION_GUIDE.md` for network integration
- Check `DEPLOYMENT_GUIDE.md` for hosting deployment
- Check `CPA_README.md` for detailed features

## 📝 Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── settings/page.tsx     # Network settings
│   │   └── api/                 # API endpoints
│   ├── components/ui/             # shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   └── lib/                      # Utilities & DB client
├── prisma/
│   └── schema.prisma             # Database schema
├── mini-services/
│   └── cpa-ws-service/         # WebSocket service
├── db/
│   └── custom.db                 # SQLite database
├── public/                       # Static assets
├── package.json                  # Dependencies
├── start.sh                     # Quick start script
└── Documentation files
```

## 🎉 You're Ready to Go!

### Next Steps:
1. ✅ Extract the ZIP
2. ✅ Run `bun install`
3. ✅ Run `bun run db:push`
4. ✅ Run `./start.sh` or start services manually
5. ✅ Open http://localhost:3000
6. ✅ Add sample data: `curl -X POST http://localhost:3000/api/seed`
7. ✅ Configure CPA networks in Settings
8. ✅ Copy postback URL to your network
9. ✅ Start receiving conversions!

### Deploy to Production:
1. Push to GitHub
2. Connect to Vercel/Railway/Netlify
3. Set environment variables
4. Deploy!
5. Configure postback URLs with your domain

---

**Built with Next.js 15, TypeScript, Prisma, and Socket.io**

**Ready for free hosting deployment!** 🚀
