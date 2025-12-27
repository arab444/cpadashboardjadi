#!/bin/bash

echo "🚀 Starting CPA Network Dashboard..."

# Start WebSocket service
echo "📡 Starting WebSocket service on port 3001..."
cd mini-services/cpa-ws-service
nohup bun run dev > ws.log 2>&1 &
WS_PID=$!
echo "✅ WebSocket service started (PID: $WS_PID)"

# Wait for WebSocket to start
sleep 3

# Check if WebSocket is running
if ! pgrep -f "bun --hot index.ts" > /dev/null; then
    echo "❌ WebSocket service failed to start. Check ws.log"
    exit 1
fi

echo "✅ WebSocket service is running"

# Go back to root directory
cd ../..

# Check if database needs seeding
echo "📊 Checking database..."

# Check if there are any offers in the database
OFFER_COUNT=$(bunx prisma db execute --stdin <<EOF | grep -o '[0-9]\+' | head -1
SELECT COUNT(*) as count FROM "Offer";
EOF
)

# If prisma db execute doesn't work, try alternative
if [ -z "$OFFER_COUNT" ] || [ "$OFFER_COUNT" = "0" ]; then
    echo "📝 Database appears empty. Generating sample data..."
    bun run db:push
    curl -X POST http://localhost:3000/api/seed &
    echo "⏳ Sample data generation started in background"
fi

echo "🎯 Application ready!"
echo ""
echo "📱 Dashboard: http://localhost:3000"
echo "📡 WebSocket: http://localhost:3001"
echo ""
echo "📋 Running processes:"
echo "   - WebSocket Service (PID: $WS_PID)"
echo "   - Next.js Dev Server (will start on port 3000)"
echo ""
echo "🛑 To stop all services:"
echo "   kill $WS_PID"
echo "   Ctrl+C (to stop Next.js)"
echo ""
echo "📊 View logs:"
echo "   - WebSocket: tail -f mini-services/cpa-ws-service/ws.log"
echo "   - Next.js: tail -f dev.log"
echo ""

# Start Next.js development server
echo "🌐 Starting Next.js development server..."
bun run dev
