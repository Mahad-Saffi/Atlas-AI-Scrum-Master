#!/bin/bash

# Atlas Local Development Startup Script
# Run this with: bash start-local.sh

echo "🚀 Starting Atlas AI Scrum Master (Local Mode)"
echo "=============================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.11+"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python version: $(python --version)"
echo "✅ Node version: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate venv
echo "Activating virtual environment..."
source venv/Scripts/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Test models
echo "Verifying database models..."
python test_models.py

if [ $? -eq 0 ]; then
    echo "✅ Backend setup complete!"
else
    echo "❌ Backend setup failed. Check errors above."
    exit 1
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (this may take a while)..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "=============================================="
echo "✅ Setup Complete!"
echo "=============================================="
echo ""
echo "To start the application, open 2 terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/Scripts/activate"
echo "  uvicorn main:app --reload --port 8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Or run: bash start-servers.sh (to start both automatically)"
