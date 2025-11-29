# 📊 ScoreSquad Performance Assessment - Integration Plan

**Team**: ScoreSquad  
**Project**: Employee Performance Tracking & Manager Assessment Tool  
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
# Performance Reviews
GET  /api/v1/reviews/user/{user_id}                # Get user's reviews
POST /api/v1/reviews                                # Create review
GET  /api/v1/reviews/pending                        # Pending reviews for manager

# Goal Management
GET  /api/v1/goals/user/{user_id}                   # Get user's goals
POST /api/v1/goals                                   # Create goal
PUT  /api/v1/goals/{goal_id}/progress               # Update goal progress

# Peer Feedback
POST /api/v1/feedback                                # Submit feedback
GET  /api/v1/feedback/user/{user_id}                # Get user's feedback

# Skill Assessments
GET  /api/v1/skills/user/{user_id}                  # Get user's skills
POST /api/v1/skills/assess                          # Create assessment
GET  /api/v1/skills/gaps/{user_id}                  # Identify skill gaps

# Performance Analytics
GET  /api/v1/analytics/user/{user_id}/performance   # Performance trends
GET  /api/v1/analytics/team/{org_id}/performance    # Team performance

# Reports
GET  /api/v1/reports/user/{user_id}/quarterly       # Quarterly report
GET  /api/v1/reports/team/{org_id}/quarterly        # Team report
```

**Recommendations**:
- Run on **port 8003** (to avoid conflicts)
- Use **SQLite** for simplicity (performance.db)
- Accept **Atlas JWT tokens** for authentication
- Return JSON responses with consistent error format

### 2. Authentication Integration
**What you need to do**:
- Validate JWT tokens from Atlas
- Extract user_id and role from token
- Implement role-based access (employees vs managers)
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

def require_manager(current_user: dict):
    if current_user['role'] not in ['manager', 'owner']:
        raise HTTPException(403, "Manager access required")
```

### 3. Data You Should Store
**Suggested Tables** (SQLite):
```sql
-- Link to Atlas users
performance_reviews (
    id, employee_id,  -- Link to Atlas user
    reviewer_id, review_period_start, review_period_end,
    overall_rating, strengths, areas_for_improvement,
    status  -- draft, submitted, acknowledged
)

performance_goals (
    id, user_id,  -- Link to Atlas user
    title, description, goal_type,
    target_value, current_value,
    start_date, target_date, status
)

peer_feedback (
    id, employee_id, reviewer_id,
    project_id,  -- Link to Atlas project
    feedback_type, rating, feedback_text,
    is_anonymous
)

skill_assessments (
    id, user_id,
    skill_name, skill_category,
    proficiency_level, proficiency_score,
    assessed_by, assessment_method
)

performance_metrics (
    id, user_id, metric_date,
    tasks_completed, tasks_on_time,
    productivity_score, collaboration_score,
    overall_score
)
```

### 4. Data Integration
**Pull data from Atlas for performance calculation**:
```python
# You can call Atlas API to get:
- Task completion rate: GET /api/v1/projects/{project_id}/tasks
- Project contributions: GET /api/v1/projects
- Issue resolution: GET /api/v1/issues/project/{project_id}

# Calculate performance score:
performance_score = (
    task_completion_rate * 0.30 +
    task_quality_score * 0.25 +      # From peer feedback
    productivity_score * 0.20 +      # From Code Crafters if integrated
    collaboration_score * 0.15 +     # From peer feedback
    goal_achievement_rate * 0.10     # From your goals
) * 100
```

### 5. MCP Tools We Need
**We will add these 10-12 tools to our MCP server**:

```python
# You provide the API, we create the tools:

1. get_user_performance(user_id, time_period)
   → Calls your: GET /api/v1/analytics/user/{user_id}/performance

2. create_performance_review(employee_id, review_period)
   → Calls your: POST /api/v1/reviews

3. set_performance_goal(user_id, title, goal_type, target)
   → Calls your: POST /api/v1/goals

4. get_team_performance(organization_id)
   → Calls your: GET /api/v1/analytics/team/{org_id}/performance

5. submit_peer_feedback(employee_id, feedback_type, rating, text)
   → Calls your: POST /api/v1/feedback

6. assess_skills(user_id, skill_name, proficiency_level)
   → Calls your: POST /api/v1/skills/assess

7. identify_skill_gaps(user_id, project_id)
   → Calls your: GET /api/v1/skills/gaps/{user_id}

8. track_goal_progress(goal_id, current_value)
   → Calls your: PUT /api/v1/goals/{goal_id}/progress

9. generate_performance_report(user_id, report_type)
   → Calls your: GET /api/v1/reports/user/{user_id}/quarterly

10. predict_performance_trend(user_id, prediction_months)
    → Calls your: POST /api/v1/analytics/predict
```

---

## 🔄 Integration Flow

```
1. User logs into Atlas → Gets JWT token
2. Manager uses Claude Desktop → MCP calls your API
3. Your API pulls task data from Atlas
4. Your API calculates performance metrics
5. MCP shows performance insights in Claude
```

---

## 📝 Implementation Checklist

### Your Team's Tasks:
- [ ] Create FastAPI project (port 8003)
- [ ] Set up SQLite database (performance.db)
- [ ] Implement 10-12 API endpoints listed above
- [ ] Add JWT token validation middleware
- [ ] Implement role-based access control
- [ ] Integrate with Atlas API to pull task data
- [ ] Test endpoints with Postman/curl
- [ ] Document API with example requests/responses
- [ ] Share API documentation with us

### Our Team's Tasks:
- [ ] Review your API documentation
- [ ] Add 10-12 new tools to MCP server
- [ ] Test integration end-to-end
- [ ] Update MCP documentation

---

## 🚀 Getting Started

### Step 1: Set Up Your Project
```bash
mkdir performance-api
cd performance-api
pip install fastapi uvicorn sqlalchemy pyjwt httpx
```

### Step 2: Create Basic Structure
```
performance-api/
├── main.py              # FastAPI app
├── database.py          # SQLite connection
├── models.py            # Data models
├── api/
│   ├── reviews.py       # Review endpoints
│   ├── goals.py         # Goal endpoints
│   ├── feedback.py      # Feedback endpoints
│   ├── skills.py        # Skill endpoints
│   └── analytics.py     # Analytics endpoints
└── requirements.txt
```

### Step 3: Integrate with Atlas
```python
# Call Atlas API to get task data
import httpx

async def get_user_tasks(user_id: int, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:8000/api/v1/projects",
            headers={"Authorization": f"Bearer {token}"}
        )
        projects = response.json()
        
        # Get tasks for each project
        all_tasks = []
        for project in projects:
            tasks_response = await client.get(
                f"http://localhost:8000/api/v1/projects/{project['id']}/tasks",
                headers={"Authorization": f"Bearer {token}"}
            )
            all_tasks.extend(tasks_response.json())
        
        return all_tasks

# Calculate performance metrics
def calculate_performance(tasks, feedback, goals):
    completed_tasks = [t for t in tasks if t['status'] == 'Done']
    completion_rate = len(completed_tasks) / len(tasks) if tasks else 0
    
    avg_feedback_rating = sum(f['rating'] for f in feedback) / len(feedback) if feedback else 0
    
    achieved_goals = [g for g in goals if g['status'] == 'achieved']
    goal_rate = len(achieved_goals) / len(goals) if goals else 0
    
    return {
        "completion_rate": completion_rate,
        "feedback_rating": avg_feedback_rating,
        "goal_achievement": goal_rate,
        "overall_score": (completion_rate * 0.4 + avg_feedback_rating/5 * 0.3 + goal_rate * 0.3) * 100
    }
```

### Step 4: Test Authentication
```bash
# Get token from Atlas
curl -X POST http://localhost:8000/api/v1/auth/demo-login

# Test your endpoint with token
curl -X GET http://localhost:8003/api/v1/analytics/user/1/performance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Share API Docs
- Document each endpoint (input/output)
- Provide example requests
- Share with Atlas team for MCP integration

---

## 💡 Key Points

### Keep It Simple
- ✅ Use FastAPI (same as us)
- ✅ Use SQLite (easy to set up)
- ✅ Use JWT tokens (no separate auth)
- ✅ Run on port 8003 (no conflicts)

### Focus On
- ✅ API endpoints that return JSON
- ✅ Role-based access control (employee vs manager)
- ✅ Integration with Atlas task data
- ✅ Fair and objective performance metrics
- ✅ Good documentation

### Don't Worry About
- ❌ Frontend (we'll handle it)
- ❌ MCP server (we'll create tools)
- ❌ Complex deployment (local dev first)
- ❌ User management (we handle it)

### Important Considerations
- ✅ **Fairness**: Use objective metrics from actual work
- ✅ **Transparency**: Clear explanation of scoring
- ✅ **Privacy**: Strict access controls for sensitive data
- ✅ **Development Focus**: For growth, not punishment
- ✅ **Multiple Sources**: Combine task data, peer feedback, and goals

---

## ⚖️ Ethical Guidelines

### Performance Metrics Should Be:
- **Objective**: Based on measurable data (tasks completed, quality ratings)
- **Fair**: Not biased against any group
- **Transparent**: Users understand how they're evaluated
- **Developmental**: Focus on improvement, not punishment

### Access Control:
- **Employees**: View own performance, submit peer feedback
- **Managers**: View team performance, create reviews
- **Admins**: System configuration only

### Privacy:
- Performance data is highly sensitive
- Strict access controls required
- No sharing without consent
- Secure storage and transmission

---

**Next Step**: Set up your FastAPI project and implement the 10-12 endpoints. Share API documentation when ready.
