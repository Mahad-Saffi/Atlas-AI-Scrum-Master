# ⚡ Quick Start Checklist - AI Assistant

## 📋 Pre-flight Checklist

### ✅ Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**New dependencies added**:
- `selenium` - Browser automation
- `webdriver-manager` - Automatic ChromeDriver management
- `pillow` - Image processing for screenshots

### ✅ Step 2: Verify Environment
Check `backend/.env` has:
```
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET_KEY=your_jwt_secret_here
```

### ✅ Step 3: Install Chrome
Make sure Google Chrome is installed on your system.

### ✅ Step 4: Start Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Verify**: Visit http://localhost:8000/api/v1/ai-automation/health

Should see:
```json
{
  "status": "healthy",
  "service": "ai-automation",
  "selenium_available": true
}
```

### ✅ Step 5: Start Frontend
```bash
cd frontend
npm run dev
```

**Verify**: Visit http://localhost:5173

---

## 🎯 First Test

### 1. Login
- Go to http://localhost:5173/login
- Login with: `demo@atlas.ai` / `demo123`

### 2. Access AI Assistant
- Click **🤖 AI Assistant** button on dashboard
- Or go to http://localhost:5173/ai-assistant

### 3. Run First Task
Enter this task:
```
Create a new project named 'Test Project'
```

Click **▶ Start Automation**

### 4. Watch the Magic! ✨
You should see:
- ✅ Browser window opens
- ✅ AI navigates to project creation
- ✅ AI enters project description
- ✅ Project gets created
- ✅ Success message appears

---

## 🐛 Quick Troubleshooting

### Browser doesn't open?
```bash
pip install --upgrade webdriver-manager selenium
```

### WebSocket error?
- Check backend is running on port 8000
- Check JWT token is valid (try logging in again)

### AI doesn't understand task?
- Be more specific
- Use examples from the guide
- Check OpenAI API key is valid

---

## 📚 Documentation Files

1. **`AI_AUTOMATION_DESIGN.md`** - System architecture
2. **`AI_ASSISTANT_SETUP_GUIDE.md`** - Detailed setup
3. **`IMPLEMENTATION_SUMMARY.md`** - What was built
4. **`QUICK_START_CHECKLIST.md`** - This file!

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] Chrome browser installed
- [ ] OpenAI API key configured
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can login to Atlas
- [ ] Can see AI Assistant button
- [ ] Can access AI Assistant page
- [ ] Can enter and submit task
- [ ] Browser opens and automation runs
- [ ] Can see live screenshots
- [ ] Can see action logs
- [ ] Task completes successfully

---

## 🎉 You're Done!

If all checkboxes are checked, your AI Assistant is ready to use!

Try these tasks next:
- "Start the task 'Design UI mockups'"
- "Add a team member with email john@example.com"
- "Create an issue: Database connection failing"

---

**Time to Complete**: ~10 minutes  
**Difficulty**: Easy  
**Status**: Ready to Go! 🚀
