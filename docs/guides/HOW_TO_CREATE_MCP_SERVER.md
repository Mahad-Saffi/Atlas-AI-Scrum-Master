# How to Create an MCP Server for Atlas AI Scrum Master

## 🎯 What is an MCP Server?

**Model Context Protocol (MCP)** is a free, open standard that lets AI assistants (like Claude Desktop, ChatGPT, or any AI) interact with your applications through tools. Think of it as giving AI the ability to "use" your Atlas project management system.

## 💡 Why Create One for Atlas?

With an MCP server, you can:
- Ask AI: "Show me all high-risk tasks in my project"
- Tell AI: "Complete task 5 and assign the next one to John"
- Request: "Report a blocker issue about database connection"

The AI will directly interact with your Atlas backend to do these actions!

## 🆓 Free Options (Using Your OpenAI API Key)

You have **two free approaches**:

### Option 1: Direct API Integration (Simplest)
Use your OpenAI API key to create a custom GPT that calls Atlas APIs directly.

### Option 2: Full MCP Server (Most Powerful)
Build a proper MCP server that works with any MCP-compatible AI client.

---

## 🚀 Option 1: Custom GPT with Atlas (Easiest & Free)

### Step 1: Create Custom GPT

1. Go to https://chat.openai.com
2. Click your profile → "My GPTs" → "Create a GPT"
3. Name it: "Atlas Project Manager"

### Step 2: Configure Actions

In the GPT configuration, add these actions (OpenAPI schema):

```yaml
openapi: 3.0.0
info:
  title: Atlas AI Scrum Master API
  version: 1.0.0
servers:
  - url: http://localhost:8000
    description: Local Atlas server

paths:
  /api/v1/projects:
    get:
      summary: List all projects
      operationId: listProjects
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of projects
          
  /api/v1/projects/{project_id}/tasks:
    get:
      summary: Get project tasks
      operationId: getProjectTasks
      security:
        - bearerAuth: []
      parameters:
        - name: project_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: List of tasks
          
  /api/v1/projects/tasks/{task_id}/complete:
    post:
      summary: Complete a task
      operationId: completeTask
      security:
        - bearerAuth: []
      parameters:
        - name: task_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Task completed
          
  /api/v1/issues:
    post:
      summary: Report an issue
      operationId: reportIssue
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                project_id:
                  type: integer
                title:
                  type: string
                description:
                  type: string
                issue_type:
                  type: string
                  enum: [blocker, bug, question]
                priority:
                  type: string
                  enum: [low, medium, high, critical]
      responses:
        '200':
          description: Issue created

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Step 3: Add Authentication

1. Get your JWT token:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@atlas.ai","password":"demo123"}'
```

2. In GPT settings, add authentication:
   - Type: Bearer Token
   - Token: (paste your JWT token)

### Step 4: Use It!

Now you can chat with your Custom GPT:
- "Show me all my projects"
- "What are the high-risk tasks?"
- "Complete task 5"
- "Report a blocker about database"

**Pros**: 
- ✅ Free (uses your OpenAI API key)
- ✅ Easy to set up (15 minutes)
- ✅ Works in browser

**Cons**:
- ❌ Requires internet connection
- ❌ Token expires every 7 days (need to update)
- ❌ Only works with ChatGPT

---

## 🛠️ Option 2: Full MCP Server (Advanced)

### What You Need

1. **Python 3.10+** (free)
2. **MCP Python SDK** (free, open source)
3. **Your Atlas backend running** (free)
4. **MCP-compatible client** (Claude Desktop is free)

### Step 1: Install MCP SDK

```bash
pip install mcp httpx pydantic
```

### Step 2: Create MCP Server File

Create `atlas_mcp_server.py`:

```python
#!/usr/bin/env python3
import os
import httpx
from mcp.server import Server
from mcp.types import Tool, TextContent

# Configuration
ATLAS_API_URL = os.getenv("ATLAS_API_URL", "http://localhost:8000")
ATLAS_TOKEN = os.getenv("ATLAS_TOKEN", "")

app = Server("atlas-scrum-master")
client = httpx.AsyncClient(
    base_url=ATLAS_API_URL,
    headers={"Authorization": f"Bearer {ATLAS_TOKEN}"}
)

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="list_projects",
            description="List all Atlas projects",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="list_tasks",
            description="List tasks for a project",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "integer"}
                },
                "required": ["project_id"]
            }
        ),
        # Add more tools here...
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "list_projects":
        response = await client.get("/api/v1/projects")
        projects = response.json()
        text = "\n".join([f"• {p['name']} (ID: {p['id']})" for p in projects])
        return [TextContent(type="text", text=text)]
    
    elif name == "list_tasks":
        project_id = arguments["project_id"]
        response = await client.get(f"/api/v1/projects/{project_id}/tasks")
        tasks = response.json()
        text = "\n".join([f"• {t['title']} - {t['status']}" for t in tasks])
        return [TextContent(type="text", text=text)]
    
    # Add more tool implementations...

async def main():
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### Step 3: Configure Claude Desktop (Free)

1. Download Claude Desktop (free): https://claude.ai/download

2. Find config file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

3. Add your MCP server:
```json
{
  "mcpServers": {
    "atlas": {
      "command": "python",
      "args": ["C:/path/to/atlas_mcp_server.py"],
      "env": {
        "ATLAS_API_URL": "http://localhost:8000",
        "ATLAS_TOKEN": "your_jwt_token_here"
      }
    }
  }
}
```

4. Restart Claude Desktop

### Step 4: Use It!

Open Claude Desktop and ask:
- "Show me all my Atlas projects"
- "List tasks for project 1"
- "Complete task 5"

Claude will use your MCP server to interact with Atlas!

**Pros**:
- ✅ Works offline (local)
- ✅ More powerful and flexible
- ✅ Works with any MCP client
- ✅ Free (Claude Desktop is free)

**Cons**:
- ❌ More setup required
- ❌ Need to run locally

---

## 🎯 Which Option Should You Choose?

### Choose Option 1 (Custom GPT) if:
- ✅ You want quick setup (15 minutes)
- ✅ You're okay with browser-based
- ✅ You don't mind updating token weekly
- ✅ You only need basic features

### Choose Option 2 (Full MCP) if:
- ✅ You want offline capability
- ✅ You need advanced features
- ✅ You want to use Claude Desktop
- ✅ You're comfortable with Python

---

## 🔑 Getting Your JWT Token (For Both Options)

```bash
# Start Atlas backend
cd backend
uvicorn main:app --reload --port 8000

# In another terminal, get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@atlas.ai","password":"demo123"}'

# Copy the "access_token" value
```

**Note**: Token expires in 7 days. Just run this command again to get a new one.

---

## 📋 Available Atlas Features to Expose

You can expose these Atlas features through MCP:

### Project Management
- List all projects
- Get project details
- View project statistics
- Check risk summary

### Task Management
- List tasks (filter by status)
- Get task details
- Update task status
- Complete tasks
- Auto-assign next task

### Issue Tracking
- Report issues (blocker/bug/question)
- List issues
- Assign issues
- Resolve issues

### Notifications
- Get notifications
- Mark as read
- Get unread count

### Team Chat
- List channels
- Get messages
- See online users

### AI Assistant
- Chat with Atlas AI for project planning

---

## 💰 Cost Breakdown

### Option 1 (Custom GPT):
- **OpenAI API**: You already have this ✅
- **Atlas Backend**: Free (runs locally) ✅
- **Total**: $0/month 🎉

### Option 2 (Full MCP):
- **MCP SDK**: Free (open source) ✅
- **Claude Desktop**: Free ✅
- **Atlas Backend**: Free (runs locally) ✅
- **Total**: $0/month 🎉

Both options are **completely free**!

---

## 🚀 Quick Start (5 Minutes)

**Fastest way to try it:**

1. Start Atlas backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Get JWT token:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@atlas.ai","password":"demo123"}'
```

3. Go to ChatGPT and create a Custom GPT with the OpenAPI schema above

4. Add your JWT token to authentication

5. Start chatting: "Show me all my Atlas projects"

Done! 🎉

---

## 🐛 Troubleshooting

**"Connection refused"**
- Make sure Atlas backend is running on port 8000

**"Not authenticated"**
- Your JWT token expired (7 days)
- Get a new token using the login command

**"No projects found"**
- Create a project first in Atlas UI
- Or use the AI to create one: "Create a new project for a todo app"

---

## 📚 Learn More

- **MCP Documentation**: https://modelcontextprotocol.io
- **OpenAI Custom GPTs**: https://help.openai.com/en/articles/8554397-creating-a-gpt
- **Claude Desktop**: https://claude.ai/download
- **Atlas API Docs**: http://localhost:8000/docs (when running)

---

## 🎉 Summary

You can create an MCP server for Atlas in two ways:

1. **Custom GPT** (15 min setup) - Browser-based, uses your OpenAI key
2. **Full MCP Server** (30 min setup) - Local, works with Claude Desktop

Both are **100% free** and let you control Atlas through natural language!

**Recommended**: Start with Option 1 (Custom GPT) to try it out, then move to Option 2 if you want more power.

---

**Status**: ✅ Free & Open Source  
**Cost**: $0/month  
**Setup Time**: 15-30 minutes
