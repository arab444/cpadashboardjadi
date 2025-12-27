# Quick Deployment Guide - Free Hosting Options

This guide shows you how to deploy your CPA Dashboard to free hosting platforms.

## Option 1: Vercel (Recommended & Easiest)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy"

That's it! Your dashboard will be live in minutes.

### Step 3: Set Environment Variables (Optional)
If you want to use PostgreSQL instead of SQLite:
1. Go to your Vercel project settings
2. Add environment variable: `DATABASE_URL=your_postgresql_connection_string`
3. Redeploy

**Note**: SQLite works fine on Vercel for small to medium traffic. The database file will be redeployed on each deploy, so changes won't persist across deployments. For production, use a free PostgreSQL tier from:
- Supabase (free tier)
- Neon (free tier)
- Railway (free tier)
- PlanetScale (free tier)

### WebSocket Service on Vercel
Vercel is serverless, so WebSocket won't work directly. Options:
1. **Disable real-time** (recommended for free tier): Dashboard will still work, just without live updates
2. **Deploy WebSocket separately**: Use Railway free tier for WebSocket service

## Option 2: Netlify

### Step 1: Create netlify.toml
Create this file in your project root:

```toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Push to GitHub
(See Vercel Step 1)

### Step 3: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Click "Deploy site"

### Environment Variables
Same as Vercel, add `DATABASE_URL` in Netlify dashboard.

## Option 3: Railway (Full Stack with Database)

Railway is perfect because it supports both web apps and databases!

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy
```bash
railway init
railway up
```

Railway will automatically:
- Deploy your Next.js app
- Provide a PostgreSQL database
- Set up environment variables

### Step 4: Update Database Schema
```bash
railway run db:push
```

## Option 4: Render.com

### Step 1: Push to GitHub
(See Vercel Step 1)

### Step 2: Create Web Service on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `bun install && bun run build`
   - Start Command: `bun start`
5. Click "Create Web Service"

### Add Database (Optional)
1. Click "New +" → "PostgreSQL"
2. Render will provide connection string
3. Add `DATABASE_URL` environment variable to your web service

## WebSocket Service Deployment (for Real-time Features)

### Option 1: Railway (Recommended)
```bash
cd mini-services/cpa-ws-service
railway init
railway up
```

### Option 2: Render
1. Create a new Web Service on Render
2. Point to `mini-services/cpa-ws-service` folder or create a separate repo
3. Configure:
   - Build Command: `cd mini-services/cpa-ws-service && bun install`
   - Start Command: `cd mini-services/cpa-ws-service && bun run dev`
   - Port: 3001

### Option 3: Disable WebSocket (Easiest for Free Tier)
If you don't want to deploy WebSocket separately, modify `src/app/page.tsx`:

Find and comment out this section:
```typescript
// Comment out WebSocket connection for deployment
/*
useEffect(() => {
  const newSocket = io('/?XTransformPort=3001')
  // ... rest of WebSocket code
}, [])
*/

// Comment out socket listeners
/*
newSocket.on('stats_update', (data) => { ... })
newSocket.on('new_click', (click) => { ... })
newSocket.on('new_lead', (lead) => { ... })
*/
```

The dashboard will still work with:
- ✅ Statistics cards
- ✅ Recent clicks & leads
- ✅ Sub ID reports
- ✅ Date filtering
- ❌ Real-time updates (will need to refresh page)

## Database Options (Free Tiers)

### Option 1: SQLite (Default)
- ✅ Easy to setup
- ✅ Works locally
- ⚠️ Changes don't persist across deployments (Vercel/Netlify)
- ✅ Works on Railway/Render

### Option 2: PostgreSQL (Recommended for Production)

**Supabase** (free tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Set `DATABASE_URL` environment variable

**Neon** (free tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a project
3. Get connection string
4. Set `DATABASE_URL` environment variable

**Railway PostgreSQL** (free tier)
- Automatically included when you deploy to Railway
- No additional setup needed

To use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run:
```bash
bunx prisma generate
bun run db:push
```

## Quick Start: Ready in 5 Minutes

### Option A: Vercel (Fastest)
1. Push to GitHub
2. Import to Vercel
3. Done! 🎉

### Option B: Railway (Full Stack)
1. Install Railway CLI
2. `railway init`
3. `railway up`
4. Done! 🎉 (includes PostgreSQL database)

## Troubleshooting

### Build Fails
- Ensure `bun install` works
- Check `package.json` scripts
- Verify all dependencies are installed

### Database Connection Error
- Check `DATABASE_URL` environment variable
- Verify database is running
- Test connection locally first

### WebSocket Not Working
- Verify WebSocket service is deployed
- Check WebSocket service URL
- Consider disabling WebSocket for free tier

## Production Checklist

Before going live:

- [ ] Push to GitHub
- [ ] Set up production database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Test build locally: `bun run build`
- [ ] Deploy to hosting platform
- [ ] Test deployed application
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)

## Recommended Deployment Stack

**Small Project (Free)**
- Vercel for Next.js app
- SQLite for database
- No WebSocket (or use Railway for WebSocket)

**Medium Project (Free/Low Cost)**
- Railway for everything (app + database + WebSocket)
- PostgreSQL database

**Large Project (Production)**
- Vercel for Next.js app (CDN, edge functions)
- Supabase/Neon for PostgreSQL
- Separate service for WebSocket
- Cloudflare for CDN

---

**Need Help?**
- Check platform documentation
- Review logs in deployment dashboard
- Test locally first

Happy Deploying! 🚀
