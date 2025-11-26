# Local Testing Guide (Without Docker)

This guide will help you run and test the Atlas application locally without Docker.

---

## 📋 Prerequisites

### Required Software
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git Bash** (you already have this)

### Check Installations
```bash
python --version    # Should be 3.11+
node --version      # Should be 18+
npm --version       # Should be 9+
```

---

## 🐍 Backend Setup & Testing

### Step 1: Create Virtual Environment

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows Git Bash:
source venv/Scripts/activate

# You should see (venv) in your prompt
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
pip install -r requirements.txt

# If you get errors, try:
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 3: Verify .env Configuration

Your `.env` file looks good! It's using SQLite which is perfect for local testing.

**Current Configuration:**
- ✅ GitHub OAuth credentials set
- ✅ JWT secrets configured
- ✅ SQLite database (no PostgreSQL needed!)
- ✅ OpenAI API key set

### Step 4: Initialize Database

```bash
# Still in backend folder with venv activated

# Create database tables
python -c "from app.models import Base; from app.config.database import engine; import asyncio; asyncio.run(engine.begin())"

# Or run the test script to verify models
python test_models.py
```

### Step 5: Run Backend Server

```bash
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

### Step 6: Test Backend Endpoints

Open a new Git Bash terminal (keep the server running) and test:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"atlas-backend"}

# Test root endpoint
curl http://localhost:8000/

# Expected response:
# {"Hello":"World"}
```

Or open in browser:
- http://localhost:8000 - Should show {"Hello":"World"}
- http://localhost:8000/health - Should show health status
- http://localhost:8000/docs - FastAPI interactive docs

---

## ⚛️ Frontend Setup & Testing

### Step 1: Install Dependencies

Open a **new** Git Bash terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# This might take a few minutes
```

### Step 2: Configure Environment

The frontend should automatically connect to `http://localhost:8000` for the backend.

If needed, create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Step 3: Run Frontend Development Server

```bash
# Still in frontend folder
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Step 4: Test Frontend

Open your browser and go to:
- **http://localhost:5173** - Main application

You should see the beautiful login page!

---

## 🧪 Testing the Full Application

### Test 1: Authentication Flow

1. **Open Frontend**: http://localhost:5173
2. **Click**: "Continue with GitHub"
3. **Authorize**: The GitHub OAuth app
4. **Redirect**: Should come back to the app logged in

### Test 2: Model Verification

```bash
# In backend folder with venv activated
python test_models.py

# Should show:
# ✓ User model imported
# ✓ Project model imported
# ✓ Epic model imported
# ✓ Story model imported
# ✓ Task model imported
# ✅ All models are properly configured!
```

### Test 3: API Endpoints

```bash
# Test with curl or use the browser

# Health check
curl http://localhost:8000/health

# Get current user (need to be logged in first)
curl http://localhost:8000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 4: Database Check

```bash
# In backend folder
python -c "import sqlite3; conn = sqlite3.connect('test.db'); print('Tables:', [t[0] for t in conn.execute('SELECT name FROM sqlite_master WHERE type=\"table\"').fetchall()]); conn.close()"

# Should show tables: users, projects, epics, stories, tasks
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: `ModuleNotFoundError`**
```bash
# Make sure venv is activated
source venv/Scripts/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: `Database is locked`**
```bash
# Close all connections and restart
# Delete test.db and let it recreate
rm test.db
python test_models.py
```

**Problem: `Port 8000 already in use`**
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**Problem: `npm install` fails**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: `Port 5173 already in use`**
```bash
# Kill the process or use different port
npm run dev -- --port 5174
```

**Problem: `Cannot connect to backend`**
```bash
# Make sure backend is running on port 8000
# Check CORS settings in backend/main.py
# Verify VITE_API_URL in frontend/.env
```

---

## 📝 Quick Test Checklist

Run through this checklist to verify everything works:

### Backend Tests
- [ ] Virtual environment activated
- [ ] Dependencies installed
- [ ] `python test_models.py` runs successfully
- [ ] Backend server starts on port 8000
- [ ] http://localhost:8000/health returns healthy status
- [ ] http://localhost:8000/docs shows API documentation

### Frontend Tests
- [ ] Dependencies installed (`node_modules` exists)
- [ ] Frontend server starts on port 5173
- [ ] http://localhost:5173 shows login page
- [ ] Login page looks correct (no errors in console)

### Integration Tests
- [ ] Can click "Sign in with GitHub"
- [ ] OAuth redirects to GitHub
- [ ] After auth, redirects back to app
- [ ] User profile shows after login

---

## 🚀 Running Both Servers

You need **2 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 🎯 What to Test

### 1. Login Flow
- Click "Sign in with GitHub"
- Complete OAuth
- Should see user profile

### 2. Project Creation (if implemented)
- Navigate to "Create Project"
- Chat with AI
- Verify project is created

### 3. Task Board (if implemented)
- View tasks
- Complete a task
- Verify next task is assigned

---

## 📊 Monitoring

### Backend Logs
Watch the terminal where backend is running. You'll see:
- Incoming requests
- Database queries
- Any errors

### Frontend Logs
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Database
```bash
# View database contents
cd backend
sqlite3 test.db

# In SQLite prompt:
.tables                    # List all tables
SELECT * FROM users;       # View users
SELECT * FROM projects;    # View projects
.quit                      # Exit
```

---

## 🔄 Restart Everything

If things get messy:

```bash
# Stop both servers (Ctrl+C in each terminal)

# Backend cleanup
cd backend
rm test.db
deactivate
source venv/Scripts/activate
python test_models.py
uvicorn main:app --reload --port 8000

# Frontend cleanup
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 💡 Tips

1. **Keep terminals open**: Don't close the terminal windows while testing
2. **Check logs**: Always watch the terminal output for errors
3. **Browser DevTools**: Keep F12 open to see frontend errors
4. **Database**: SQLite is file-based, so `test.db` is your database
5. **Hot reload**: Both servers auto-reload on code changes

---

## 📞 Need Help?

If something doesn't work:

1. Check the terminal output for error messages
2. Check browser console (F12) for frontend errors
3. Verify .env file has all required values
4. Make sure both servers are running
5. Try restarting both servers

---

**Happy Testing! 🎉**
