# 🔬 NexaCore Lab Analytics - Integration Plan

**Team**: NexaCore  
**Project**: Lab Historical Analysis & Insights System  
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
**Suggestion**: Build a FastAPI service similar to ours

**Required Endpoints**:
```http
# Lab Analytics
GET  /api/v1/labs/{lab_id}/analytics          # Lab performance metrics
GET  /api/v1/labs/{lab_id}/historical         # Historical records

# Researcher Analytics  
GET  /api/v1/researchers/{user_id}/workload   # Current workload
GET  /api/v1/researchers/{user_id}/productivity  # Productivity metrics

# AI Insights
POST /api/v1/insights/project-estimate        # Estimate project success
POST /api/v1/insights/resource-allocation     # Recommend task assignments
GET  /api/v1/insights/collaboration           # Find collaboration opportunities

# Reports
GET  /api/v1/reports/lab/{lab_id}/weekly      # Weekly lab report
```

**Recommendations**:
- Run on **port 8001** (to avoid conflicts)
- Use **SQLite** for simplicity (nexacore.db)
- Accept **Atlas JWT tokens** for authentication
- Return JSON responses with consistent error format

### 2. Authentication Integration
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

### 3. Data You Should Store
**Suggested Tables** (SQLite):
```sql
-- Link to Atlas users
lab_profiles (
    id, organization_id,  -- Link to Atlas organization
    lab_name, domain, success_rate
)

researcher_profiles (
    id, user_id,  -- Link to Atlas user
    expertise_domains, workload_hours, productivity_score
)

lab_historical_records (
    id, lab_profile_id, record_date,
    total_projects, completed_projects, productivity_index
)
```

### 4. MCP Tools We Need
**We will add these 6-8 tools to our MCP server**:

```python
# You provide the API, we create the tools:

1. get_lab_analytics(lab_id, time_period)
   → Calls your: GET /api/v1/labs/{lab_id}/analytics

2. get_researcher_workload(user_id)
   → Calls your: GET /api/v1/researchers/{user_id}/workload

3. predict_project_success(project_id, team_composition)
   → Calls your: POST /api/v1/insights/project-estimate

4. recommend_task_assignment(task_id)
   → Calls your: POST /api/v1/insights/resource-allocation

5. find_collaboration_opportunities(lab_id, domain)
   → Calls your: GET /api/v1/insights/collaboration

6. generate_lab_report(lab_id, report_type)
   → Calls your: GET /api/v1/reports/lab/{lab_id}/weekly
```

---

## 🔄 Integration Flow

```
1. User logs into Atlas → Gets JWT token
2. Claude Desktop uses MCP server → Includes JWT token
3. MCP server calls your API → Passes JWT token
4. Your API validates token → Returns lab analytics
5. MCP formats response → Shows to user in Claude
```

---

## 📝 Implementation Checklist

### Your Team's Tasks:
- [ ] Create FastAPI project (port 8001)
- [ ] Set up SQLite database (nexacore.db)
- [ ] Implement 6-8 API endpoints listed above
- [ ] Add JWT token validation middleware
- [ ] Test endpoints with Postman/curl
- [ ] Document API with example requests/responses
- [ ] Share API documentation with us

### Our Team's Tasks:
- [ ] Review your API documentation
- [ ] Add 6-8 new tools to MCP server
- [ ] Test integration end-to-end
- [ ] Update MCP documentation

---

## 🚀 Getting Started

### Step 1: Set Up Your Project
```bash
mkdir nexacore-api
cd nexacore-api
pip install fastapi uvicorn sqlalchemy pyjwt
```

### Step 2: Create Basic Structure
```
nexacore-api/
├── main.py              # FastAPI app
├── database.py          # SQLite connection
├── models.py            # Data models
├── api/
│   ├── labs.py          # Lab endpoints
│   ├── researchers.py   # Researcher endpoints
│   └── insights.py      # AI insights endpoints
└── requirements.txt
```

### Step 3: Test Authentication
```bash
# Get token from Atlas
curl -X POST http://localhost:8000/api/v1/auth/demo-login

# Test your endpoint with token
curl -X GET http://localhost:8001/api/v1/labs/123/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Share API Docs
- Document each endpoint (input/output)
- Provide example requests
- Share with Atlas team for MCP integration

---

## 💡 Key Points

### Keep It Simple
- ✅ Use FastAPI (same as us)
- ✅ Use SQLite (easy to set up)
- ✅ Use JWT tokens (no separate auth)
- ✅ Run on port 8001 (no conflicts)

### Focus On
- ✅ API endpoints that return JSON
- ✅ Clear error messages
- ✅ Fast response times (< 500ms)
- ✅ Good documentation

### Don't Worry About
- ❌ Frontend (we'll handle it)
- ❌ MCP server (we'll create tools)
- ❌ Complex deployment (local dev first)
- ❌ User management (we handle it)

---

**Next Step**: Set up your FastAPI project and implement the 6-8 endpoints. Share API documentation when ready.
