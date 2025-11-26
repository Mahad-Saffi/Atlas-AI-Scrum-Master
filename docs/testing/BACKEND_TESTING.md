# Backend API Testing with curl

Complete guide to test all backend endpoints using curl commands.

---

## 🚀 Prerequisites

1. **Backend running**: `uvicorn main:app --reload --port 8000`
2. **Git Bash or WSL**: For curl commands on Windows

---

## 📝 Test Sequence

### 1. Health Check (No Auth Required)

```bash
# Test if backend is running
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"atlas-backend"}
```

### 2. Root Endpoint (No Auth Required)

```bash
# Test root endpoint
curl http://localhost:8000/

# Expected response:
# {"Hello":"World"}
```

---

## 🔐 Authentication Flow

### Step 1: Get GitHub OAuth URL

```bash
# This will redirect to GitHub
curl -L http://localhost:8000/auth/github

# Or open in browser:
# http://localhost:8000/auth/github
```

### Step 2: Complete OAuth (Use Browser)

1. Open: http://localhost:8000/auth/github
2. Authorize with GitHub
3. You'll be redirected to: `http://localhost:5173/auth/callback?token=YOUR_JWT_TOKEN&user=USER_DATA`
4. Copy the JWT token from the URL

### Step 3: Save Token for Testing

```bash
# Save your token in a variable (replace with your actual token)
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Or on Windows CMD:
set JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Test Authentication

```bash
# Get current user info
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8000/users/me

# Expected response:
# {
#   "id": 1,
#   "username": "your-github-username",
#   "email": "your@email.com",
#   "role": "developer",
#   "avatar_url": "https://..."
# }
```

---

## 🤖 AI Project Creation

### Test Conversational AI

```bash
# Step 1: Start conversation
curl -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'

# Expected response:
# {
#   "sender": "ai",
#   "text": "Welcome! I can help you create a new project..."
# }

# Step 2: Describe project
curl -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to build a task management system"}'

# Expected response:
# {
#   "sender": "ai",
#   "text": "Great! Based on your project description, I suggest the following team..."
# }

# Step 3: Confirm and create project
curl -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Yes, create the project"}'

# Expected response:
# {
#   "sender": "ai",
#   "text": "✅ Project created successfully!..."
# }
```

---

## 📊 Project & Task Management

### Get Project Tasks

```bash
# Get tasks for a specific project
# Replace PROJECT_ID with actual UUID from database
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8000/api/v1/projects/PROJECT_ID/tasks

# Example:
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8000/api/v1/projects/550e8400-e29b-41d4-a716-446655440000/tasks

# Expected response:
# [
#   {
#     "id": "task-uuid",
#     "title": "Task 1",
#     "description": "...",
#     "status": "To Do",
#     "assignee_id": null,
#     ...
#   }
# ]
```

### Complete a Task

```bash
# Mark task as complete
# Replace TASK_ID with actual UUID
curl -X POST http://localhost:8000/api/v1/projects/tasks/TASK_ID/complete \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "message": "Task completed successfully",
#   "task": {
#     "id": "task-uuid",
#     "title": "Task 1",
#     "status": "Done",
#     "next_task": {
#       "id": "next-task-uuid",
#       "title": "Task 2"
#     }
#   }
# }
```

---

## 🔍 Database Inspection

### Check Database Contents

```bash
# Navigate to backend folder
cd backend

# Open SQLite database
sqlite3 test.db

# In SQLite prompt:
.tables                           # List all tables
SELECT * FROM users;              # View users
SELECT * FROM projects;           # View projects
SELECT * FROM epics;              # View epics
SELECT * FROM stories;            # View stories
SELECT * FROM tasks;              # View tasks
.quit                             # Exit
```

### Quick Database Queries

```bash
# Count records
sqlite3 test.db "SELECT COUNT(*) FROM users;"
sqlite3 test.db "SELECT COUNT(*) FROM projects;"
sqlite3 test.db "SELECT COUNT(*) FROM tasks;"

# View recent projects
sqlite3 test.db "SELECT id, name, owner_id FROM projects ORDER BY created_at DESC LIMIT 5;"

# View tasks by status
sqlite3 test.db "SELECT title, status FROM tasks WHERE status='To Do';"
```

---

## 🧪 Complete Test Script

Save this as `test-backend.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Atlas Backend API"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
response=$(curl -s http://localhost:8000/health)
if [[ $response == *"healthy"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test 2: Root Endpoint
echo "Test 2: Root Endpoint"
response=$(curl -s http://localhost:8000/)
if [[ $response == *"Hello"* ]]; then
    echo -e "${GREEN}✓ Root endpoint passed${NC}"
else
    echo -e "${RED}✗ Root endpoint failed${NC}"
fi
echo ""

# Test 3: API Docs
echo "Test 3: API Documentation"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs)
if [[ $response == "200" ]]; then
    echo -e "${GREEN}✓ API docs accessible${NC}"
else
    echo -e "${RED}✗ API docs not accessible${NC}"
fi
echo ""

# Test 4: Auth Required Endpoint (should fail without token)
echo "Test 4: Protected Endpoint (should return 401)"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/users/me)
if [[ $response == "401" ]]; then
    echo -e "${GREEN}✓ Auth protection working${NC}"
else
    echo -e "${RED}✗ Auth protection not working${NC}"
fi
echo ""

echo "=============================="
echo "Basic tests complete!"
echo ""
echo "For authenticated tests, you need a JWT token."
echo "Get one by logging in through: http://localhost:8000/auth/github"
```

Run it:
```bash
bash test-backend.sh
```

---

## 📋 Common Test Scenarios

### Scenario 1: New User Registration

```bash
# 1. User logs in via GitHub OAuth
# Open in browser: http://localhost:8000/auth/github

# 2. Check if user was created
sqlite3 backend/test.db "SELECT * FROM users ORDER BY created_at DESC LIMIT 1;"
```

### Scenario 2: Create Project via AI

```bash
# Set your token
export JWT_TOKEN="your-token-here"

# Start conversation
curl -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a web app project"}' | jq

# Continue conversation
curl -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Yes, proceed"}' | jq

# Check if project was created
sqlite3 backend/test.db "SELECT * FROM projects;"
```

### Scenario 3: Task Workflow

```bash
# 1. Get project ID
PROJECT_ID=$(sqlite3 backend/test.db "SELECT id FROM projects LIMIT 1;")

# 2. Get tasks for project
curl -H "Authorization: Bearer $JWT_TOKEN" \
  "http://localhost:8000/api/v1/projects/$PROJECT_ID/tasks" | jq

# 3. Get first task ID
TASK_ID=$(sqlite3 backend/test.db "SELECT id FROM tasks LIMIT 1;")

# 4. Complete the task
curl -X POST "http://localhost:8000/api/v1/projects/tasks/$TASK_ID/complete" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq

# 5. Verify task status changed
sqlite3 backend/test.db "SELECT title, status FROM tasks WHERE id='$TASK_ID';"
```

---

## 🐛 Debugging Tips

### Check Backend Logs

Watch the terminal where uvicorn is running. You'll see:
- Incoming requests
- Response status codes
- Any errors

### Enable Verbose curl

```bash
# See full request/response
curl -v http://localhost:8000/health

# Save response to file
curl http://localhost:8000/health > response.json
```

### Test with Different Tools

```bash
# Using wget
wget -O- http://localhost:8000/health

# Using httpie (if installed)
http http://localhost:8000/health

# Using Python
python -c "import requests; print(requests.get('http://localhost:8000/health').json())"
```

---

## 📊 Performance Testing

### Simple Load Test

```bash
# Send 100 requests
for i in {1..100}; do
  curl -s http://localhost:8000/health > /dev/null
  echo "Request $i completed"
done

# Measure response time
time curl http://localhost:8000/health
```

---

## ✅ Verification Checklist

- [ ] Health endpoint returns 200
- [ ] Root endpoint returns JSON
- [ ] API docs accessible at /docs
- [ ] GitHub OAuth redirects correctly
- [ ] JWT token is generated after auth
- [ ] /users/me returns user data with valid token
- [ ] /users/me returns 401 without token
- [ ] AI discover endpoint accepts messages
- [ ] Projects are created in database
- [ ] Tasks are created with projects
- [ ] Task completion updates status
- [ ] Next task is auto-assigned

---

## 🔗 Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/health` | GET | No | Health check |
| `/` | GET | No | Root endpoint |
| `/docs` | GET | No | API documentation |
| `/auth/github` | GET | No | Start OAuth |
| `/auth/callback` | GET | No | OAuth callback |
| `/users/me` | GET | Yes | Get current user |
| `/api/v1/ai/discover` | POST | Yes | AI conversation |
| `/api/v1/projects/{id}/tasks` | GET | Yes | Get project tasks |
| `/api/v1/projects/tasks/{id}/complete` | POST | Yes | Complete task |

---

**Happy Testing! 🚀**
