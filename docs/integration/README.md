# 🔌 Atlas Integration Hub

Welcome to the Atlas AI Scrum Master integration documentation. This directory contains integration plans for three partner teams to extend Atlas with additional capabilities.

---

## ⚠️ Read This First

**[Integration Compatibility Guide](./INTEGRATION_COMPATIBILITY.md)** - Addresses common questions:
- How do "labs" map to "organizations"?
- How does desktop agent work with web app?
- How do we link data between systems?
- What's the simplest integration approach?

---

## 📚 Integration Plans

### 1. [NexaCore - Lab Analytics](./NEXACORE_INTEGRATION_PLAN.md)
**What they do**: Analyze lab historical records, productivity, and success rates  
**What we get**: AI-powered project estimates, resource allocation, collaboration recommendations  
**Port**: 8001  
**Tools**: 6-8 new MCP tools  
**Key Link**: Labs = Organizations (via `organization_id`)

### 2. [Code Crafters - Productivity Tracking](./CODECRAFTERS_INTEGRATION_PLAN.md)
**What they do**: Track mouse/keyboard activity, calculate productive vs idle time  
**What we get**: Real-time productivity insights, task time tracking, workload optimization  
**Port**: 8002  
**Tools**: 8-10 new MCP tools  
**Key Link**: Desktop agent → API → Web app (via `user_id` and `task_id`)

### 3. [ScoreSquad - Performance Assessment](./SCORESQUAD_INTEGRATION_PLAN.md)
**What they do**: Employee performance tracking and manager assessment tools  
**What we get**: Performance reviews, goal tracking, peer feedback, skill assessments  
**Port**: 8003  
**Tools**: 10-12 new MCP tools  
**Key Link**: Performance data linked via `user_id` and `project_id`

---

## 🏗️ Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Atlas Frontend (React)                    │
│  Task Board | Lab Analytics | Productivity | Performance    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Atlas MCP Server v3 (18 + 6-8 + 8-10 + 10-12)       │
│                    Total: ~50 tools                          │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Atlas API    │  │ NexaCore API │  │ CodeCrafters │
│ Port 8000    │  │ Port 8001    │  │ Port 8002    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ atlas.db     │  │ nexacore.db  │  │ Supabase/    │
│              │  │              │  │ SQLite       │
└──────────────┘  └──────────────┘  └──────────────┘
                                            │
                                            ▼
                                  ┌──────────────┐
                                  │ ScoreSquad   │
                                  │ Port 8003    │
                                  └──────────────┘
                                            │
                                            ▼
                                  ┌──────────────┐
                                  │performance.db│
                                  └──────────────┘
```

---

## 🎯 What We Provide (Atlas)

### 1. Authentication System
- **JWT Tokens**: 7-day expiry, contains user_id, email, role
- **Demo Login**: `POST /api/v1/auth/demo-login`
- **User Login**: `POST /api/v1/auth/login`
- **Token Format**: `Bearer eyJhbGc...`

### 2. User & Organization Data
- **Users**: id, username, email, role, organization_id
- **Organizations**: Multi-tenant with owner and members
- **Projects**: Belong to organizations
- **Tasks**: Linked to projects with assignees

### 3. MCP Server Framework
- **Protocol**: Model Context Protocol (MCP)
- **Language**: Python
- **Dependencies**: `pip install mcp httpx`
- **Current Tools**: 18 tools across 6 categories
- **File**: `atlas_mcp_server_v2.py`

### 4. API Endpoints You Can Use
```http
GET  /api/v1/projects                          # List projects
GET  /api/v1/projects/{id}/tasks               # Get project tasks
GET  /api/v1/organizations/members             # List team members
GET  /api/v1/issues/project/{id}               # Get project issues
```

---

## 🔧 What We Need From You

### All Teams Must Provide:

#### 1. **Backend API Service**
- FastAPI or Flask (your choice)
- Run on assigned port (8001, 8002, or 8003)
- Accept Atlas JWT tokens for authentication
- Return JSON responses
- Handle errors gracefully

#### 2. **API Documentation**
- List of all endpoints
- Request/response examples
- Error codes and messages
- Authentication requirements

#### 3. **Database Schema**
- Table definitions
- Relationships to Atlas data (user_id, project_id, etc.)
- Sample data for testing

#### 4. **Testing Support**
- Provide test credentials
- Sample API calls
- Expected responses

---

## 🚀 Integration Process

### Phase 1: Setup
1. Each team reviews their integration plan
2. Set up development environment
3. Create API project structure
4. Implement authentication

### Phase 2: API Development
1. Implement required endpoints
2. Test with Postman/curl
3. Document API
4. Share documentation with Atlas team

### Phase 3: MCP Integration
1. Atlas team reviews API documentation
2. Atlas team adds new tools to MCP server
3. Joint testing
4. Bug fixes

### Phase 4: Testing & Launch
1. End-to-end testing
2. Performance testing
3. Documentation updates
4. Launch

---

## 📝 Common Requirements

### Authentication
All teams must validate Atlas JWT tokens:

```python
from fastapi import Header, HTTPException
import jwt

SECRET_KEY = "your-secret-key"  # Same as Atlas

def verify_atlas_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # Contains: user_id, email, role, exp
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except:
        raise HTTPException(401, "Invalid token")
```

### Error Handling
Return consistent error format:

```json
{
  "detail": "Error message here",
  "error_code": "RESOURCE_NOT_FOUND",
  "status_code": 404
}
```

### Response Format
Return consistent success format:

```json
{
  "data": { ... },
  "message": "Success message",
  "timestamp": "2025-11-30T10:00:00Z"
}
```

---

## 🧪 Testing

### Get Atlas JWT Token
```bash
# Demo login
curl -X POST http://localhost:8000/api/v1/auth/demo-login

# Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { "id": 3, "username": "demo_user", ... }
}
```

### Test Your API
```bash
# Replace YOUR_TOKEN with actual token
curl -X GET http://localhost:8001/api/v1/your-endpoint \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test MCP Integration
```bash
# After Atlas team adds your tools
python atlas_mcp_server_v3.py
```

---

## 📊 Success Criteria

### Technical
- ✅ API responds in < 500ms
- ✅ Authentication works correctly
- ✅ All endpoints documented
- ✅ Error handling implemented
- ✅ MCP tools working

### Integration
- ✅ Data flows between systems
- ✅ No authentication issues
- ✅ No port conflicts
- ✅ Consistent error handling

### User Experience
- ✅ Fast response times
- ✅ Clear error messages
- ✅ Intuitive tool usage
- ✅ Reliable operation

---

## 🎯 Quick Start Checklist

For each team:

- [ ] Read your integration plan
- [ ] Set up development environment
- [ ] Create API project structure
- [ ] Implement authentication
- [ ] Implement required endpoints
- [ ] Test with Atlas JWT tokens
- [ ] Document API
- [ ] Share documentation with Atlas team
- [ ] Joint testing
- [ ] Launch

---

## 📚 Additional Resources

- [How to Create MCP Server](../guides/HOW_TO_CREATE_MCP_SERVER.md)
- [Atlas Architecture](../architecture.md)
- [Atlas Project Structure](../PROJECT_STRUCTURE.md)
- [MCP Quick Start](../mcp/MCP_QUICK_START.md)

---

**Status**: Ready for Integration
