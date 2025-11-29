# ⌨️ Code Crafters Productivity Tracker - Integration Plan

**Team**: Code Crafters  
**Project**: Employee Productivity Tracking System  
**Target**: Integration with Atlas AI Scrum Master MCP Server

---

## 📋 What We Have (Atlas)

### Current Architecture
- **Backend**: Python FastAPI + SQLite (async)
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: SQLite (atlas.db) with 13 tables
- **Authentication**: JWT tokens (7-day expiry)
- **AI**: OpenAI GPT-4o-mini integration
- **MCP Server**: 18 tools for project management
- **Port**: Backend runs on 8000

### Our MCP Server Structure
```python
# atlas_mcp_server_v2.py
- Uses MCP protocol (pip install mcp httpx)
- Connects to Atlas API with JWT token
- 18 tools organized by category:
  • Organization Management (3 tools)
  • Project Management (3 tools)
  • Task Management (4 tools)
  • Issue Tracking (4 tools)
  • Notifications (2 tools)
  • Team Collaboration (2 tools)
```

### Our Data Model
- **Users**: id, username, email, role, organization
- **Organizations**: Multi-tenant with owner and members
- **Projects**: Belong to organizations
- **Tasks**: Linked to projects with assignees
- **Issues**: Bug/blocker tracking

---

## 🎯 What We Need From You

### 1. Your Backend API
**Suggestion**: Adapt your Flask app or create FastAPI service

**Required Endpoints**:
```http
# Activity Tracking
GET  /api/v1/productivity/user/{user_id}/today      # Today's productivity
GET  /api/v1/productivity/user/{user_id}/week       # Weekly metrics
GET  /api/v1/productivity/user/{user_id}/trends     # Productivity trends

# Real-Time Monitoring
GET  /api/v1/monitoring/active-users                # Currently active users
GET  /api/v1/monitoring/user/{user_id}/live         # Live user activity

# Task Time Tracking
GET  /api/v1/tasks/{task_id}/time-logs              # Time spent on task
GET  /api/v1/tasks/{task_id}/productivity           # Task productivity metrics

# Reports
GET  /api/v1/reports/user/{user_id}/weekly          # Weekly productivity report
GET  /api/v1/reports/team/{org_id}/weekly           # Team weekly report
```

**Recommendations**:
- Run on **port 8002** (to avoid conflicts)
- Keep **Supabase** if you prefer, or use **SQLite** for simplicity
- Accept **Atlas JWT tokens** for authentication
- Return JSON responses with consistent error format

### 2. Desktop Agent Adaptation
**What you need to do**:
- Keep your existing tracking logic (mouse/keyboard/screenshots)
- Add Atlas authentication (use JWT tokens)
- Send activity data to your API (port 8002)
- Link activity to Atlas task IDs when user is working on a task

**Suggested Changes**:
```python
# In your desktop agent:
class ActivityTracker:
    def __init__(self, atlas_token):
        self.token = atlas_token  # From Atlas login
        self.api_url = "http://localhost:8002"
        self.current_task_id = None  # Set when user starts task
    
    def log_activity(self, activity_data):
        # Add task context if available
        if self.current_task_id:
            activity_data['task_id'] = self.current_task_id
        
        # Send to your API
        requests.post(
            f"{self.api_url}/api/v1/activity/log",
            headers={"Authorization": f"Bearer {self.token}"},
            json=activity_data
        )
```

### 3. Authentication Integration
**What you need to do**:
- Validate JWT tokens from Atlas
- Extract user_id from token
- No separate login system needed

**Example**:
```python
from fastapi import Header, HTTPException
import jwt

def verify_atlas_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # Contains user_id, email, role
    except:
        raise HTTPException(401, "Invalid token")
```

### 4. Data You Should Store
**Suggested Tables** (Supabase or SQLite):
```sql
-- Link to Atlas users
activity_sessions (
    id, user_id,  -- Link to Atlas user
    session_start, session_end,
    productive_minutes, idle_minutes,
    productivity_score
)

daily_productivity_summary (
    id, user_id, date,
    total_work_minutes, productive_minutes,
    productivity_percentage, tasks_completed
)

task_time_tracking (
    id, task_id,  -- Link to Atlas task
    user_id, start_time, end_time,
    duration_minutes, productive_minutes
)
```

### 5. MCP Tools We Need
**We will add these 8-10 tools to our MCP server**:

```python
# You provide the API, we create the tools:

1. get_user_productivity(user_id, time_period)
   → Calls your: GET /api/v1/productivity/user/{user_id}/today

2. get_team_productivity(organization_id)
   → Calls your: GET /api/v1/reports/team/{org_id}/weekly

3. get_active_users(organization_id)
   → Calls your: GET /api/v1/monitoring/active-users

4. track_task_time(task_id)
   → Calls your: GET /api/v1/tasks/{task_id}/time-logs

5. recommend_task_based_on_productivity(user_id, available_tasks)
   → Calls your: POST /api/v1/insights/recommend-task

6. get_productivity_alerts(user_id)
   → Calls your: GET /api/v1/alerts/user/{user_id}

7. generate_productivity_report(user_id, report_type)
   → Calls your: GET /api/v1/reports/user/{user_id}/weekly

8. analyze_productivity_patterns(user_id, days)
   → Calls your: GET /api/v1/productivity/user/{user_id}/trends
```

---

## 🔄 Integration Flow

```
1. User logs into Atlas → Gets JWT token
2. Desktop agent uses token → Tracks activity
3. Agent sends data to your API (port 8002)
4. Your API stores activity data
5. Claude Desktop uses MCP → Calls your API
6. MCP shows productivity insights in Claude
```

---

## 📝 Implementation Checklist

### Your Team's Tasks:
- [ ] Adapt desktop agent to use Atlas JWT tokens
- [ ] Create/adapt API service (port 8002)
- [ ] Implement 8-10 API endpoints listed above
- [ ] Add JWT token validation
- [ ] Link activity tracking to Atlas task IDs
- [ ] Test desktop agent with Atlas authentication
- [ ] Document API with example requests/responses
- [ ] Share API documentation with us

### Our Team's Tasks:
- [ ] Provide JWT token to your desktop agent
- [ ] Review your API documentation
- [ ] Add 8-10 new tools to MCP server
- [ ] Test integration end-to-end
- [ ] Update MCP documentation

---

## 🚀 Getting Started

### Step 1: Adapt Desktop Agent
```python
# Add Atlas authentication
class AtlasAuthenticator:
    def login(self, username, password):
        response = requests.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": username, "password": password}
        )
        return response.json()["access_token"]

# Use token in activity tracker
token = authenticator.login("user@example.com", "password")
tracker = ActivityTracker(atlas_token=token)
```

### Step 2: Set Up Your API
```bash
mkdir productivity-api
cd productivity-api
pip install fastapi uvicorn sqlalchemy pyjwt
# or keep your Flask setup
```

### Step 3: Create Basic Structure
```
productivity-api/
├── main.py              # FastAPI/Flask app
├── database.py          # Database connection
├── models.py            # Data models
├── api/
│   ├── productivity.py  # Productivity endpoints
│   ├── monitoring.py    # Real-time monitoring
│   └── reports.py       # Report endpoints
└── requirements.txt
```

### Step 4: Test Integration
```bash
# Get token from Atlas
curl -X POST http://localhost:8000/api/v1/auth/demo-login

# Test your endpoint with token
curl -X GET http://localhost:8002/api/v1/productivity/user/1/today \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Share API Docs
- Document each endpoint (input/output)
- Provide example requests
- Share with Atlas team for MCP integration

---

## 💡 Key Points

### Keep It Simple
- ✅ Use FastAPI or keep Flask (your choice)
- ✅ Use Supabase or SQLite (your choice)
- ✅ Use JWT tokens (no separate auth)
- ✅ Run on port 8002 (no conflicts)

### Focus On
- ✅ Desktop agent authentication with Atlas
- ✅ API endpoints that return JSON
- ✅ Linking activity to Atlas task IDs
- ✅ Fast response times (< 300ms)
- ✅ Good documentation

### Don't Worry About
- ❌ Frontend dashboard (we'll handle it)
- ❌ MCP server (we'll create tools)
- ❌ Complex deployment (local dev first)
- ❌ User management (we handle it)

### Privacy Considerations
- ✅ Make tracking opt-in
- ✅ Allow users to pause tracking
- ✅ Don't track personal applications
- ✅ Encrypt sensitive data
- ✅ Clear privacy policy

---

**Next Step**: Adapt your desktop agent to use Atlas authentication and implement the 8-10 API endpoints. Share API documentation when ready.
