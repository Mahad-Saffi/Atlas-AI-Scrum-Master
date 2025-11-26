#!/bin/bash

echo "🔧 Fixing Backend Dependencies..."
echo ""

cd backend

# Activate virtual environment
source venv/Scripts/activate

# Install missing dependency
echo "Installing itsdangerous..."
pip install itsdangerous

echo "Installing aiosqlite for SQLite support..."
pip install aiosqlite

echo "Installing langchain-openai..."
pip install langchain-openai

echo ""
echo "✅ Dependencies fixed!"
echo ""
echo "Now run:"
echo "  uvicorn main:app --reload --port 8000"
