# 🚀 Quick Start Guide - Atlas AI Scrum Master

## Prerequisites

- Python 3.12+
- Node.js 18+
- Git

## Installation

### 1. Clone & Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Configure Environment

Create `backend/.env`:
```env
JWT_SECRET_KEY=your-secret-key-here-change-this
OPENAI_API_KEY=sk-your-openai-key-here  # Optional
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

You should see:
```
✅ Database connection verified
✅ Database check passed
✅ All startup checks passed!
Application startup complete
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Open Browser
```
http://localhost:5173
```

## First Login

### Option 1: Demo Account (Fastest)
1. Click "🎮 Try Demo Account"
2. Start using immediately!

**Credentials**: demo@atlas.ai / demo123

### Option 2: Create Account
1. Click "Don't have an account? Register"
2. Enter:
   - Username: your_name
   - Email: your@email.com
   - Password: (min 6 characters)
3. Click "Create Account"

## Features to Try

### 1. Create a Project with AI
1. Click "✨ Create New Project"
2. Chat with AI: "I want to build a todo app"
3. Answer AI's questions
4. Say "yes" to create the project

### 2. View Task Board
1. Click "📋 View Task Board"
2. See tasks in 3 columns
3. Click "Mark as Complete" on a task
4. Watch it move to "Done"

### 3. Check Notifications
1. Look for 🔔 bell icon (top right)
2. See unread count badge
3. Click to view notifications
4. Get notified when tasks are assigned

### 4. Team Chat
1. Click "💬 Team Chat"
2. See who's online
3. Send messages in real-time
4. Open in multiple browsers to test

### 5. Project Dashboard
1. From task board, note the project ID in URL
2. Go to `/project/{id}`
3. See statistics and progress

## Troubleshooting

### Backend won't start
```bash
# Delete database and restart
rm backend/test.db
cd backend
uvicorn main:app --reload --port 8000
```

### "Module not found" errors
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Can't login
- Try demo account first
- Check backend is running on port 8000
- Check browser console for errors

### Database errors
```bash
# Reset database
rm backend/test.db
# Restart backend - it will recreate tables
```

## API Documentation

Once backend is running, visit:
```
http://localhost:8000/docs
```

Interactive API documentation with all endpoints!

## Health Check

```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "tables_count": 10
}
```

## Project Structure

```
Atlas-AI-Scrum-Master/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/v1/  # API endpoints
│   │   ├── models/  # Database models
│   │   ├── services/# Business logic
│   │   └── core/    # Security, startup
│   └── main.py      # FastAPI app
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/
│   │   └── services/# API clients
│   └── package.json
└── docs/            # Documentation
```

## Common Commands

### Backend
```bash
# Start server
uvicorn main:app --reload --port 8000

# Run tests
./test-backend-complete.sh

# Check health
curl http://localhost:8000/health
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Implemented

✅ Email/password authentication
✅ AI-powered project creation
✅ Task board (Kanban)
✅ Real-time notifications
✅ Team chat (WebSocket)
✅ Risk management
✅ Progress tracking
✅ Project dashboard

## Next Steps

1. Create your first project with AI
2. Explore the task board
3. Try the team chat
4. Check out the project dashboard
5. Review the API docs at /docs

## Need Help?

- Check `AUTH_UPDATE.md` for auth details
- Check `FINAL_SUMMARY.md` for complete feature list
- Check `SPRINT_6_7_COMPLETE.md` for recent updates
- Visit http://localhost:8000/docs for API reference

## Demo Credentials

**Email**: demo@atlas.ai
**Password**: demo123

---

**Enjoy building with Atlas AI! 🚀**
