# Local Development (No Docker Required!)

Quick guide to run Atlas locally without Docker.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Setup
```bash
bash start-local.sh
```

### Step 2: Start Servers

**Option A - Automatic (Both servers):**
```bash
bash start-servers.sh
```

**Option B - Manual (Recommended for development):**

Terminal 1 - Backend:
```bash
cd backend
source venv/Scripts/activate
uvicorn main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 3: Open Application
```
http://localhost:5173
```

---

## 🧪 Test Your Setup

```bash
bash test-local.sh
```

This will verify:
- ✅ Python & Node.js installed
- ✅ Dependencies installed
- ✅ Environment variables configured
- ✅ Database models working
- ✅ Servers running (if started)

---

## 📝 What You Need

### Already Have
- ✅ Python 3.11+
- ✅ Node.js 18+
- ✅ Git Bash
- ✅ Backend `.env` file configured

### Will Be Created
- `backend/venv/` - Python virtual environment
- `backend/test.db` - SQLite database
- `frontend/node_modules/` - Frontend dependencies

---

## 🔍 Verify Everything Works

### 1. Backend Health Check
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","service":"atlas-backend"}`

### 2. API Documentation
Open: http://localhost:8000/docs

### 3. Frontend
Open: http://localhost:5173

Should see the beautiful login page!

### 4. Database Models
```bash
cd backend
source venv/Scripts/activate
python test_models.py
```

Should show all models verified ✅

---

## 🐛 Common Issues

### "Python not found"
```bash
# Check Python installation
python --version

# If not found, download from python.org
```

### "Module not found"
```bash
cd backend
source venv/Scripts/activate
pip install -r requirements.txt
```

### "Port already in use"
```bash
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
uvicorn main:app --reload --port 8001
```

### "npm install fails"
```bash
cd frontend
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 📊 What's Running

When both servers are up:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API docs |
| Health Check | http://localhost:8000/health | Server status |

---

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Login page displays correctly
- [ ] Can click "Sign in with GitHub"
- [ ] OAuth flow works
- [ ] User profile shows after login

---

## 💡 Pro Tips

1. **Keep terminals open** - Don't close them while testing
2. **Watch the logs** - Errors will show in terminal
3. **Use browser DevTools** - Press F12 to see frontend errors
4. **Hot reload works** - Changes auto-refresh
5. **SQLite is simple** - Database is just a file (`test.db`)

---

## 🔄 Restart Everything

If things get weird:

```bash
# Stop servers (Ctrl+C in both terminals)

# Clean restart
cd backend
rm test.db
deactivate
source venv/Scripts/activate
uvicorn main:app --reload --port 8000

# In another terminal
cd frontend
npm run dev
```

---

## 📚 More Help

- **Full Guide**: See `LOCAL_TESTING_GUIDE.md`
- **Git Commands**: See `GIT_COMMANDS.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`

---

**You're all set! 🎉**

No Docker needed - everything runs locally with Python and Node.js!
