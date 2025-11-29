# ✅ Atlas MCP Server - Ready to Use!

## 🎉 Setup Complete!

I've created the Claude Desktop configuration file for you at:
```
C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json
```

## 🚀 Next Steps

### 1. Install Python Dependencies (if not already installed)

```bash
pip install mcp httpx
```

### 2. Make Sure Atlas Backend is Running

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 3. Restart Claude Desktop

**Important**: You must completely close and restart Claude Desktop for the changes to take effect.

- Close Claude Desktop completely (check system tray)
- Open Claude Desktop again

### 4. Test It!

Once Claude Desktop restarts, try these commands:

```
"Show me all my Atlas projects"
"List tasks for project 1"
"What are the high-risk tasks?"
"Get my notifications"
"Who's online in the team?"
```

Claude will now use your Atlas MCP server! 🎉

---

## 🔧 Your Configuration

**Config File Location:**
```
C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json
```

**MCP Server Script:**
```
E:/SoftwareProjectManagement/Atlas-AI-Scrum-Master/atlas_mcp_server.py
```

**Atlas API:**
```
http://localhost:8000
```

**JWT Token:** ✅ Already configured (expires in 7 days)

---

## 🛠️ Available Commands

Once configured, you can ask Claude:

### Project Management
- "Show me all my Atlas projects"
- "List tasks for project 1"
- "Show me tasks that are in progress"
- "Complete task 5"

### Risk Management
- "What are the project risks for project 1?"
- "Show me high-risk tasks"

### Issue Tracking
- "Report a blocker: Database connection failing in production"
- "List all issues in project 1"

### Notifications & Team
- "Get my notifications"
- "Who's online in the team?"

---

## 🐛 Troubleshooting

### Claude doesn't see the tools

1. Make sure you **completely closed** Claude Desktop (check system tray)
2. Restart Claude Desktop
3. Try asking: "What tools do you have access to?"

### "Connection refused" error

- Make sure Atlas backend is running:
  ```bash
  cd backend
  python -m uvicorn main:app --reload --port 8000
  ```

### "Not authenticated" error

Your JWT token expired (7 days). Get a new one:

```bash
# Get new token
curl -X POST http://localhost:8000/api/v1/auth/demo-login

# Copy the access_token and update it in:
# C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json
```

Or run the setup script again:
```bash
setup_claude.bat
```

### "Module not found: mcp"

Install dependencies:
```bash
pip install mcp httpx
```

---

## 📝 Quick Test

After restarting Claude Desktop, open a new conversation and type:

```
"Use the Atlas tool to list all my projects"
```

If it works, you'll see your projects! 🎉

---

## 🔄 Token Refresh (Every 7 Days)

Your JWT token expires after 7 days. When it does:

**Option 1: Run the setup script**
```bash
setup_claude.bat
```

**Option 2: Manual update**
1. Get new token: `curl -X POST http://localhost:8000/api/v1/auth/demo-login`
2. Copy the `access_token`
3. Edit `C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json`
4. Replace the `ATLAS_TOKEN` value
5. Restart Claude Desktop

---

## ✅ Checklist

- [x] Config file created
- [x] JWT token configured
- [x] MCP server script ready
- [ ] Install dependencies: `pip install mcp httpx`
- [ ] Start Atlas backend
- [ ] Restart Claude Desktop
- [ ] Test with: "Show me all my Atlas projects"

---

**Status**: ✅ Ready to use!  
**Token Expires**: December 3, 2025 (7 days from now)  
**Cost**: Free
