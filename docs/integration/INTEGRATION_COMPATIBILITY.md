# 🔄 Integration Compatibility Guide

**Purpose**: Address compatibility concerns between Atlas and partner systems

---

## 🤔 Key Compatibility Questions

### 1. **Organizations vs Labs** (NexaCore)
**Question**: Atlas has "organizations", NexaCore has "labs" - how do they map?

**Answer**: They're the same concept, just different names.

**Solution**:
```python
# In NexaCore's database, link to Atlas organizations:
lab_profiles (
    id UUID,
    organization_id UUID,  # ← Links to Atlas organization
    lab_name VARCHAR,      # ← Your custom lab name
    domain VARCHAR,        # ← Your lab-specific field
    ...
)

# Mapping:
Atlas Organization = NexaCore Lab
- When Atlas creates organization → NexaCore creates lab profile
- organization_id is the common link
- Lab can have additional fields Atlas doesn't have
```

**Example**:
```
Atlas Organization: "AI Research Team" (id: abc-123)
    ↓
NexaCore Lab: "AI Research Team" (organization_id: abc-123, domain: "Machine Learning")
```

---

### 2. **Web App vs Desktop App** (Code Crafters)
**Question**: Atlas is web-based, Code Crafters has desktop agent - how do they work together?

**Answer**: Desktop agent runs in background, web app shows the data.

**Solution**:
```
User's Computer:
┌─────────────────────────────────────┐
│  Desktop Agent (Background)         │
│  - Tracks mouse/keyboard            │
│  - Uses Atlas JWT token             │
│  - Sends data to API (port 8002)    │
└─────────────────────────────────────┘
            │
            ▼ (HTTP POST)
┌─────────────────────────────────────┐
│  Code Crafters API (Port 8002)      │
│  - Receives activity data           │
│  - Stores in database               │
└─────────────────────────────────────┘
            │
            ▼ (HTTP GET)
┌─────────────────────────────────────┐
│  Atlas Web App (Browser)            │
│  - Shows productivity dashboard     │
│  - Displays charts and metrics      │
└─────────────────────────────────────┘
```

**User Flow**:
1. User logs into Atlas web app → Gets JWT token
2. Desktop agent uses same token → Tracks activity
3. User views productivity in Atlas web app → Sees their data

**Key Point**: Desktop agent is just a data collector. The web app displays everything.

---

### 3. **Different User Models**
**Question**: Each system might have different user fields - how do we sync?

**Answer**: Use Atlas user_id as the common link. Each system can have additional fields.

**Solution**:
```python
# Atlas User (Master)
users (
    id INTEGER PRIMARY KEY,  # ← Common link
    username VARCHAR,
    email VARCHAR,
    role VARCHAR
)

# NexaCore Researcher (Extended)
researcher_profiles (
    id UUID PRIMARY KEY,
    user_id INTEGER,  # ← Links to Atlas user.id
    expertise_domains TEXT[],  # ← NexaCore-specific
    years_experience INTEGER   # ← NexaCore-specific
)

# Code Crafters Productivity (Extended)
productivity_profiles (
    id UUID PRIMARY KEY,
    user_id INTEGER,  # ← Links to Atlas user.id
    idle_threshold_minutes INTEGER,  # ← CodeCrafters-specific
    work_hours_start TIME             # ← CodeCrafters-specific
)

# ScoreSquad Performance (Extended)
performance_profiles (
    id UUID PRIMARY KEY,
    user_id INTEGER,  # ← Links to Atlas user.id
    performance_rating DECIMAL,  # ← ScoreSquad-specific
    last_review_date DATE        # ← ScoreSquad-specific
)
```

**Key Point**: Atlas manages users, others extend with their own data.

---

## 🔗 Data Linking Strategy

### Concept: "Atlas is the Hub"

```
                    ┌─────────────┐
                    │   ATLAS     │
                    │  (Web App)  │
                    │             │
                    │ • Users     │
                    │ • Orgs      │
                    │ • Projects  │
                    │ • Tasks     │
                    └─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  NexaCore    │  │ CodeCrafters │  │  ScoreSquad  │
│              │  │              │  │              │
│ Links via:   │  │ Links via:   │  │ Links via:   │
│ • user_id    │  │ • user_id    │  │ • user_id    │
│ • org_id     │  │ • user_id    │  │ • user_id    │
│              │  │ • task_id    │  │ • project_id │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Linking Tables

**NexaCore**:
```sql
-- Links to Atlas organization
lab_profiles.organization_id → atlas.organizations.id

-- Links to Atlas user
researcher_profiles.user_id → atlas.users.id
```

**Code Crafters**:
```sql
-- Links to Atlas user
activity_sessions.user_id → atlas.users.id

-- Links to Atlas task
task_time_tracking.task_id → atlas.tasks.id
```

**ScoreSquad**:
```sql
-- Links to Atlas user
performance_reviews.employee_id → atlas.users.id

-- Links to Atlas project
peer_feedback.project_id → atlas.projects.id
```

---

## 🔄 Data Synchronization

### When Atlas Creates a User:

```python
# 1. User registers in Atlas
POST /api/v1/auth/register
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123"
}

# 2. Atlas creates user and organization
atlas.users: id=1, username="john_doe"
atlas.organizations: id="abc-123", owner_id=1

# 3. Partner systems create their profiles (automatically or on-demand)

# NexaCore creates lab profile:
nexacore.lab_profiles: 
    organization_id="abc-123",  # ← Same as Atlas
    lab_name="john_doe's Lab"

# Code Crafters creates productivity profile:
codecrafters.productivity_profiles:
    user_id=1,  # ← Same as Atlas
    tracking_enabled=true

# ScoreSquad creates performance profile:
scoresquad.performance_profiles:
    user_id=1,  # ← Same as Atlas
    overall_rating=null  # ← Will be calculated later
```

### Synchronization Methods:

**Option 1: On-Demand (Recommended for MVP)**
```python
# When partner system receives first request for a user:
def get_or_create_profile(user_id):
    profile = db.query(Profile).filter_by(user_id=user_id).first()
    if not profile:
        # Create profile on first access
        profile = Profile(user_id=user_id, ...)
        db.add(profile)
        db.commit()
    return profile
```

**Option 2: Webhooks (Future Enhancement)**
```python
# Atlas sends webhook when user created:
POST http://localhost:8001/webhooks/user-created
{
    "user_id": 1,
    "username": "john_doe",
    "organization_id": "abc-123"
}

# Partner system creates profile automatically
```

**Option 3: Periodic Sync (Fallback)**
```python
# Run nightly job to sync users:
async def sync_users():
    atlas_users = await get_atlas_users()
    for user in atlas_users:
        if not profile_exists(user.id):
            create_profile(user.id)
```

---

## 🖥️ Desktop Agent Integration (Code Crafters)

### How Desktop Agent Works with Web App:

**Step 1: User Logs In (Web)**
```
User opens Atlas web app → http://localhost:5173
Logs in → Gets JWT token
Token stored in browser localStorage
```

**Step 2: Desktop Agent Gets Token**
```python
# Option A: User copies token from web app
token = input("Paste your Atlas token: ")

# Option B: Desktop agent opens browser for login
import webbrowser
webbrowser.open("http://localhost:5173/get-token")
# User logs in, token is copied to clipboard

# Option C: Desktop agent has mini login form
username = input("Atlas username: ")
password = input("Atlas password: ")
token = login_to_atlas(username, password)
```

**Step 3: Desktop Agent Tracks Activity**
```python
class ActivityTracker:
    def __init__(self, token):
        self.token = token
        self.api_url = "http://localhost:8002"
    
    def track_activity(self):
        while True:
            # Track mouse/keyboard
            activity = self.get_activity()
            
            # Send to Code Crafters API
            requests.post(
                f"{self.api_url}/api/v1/activity/log",
                headers={"Authorization": f"Bearer {self.token}"},
                json=activity
            )
            
            time.sleep(60)  # Every minute
```

**Step 4: User Views Data (Web)**
```
User opens Atlas web app
Clicks "Productivity" tab
Atlas web app calls Code Crafters API
Shows productivity charts
```

**Key Point**: Desktop agent and web app are separate but use same authentication.

---

## 📊 Example: Complete User Journey

### Scenario: Manager wants to see team productivity

**Step 1: Setup**
```
1. Manager logs into Atlas web app
2. Each team member installs desktop agent
3. Desktop agents use Atlas tokens to authenticate
4. Agents track activity in background
```

**Step 2: Data Collection**
```
Desktop Agent (Employee 1) → Code Crafters API → Database
Desktop Agent (Employee 2) → Code Crafters API → Database
Desktop Agent (Employee 3) → Code Crafters API → Database
```

**Step 3: Manager Views Data**
```
Manager opens Atlas web app
Clicks "Team Productivity" dashboard
Atlas MCP server calls Code Crafters API
Code Crafters API returns aggregated data
Atlas shows charts and metrics
```

**Step 4: Manager Uses Claude**
```
Manager: "Show me team productivity this week"
Claude uses MCP tool: get_team_productivity(org_id)
MCP calls Code Crafters API
Returns: "Team averaged 6.5 productive hours/day"
```

---

## 🎯 Simplified Integration Approach

### What Each Team Actually Needs to Do:

**NexaCore**:
1. Create API that accepts Atlas JWT tokens
2. Store `organization_id` to link labs to Atlas organizations
3. Store `user_id` to link researchers to Atlas users
4. Provide endpoints that return lab analytics

**Code Crafters**:
1. Adapt desktop agent to use Atlas JWT tokens
2. Create API that accepts activity data from desktop agent
3. Store `user_id` to link activity to Atlas users
4. Store `task_id` when user is working on a task
5. Provide endpoints that return productivity metrics

**ScoreSquad**:
1. Create API that accepts Atlas JWT tokens
2. Store `user_id` to link performance to Atlas users
3. Store `project_id` to link feedback to Atlas projects
4. Call Atlas API to get task completion data
5. Provide endpoints that return performance metrics

---

## ✅ Compatibility Checklist

### For All Teams:

- [ ] **Authentication**: Use Atlas JWT tokens (no separate login)
- [ ] **User Linking**: Store Atlas `user_id` in your database
- [ ] **Organization Linking**: Store Atlas `organization_id` if applicable
- [ ] **API Format**: Return JSON responses
- [ ] **Error Handling**: Return consistent error format
- [ ] **Port Assignment**: Use assigned port (8001, 8002, 8003)

### For NexaCore:
- [ ] Map "labs" to Atlas "organizations" via `organization_id`
- [ ] Map "researchers" to Atlas "users" via `user_id`

### For Code Crafters:
- [ ] Desktop agent uses Atlas JWT token
- [ ] Desktop agent sends data to your API (not Atlas)
- [ ] Web app displays data from your API
- [ ] Link activity to Atlas tasks via `task_id`

### For ScoreSquad:
- [ ] Link performance to Atlas users via `user_id`
- [ ] Link feedback to Atlas projects via `project_id`
- [ ] Call Atlas API to get task completion data

---

## 🚀 Start Simple

### Don't Worry About:
- ❌ Perfect data sync (on-demand is fine)
- ❌ Real-time updates (periodic refresh is fine)
- ❌ Complex UI (Atlas handles it)
- ❌ Webhooks (add later if needed)

### Focus On:
- ✅ Working API endpoints
- ✅ Correct authentication
- ✅ Proper data linking (user_id, org_id)
- ✅ Good documentation

---

**Key Takeaway**: Atlas is the hub. Partner systems extend it with specialized data. Everything links via user_id and organization_id. Desktop agent is just a data collector - web app displays everything.
