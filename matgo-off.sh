#!/bin/bash

notify-send "🛑 Stopping Matgo system..."

# Kill Node.js backend
pkill -f "node index.js"

# Kill Next.js frontend
pkill -f "next dev"

notify-send "✅ Matgo is Off" "Services shut down."
