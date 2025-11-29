# 🔄 How Atlas AI Scrum Master Works - Complete Flow

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Component Flow](#component-flow)
3. [User Journey](#user-journey)
4. [MCP Integration Flow](#mcp-integration-flow)
5. [Data Flow](#data-flow)
6. [API Flow](#api-flow)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACES                          │
├─────────────────────┬───────────────────────────────────────┤
│  Web Frontend       │  Claude Desktop (MCP Client)          │
│  (React + Vite)     │  (AI Assistant)                       │
│  localhost:5173     │                                       │
└──────────┬──────────┴──────────────┬────────────────────────┘
           │                         │
           │                         │
           ▼                         ▼
    ┌──────────────────────────────────────────┐
    │         Atlas MCP Server                  │
    │         (atlas_mcp_server.py)            │
    │         - Translates AI requests         │
    │         - Calls Atlas API                │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │         Atlas Backend API                 │
    │         (FastAPI - Python)                │
    │         localhost:8000                    │
    ├──────────────────────────────────────────┤
    │  Endpoints:                               │
    │  - /api/v1/auth      (Authentication)    │
    │  - /api/v1/ai        (AI Project Gen)    │
    │  - /api/v1/projects  (Project Mgmt)      │
    │  - /api/v1/tasks     (Task Mgmt)         │
    │  - /api/v1/issues    (Issue Tracking)    │
    │  - /api/v1/chat      (Team Chat)         │
    │  - /api/v1/notifications (Alerts)        │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │         OpenAI GPT-4o-mini               │
    │         (AI Project Planning)             │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │         SQLite Database                   │
    │         (test.db)                         │
    │  Tables: users, projects, epics,         │
    │          stories, tasks, issues,         │
    │          notifications, messages, etc.   │
    └──────────────────────────────────────────┘
```

---

## 🔄 Component Flow

### 1. Authentication Flow

```
User → Login Request → Backend API
                         ↓
                    Check Credentials
                    (bcrypt password hash)
                         ↓
                    Generate JWT Token
                    (7-day expiry)
                         ↓
                    Return Token + User Info
                         ↓
User ← Token Stored ← Response
```

**Example:**
```bash
# User logs in
POST /api/v1/auth/login
Body: {"email": "demo@atlas.ai", "password": "demo123"}

# Backend returns
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {"id": 2, "username": "demo_user", ...}
}

# Token used in all subsequent requests
Authorization: Bearer eyJhbGc...
```

---

### 2. Project Creation Flow (One-Shot)

```
User: "Create a blog platform"
    ↓
Claude Desktop (MCP Client)
    ↓
MCP Server (atlas_mcp_server.py)
    ↓ Calls: create_project tool
    ↓
Backend API: POST /api/v1/ai/discover
    ↓
AI Service (ai_service.py)
    ↓ Calls OpenAI API
    ↓
OpenAI GPT-4o-mini
    ↓ Generates JSON plan
    ↓
{
  "project_name": "Blog Platform",
  "description": "...",
  "epics": [
    {
      "name": "User Management",
      "stories": [
        {
          "name": "User Registration",
          "tasks": ["Design form", "API endpoint", ...]
        }
      ]
    }
  ]
}
    ↓
Project Service (project_service.py)
    ↓ Creates database records
    ↓
Database: INSERT INTO projects, epics, stories, tasks
    ↓
Response: "✅ Project Created!"
    ↓
Claude Desktop shows result to user
```

**Key Points:**
- **No follow-up questions** - AI generates complete plan immediately
- **Automatic structure** - Creates epics → stories → tasks hierarchy
- **Team assignment** - Suggests team members automatically

---

### 3. Task Management Flow

```
User: "List tasks for project abc-123"
    ↓
Claude Desktop
    ↓
MCP Server: list_tasks tool
    ↓
Backend API: GET /api/v1/projects/{id}/tasks
    ↓
Database: SELECT * FROM tasks WHERE project_id = 'abc-123'
    ↓
Response: [
  {
    "id": "task-1",
    "title": "Design UI",
    "status": "To Do",
    "risk_level": "low"
  },
  ...
]
    ↓
MCP Server formats response
    ↓
Claude Desktop displays:
📝 Tasks (15):
🟢 Design UI
   ID: `task-1`
   Status: To Do
   Risk: low
```

---

### 4. Task Completion Flow

```
User: "Complete task task-1"
    ↓
Claude Desktop
    ↓
MCP Server: complete_task tool
    ↓
Backend API: POST /api/v1/projects/tasks/{id}/complete
    ↓
Task Service:
  1. Update task status to "Done"
  2. Calculate next task to assign
  3. Create notification
    ↓
Database:
  - UPDATE tasks SET status='Done' WHERE id='task-1'
  - INSERT INTO notifications (...)
    ↓
Response: {
  "message": "Task completed",
  "next_task": {"id": "task-2", "title": "..."}
}
    ↓
Claude: "✅ Task completed! Next task: Implement API"
```

---

## 👤 User Journey

### Journey 1: Web Frontend User

```
1. Open http://localhost:5173
   ↓
2. Login with demo@atlas.ai / demo123
   ↓
3. See Dashboard with action cards
   ↓
4. Click "Create New Project"
   ↓
5. Chat with AI: "I want to build a todo app"
   ↓
6. AI creates project instantly
   ↓
7. Navigate to Task Board
   ↓
8. See Kanban board (To Do | In Progress | Done)
   ↓
9. Click "Complete" on a task
   ↓
10. Next task auto-assigned
    ↓
11. Check notifications bell for updates
```

### Journey 2: Claude Desktop User (MCP)

```
1. Open Claude Desktop
   ↓
2. Say: "Create a fitness tracking app"
   ↓
3. Claude uses MCP server to create project
   ↓
4. Project created instantly with full plan
   ↓
5. Say: "Show me all my projects"
   ↓
6. Claude lists projects with IDs
   ↓
7. Copy project ID
   ↓
8. Say: "List tasks for project [id]"
   ↓
9. Claude shows all tasks with details
   ↓
10. Say: "Complete task [task-id]"
    ↓
11. Task marked done, next task assigned
    ↓
12. Say: "What are the high-risk tasks?"
    ↓
13. Claude shows risk analysis
```

---

## 🔌 MCP Integration Flow

### How MCP Works

```
┌─────────────────────────────────────────────────────┐
│  Claude Desktop (MCP Client)                        │
│  - Reads: claude_desktop_config.json                │
│  - Starts: python atlas_mcp_server.py               │
│  - Communicates via: stdio (stdin/stdout)           │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ MCP Protocol (JSON-RPC)
                   │
┌──────────────────▼──────────────────────────────────┐
│  Atlas MCP Server (atlas_mcp_server.py)             │
│                                                      │
│  1. Receives tool call from Claude                  │
│     Example: {"tool": "list_projects", "args": {}}  │
│                                                      │
│  2. Translates to HTTP request                      │
│     GET http://localhost:8000/api/v1/projects       │
│     Headers: Authorization: Bearer [token]          │
│                                                      │
│  3. Calls Atlas Backend API                         │
│                                                      │
│  4. Receives JSON response                          │
│     [{"id": "...", "name": "Blog", ...}]           │
│                                                      │
│  5. Formats for Claude                              │
│     "📋 Projects:\n• Blog (ID: abc-123)"           │
│                                                      │
│  6. Returns to Claude via stdio                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Formatted Response
                   │
┌──────────────────▼──────────────────────────────────┐
│  Claude Desktop                                      │
│  - Displays formatted response to user              │
│  - Can make follow-up tool calls                    │
└─────────────────────────────────────────────────────┘
```

### MCP Configuration

**File:** `C:\Users\HP\AppData\Roaming\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "atlas": {
      "command": "python",
      "args": ["E:/path/to/atlas_mcp_server.py"],
      "env": {
        "ATLAS_API_URL": "http://localhost:8000",
        "ATLAS_TOKEN": "eyJhbGc..."
      }
    }
  }
}
```

**What happens:**
1. Claude Desktop reads this config on startup
2. Starts the Python MCP server as a subprocess
3. Keeps it running in the background
4. Sends tool calls via stdin
5. Receives responses via stdout

---

## 📊 Data Flow

### Database Schema Flow

```
User
  ↓ creates
Project
  ↓ contains
Epic (2-3 per project)
  ↓ contains
Story (2-3 per epic)
  ↓ contains
Task (3-5 per story)
  ↓ assigned to
User (team member)
  ↓ receives
Notification (when task assigned)
```

### Example Data Structure

```
Project: "Blog Platform"
├── Epic: "User Management"
│   ├── Story: "User Registration"
│   │   ├── Task: "Design registration form"
│   │   ├── Task: "Implement backend API"
│   │   └── Task: "Add email verification"
│   └── Story: "User Login"
│       ├── Task: "Create login UI"
│       └── Task: "Implement JWT auth"
├── Epic: "Content Management"
│   └── Story: "Create Posts"
│       ├── Task: "Design post editor"
│       └── Task: "Implement post API"
└── Epic: "Deployment"
    └── Story: "Production Setup"
        └── Task: "Configure hosting"
```

---

## 🔗 API Flow

### Complete API Request Flow

```
1. User Action
   ↓
2. Frontend/MCP Client
   ↓ HTTP Request
3. FastAPI Router
   ↓ Route to endpoint
4. API Endpoint Handler
   ↓ Validate JWT token
5. Security Middleware
   ↓ Extract user info
6. Service Layer
   ↓ Business logic
7. Database Layer (SQLAlchemy)
   ↓ SQL Query
8. SQLite Database
   ↓ Return data
9. Service Layer
   ↓ Format response
10. API Endpoint
    ↓ JSON Response
11. Frontend/MCP Client
    ↓ Display to user
12. User sees result
```

### Example: Complete Task API Flow

```python
# 1. User clicks "Complete" button
# Frontend sends:
POST /api/v1/projects/tasks/abc-123/complete
Headers: {
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}

# 2. FastAPI receives request
@router.post("/tasks/{task_id}/complete")
async def complete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)  # JWT validation
):
    # 3. Call service layer
    result = await task_service.complete_task(task_id, current_user['id'])
    return result

# 4. Service layer (task_service.py)
async def complete_task(task_id: str, user_id: int):
    # Update task status
    task.status = "Done"
    task.progress_percentage = 100
    
    # Find next task
    next_task = await get_next_task(task.project_id)
    
    # Assign next task
    if next_task:
        next_task.assignee_id = user_id
        
        # Create notification
        await notification_service.create_notification(
            user_id=user_id,
            message=f"New task assigned: {next_task.title}",
            type="task_assigned"
        )
    
    # Save to database
    await session.commit()
    
    return {
        "message": "Task completed",
        "next_task": next_task
    }

# 5. Response sent back
{
  "message": "Task completed",
  "next_task": {
    "id": "def-456",
    "title": "Implement API endpoint",
    "status": "In Progress"
  }
}

# 6. Frontend updates UI
# - Task moves to "Done" column
# - Next task appears in "In Progress"
# - Notification bell shows new alert
```

---

## 🎯 Key Features Flow

### 1. Risk Detection

```
Task Created
    ↓
Risk Service calculates risk level:
    - No progress + overdue = HIGH
    - Some progress + near deadline = MEDIUM
    - On track = LOW
    ↓
Task displayed with color:
    🔴 High Risk
    🟡 Medium Risk
    🟢 Low Risk
    ↓
If HIGH risk:
    → Create notification
    → Alert project manager
```

### 2. Auto-Assignment

```
Task Completed
    ↓
Find next unassigned task in project
    ↓
Assign to same user
    ↓
Create notification
    ↓
Update task status to "In Progress"
```

### 3. Real-time Notifications

```
Event occurs (task assigned, issue created, etc.)
    ↓
Notification Service creates record
    ↓
Database: INSERT INTO notifications
    ↓
Frontend polls every 30 seconds
    ↓
GET /api/v1/notifications/unread-count
    ↓
Update notification bell badge
    ↓
User clicks bell
    ↓
Show notification list
```

### 4. Issue Tracking

```
User reports issue
    ↓
POST /api/v1/issues
Body: {
  "project_id": "abc-123",
  "title": "Database connection failing",
  "issue_type": "blocker",
  "priority": "critical"
}
    ↓
Issue Service:
    1. Create issue record
    2. Notify project lead
    3. Notify assigned user (if any)
    ↓
Issue appears in project dashboard
    ↓
Manager assigns to developer
    ↓
Developer resolves issue
    ↓
Issue marked as resolved
```

---

## 🔄 Complete User Workflow Example

### Scenario: Building a Todo App

```
Step 1: Create Project
User: "Create a simple todo app with user authentication"
    ↓
AI generates:
    - Project: "Todo App"
    - Epic 1: User Authentication
        - Story: User Registration (5 tasks)
        - Story: User Login (4 tasks)
    - Epic 2: Task Management
        - Story: Create Tasks (6 tasks)
        - Story: Edit Tasks (4 tasks)
    - Epic 3: UI/UX
        - Story: Responsive Design (5 tasks)
    ↓
Total: 24 tasks created

Step 2: View Project
User: "Show me all my projects"
    ↓
Claude: "📋 Projects:
• Todo App
  ID: `abc-123`
  Description: Simple todo app with authentication"

Step 3: Check Tasks
User: "List tasks for project abc-123"
    ↓
Claude shows 24 tasks grouped by status

Step 4: Start Working
User: "Complete task task-1"
    ↓
Task 1 marked done
Task 2 auto-assigned
Notification created

Step 5: Monitor Progress
User: "What are the risks for project abc-123?"
    ↓
Claude: "⚠️ Risk Summary:
🔴 High Risk: 2 tasks
🟡 Medium Risk: 5 tasks
🟢 Low Risk: 17 tasks"

Step 6: Report Issue
User: "Report a blocker: Database connection failing"
    ↓
Issue created
Project lead notified

Step 7: Continue Working
User completes tasks one by one
Each completion auto-assigns next task
Progress tracked automatically
Risks updated in real-time
```

---

## 📈 Performance Flow

### Request Timing

```
User Request
    ↓ ~10ms
MCP Server (if using Claude)
    ↓ ~50ms
Backend API
    ↓ ~100ms
Database Query
    ↓ ~50ms
Response Processing
    ↓ ~10ms
Total: ~220ms average response time
```

### Optimization Points

1. **Database Queries** - Indexed on project_id, user_id
2. **JWT Validation** - Cached for 5 minutes
3. **AI Responses** - Streamed for faster perceived performance
4. **Frontend** - React components memoized
5. **API** - Async/await for concurrent operations

---

## 🎉 Summary

**Atlas AI Scrum Master** is a complete project management system that:

1. **Creates projects instantly** using AI (no manual planning)
2. **Manages tasks automatically** (auto-assignment, risk detection)
3. **Tracks progress in real-time** (notifications, updates)
4. **Integrates with AI assistants** (Claude Desktop via MCP)
5. **Provides multiple interfaces** (Web UI + AI chat)

**Key Innovation:** One-shot project creation - just describe what you want, and AI generates a complete project plan with epics, stories, and tasks instantly!

---

**Flow Diagram Legend:**
- `→` Direct flow
- `↓` Sequential step
- `├──` Hierarchy/contains
- `🔴🟡🟢` Risk levels
- `✅` Success state
- `📋📝🎯` Visual indicators

**Last Updated:** November 26, 2025  
**Status:** ✅ Production Ready
