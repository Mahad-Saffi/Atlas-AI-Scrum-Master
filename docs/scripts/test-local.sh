#!/bin/bash

# Quick test script to verify local setup
# Run this with: bash test-local.sh

echo "🧪 Testing Atlas Local Setup"
echo "============================="
echo ""

# Test 1: Check Python
echo "Test 1: Python Installation"
if command -v python &> /dev/null; then
    echo "✅ Python found: $(python --version)"
else
    echo "❌ Python not found"
    exit 1
fi
echo ""

# Test 2: Check Node
echo "Test 2: Node.js Installation"
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi
echo ""

# Test 3: Check backend venv
echo "Test 3: Backend Virtual Environment"
if [ -d "backend/venv" ]; then
    echo "✅ Virtual environment exists"
else
    echo "⚠️  Virtual environment not found. Run: bash start-local.sh"
fi
echo ""

# Test 4: Check backend dependencies
echo "Test 4: Backend Dependencies"
if [ -f "backend/venv/Scripts/activate" ]; then
    cd backend
    source venv/Scripts/activate
    if python -c "import fastapi" 2>/dev/null; then
        echo "✅ Backend dependencies installed"
    else
        echo "⚠️  Backend dependencies missing. Run: pip install -r requirements.txt"
    fi
    deactivate
    cd ..
else
    echo "⚠️  Cannot check - venv not found"
fi
echo ""

# Test 5: Check frontend dependencies
echo "Test 5: Frontend Dependencies"
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies missing. Run: cd frontend && npm install"
fi
echo ""

# Test 6: Check .env file
echo "Test 6: Environment Configuration"
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
    
    # Check for required variables
    if grep -q "GITHUB_CLIENT_ID" backend/.env && \
       grep -q "GITHUB_CLIENT_SECRET" backend/.env && \
       grep -q "OPENAI_API_KEY" backend/.env; then
        echo "✅ Required environment variables found"
    else
        echo "⚠️  Some environment variables may be missing"
    fi
else
    echo "❌ Backend .env file not found"
fi
echo ""

# Test 7: Check database models
echo "Test 7: Database Models"
if [ -f "backend/test_models.py" ]; then
    cd backend
    if [ -d "venv" ]; then
        source venv/Scripts/activate
        if python test_models.py > /dev/null 2>&1; then
            echo "✅ Database models verified"
        else
            echo "⚠️  Database models test failed"
        fi
        deactivate
    fi
    cd ..
else
    echo "⚠️  test_models.py not found"
fi
echo ""

# Test 8: Check if servers are running
echo "Test 8: Server Status"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend server is running on port 8000"
else
    echo "⏸️  Backend server not running (this is OK if you haven't started it yet)"
fi

if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 5173"
else
    echo "⏸️  Frontend server not running (this is OK if you haven't started it yet)"
fi
echo ""

# Summary
echo "============================="
echo "📊 Test Summary"
echo "============================="
echo ""
echo "If all tests passed, you're ready to run:"
echo "  bash start-servers.sh"
echo ""
echo "Or manually start in 2 terminals:"
echo "  Terminal 1: cd backend && source venv/Scripts/activate && uvicorn main:app --reload --port 8000"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
