# Quick MCP Server Setup for Claude Desktop

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
pip install mcp httpx
```

### Step 2: Start Atlas Backend

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Step 3: Get JWT Token

In a new terminal:

```bash
curl -X POST http://localhost:8000/api/v1/auth/demo-login
```

Copy the `access_token` from the response.

### Step 4: Configure Claude Desktop

**Your config file location:**
```
C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json
```

Open this file in a text editor (create it if it doesn't exist).

Add this configuration (replace the paths and token):

```json
{
  "mcpServers": {
    "atlas": {
      "command": "python",
      "args": [
        "E:/SoftwareProjectManagement/Atlas-AI-Scrum-Master/atlas_mcp_server.py"
      ],
      "env": {
        "ATLAS_API_URL": "http://localhost:8000",
        "ATLAS_TOKEN": "paste_your_jwt_token_here"
      }
    }
  }
}
```

**Important**: 
- Use the **full absolute path** to `atlas_mcp_server.py`
- Replace `paste_your_jwt_token_here` with your actual JWT token

### Step 5: Restart Claude Desktop

Close and reopen Claude Desktop completely.

### Step 6: Test It!

In Claude Desktop, try:

```
"Show me all my Atlas projects"
"List tasks for project 1"
"What are the high-risk tasks?"
"Get my notifications"
```

Claude will now use your Atlas MCP server! 🎉

---

## 🛠️ Available Commands

Once configured, you can ask Claude:

- **"Show me all my Atlas projects"** - Lists all projects
- **"List tasks for project 1"** - Shows tasks for a project
- **"Show me high-risk tasks in project 1"** - Filters by risk
- **"Complete task 5"** - Marks task as done
- **"What are the project risks for project 1?"** - Risk summary
- **"Report a blocker: Database connection failing"** - Creates issue
- **"List all issues in project 1"** - Shows issues
- **"Get my notifications"** - Shows recent notifications
- **"Who's online?"** - Shows online team members

---

## 🐛 Troubleshooting

### "Connection refused"
- Make sure Atlas backend is running: `uvicorn main:app --reload --port 8000`

### "Not authenticated"
- Your JWT token expired (7 days)
- Get a new token: `curl -X POST http://localhost:8000/api/v1/auth/demo-login`
- Update the token in Claude config

### "Tool not found"
- Restart Claude Desktop completely
- Check the config file path is correct
- Verify JSON syntax is valid

### "Module not found: mcp"
- Install dependencies: `pip install mcp httpx`

---

## 📝 Example Claude Config (Copy-Paste Ready)

```json
{
  "mcpServers": {
    "atlas": {
      "command": "python",
      "args": [
        "E:/SoftwareProjectManagement/Atlas-AI-Scrum-Master/atlas_mcp_server.py"
      ],
      "env": {
        "ATLAS_API_URL": "http://localhost:8000",
        "ATLAS_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_token_here"
      }
    }
  }
}
```

**Remember**: Replace the path and token with your actual values!

---

## ✅ Quick Test

After setup, open Claude Desktop and type:

```
"Use the Atlas tool to list all my projects"
```

If it works, you'll see your projects listed! 🎉

---

**Status**: ✅ Ready to use  
**Time to setup**: 5 minutes  
**Cost**: Free
