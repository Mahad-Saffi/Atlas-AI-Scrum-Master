#!/bin/bash

# Start both backend and frontend servers
# Run this with: bash start-servers.sh

echo "🚀 Starting Atlas Servers..."
echo ""

# Start backend in background
echo "Starting Backend on http://localhost:8000..."
cd backend
source venv/Scripts/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "Starting Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=============================================="
echo "✅ Both servers are running!"
echo "=============================================="
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
