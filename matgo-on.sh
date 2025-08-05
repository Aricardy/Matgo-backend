#!/bin/bash

PROJECT_DIR="$HOME/Documents/IS PROJECT/Matgo"
FRONTEND_DIR="$PROJECT_DIR/matgo-frontend"
BACKEND_DIR="$PROJECT_DIR/matgo-backend"

notify-send "🚀 Starting Matgo System..." "Launching backend and frontend..."

# Launch backend in new terminal
gnome-terminal -- bash -c "cd '$BACKEND_DIR'; node index.js; exec bash"

# Launch frontend in new terminal
gnome-terminal -- bash -c "cd '$FRONTEND_DIR'; npm run dev; exec bash"

# Wait for frontend to boot
sleep 8

# Open browser
xdg-open http://localhost:3000

notify-send "✅ Matgo is Ready!" "You can now use the system."
