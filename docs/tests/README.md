# Test Scripts

Test scripts for Atlas AI Scrum Master functionality.

## 📋 Available Tests

### 🧪 **test_bulk_assign.py**
Tests the bulk task assignment feature.

**Usage:**
```bash
python docs/tests/test_bulk_assign.py
```

**What it tests:**
- Getting projects and tasks
- Finding team members
- Bulk assigning multiple tasks
- Verifying assignments

### 🔌 **test_mcp.py**
Tests the MCP server integration.

**Usage:**
```bash
python docs/tests/test_mcp.py
```

**What it tests:**
- MCP server connectivity
- Tool availability
- API integration
- Error handling

### 🏢 **test_organization.sh**
Tests the organization management features.

**Usage:**
```bash
bash docs/tests/test_organization.sh
```

**What it tests:**
- Organization creation
- Team member management
- Project isolation
- Multi-tenant features

## 🚀 Running All Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
python docs/tests/test_bulk_assign.py
python docs/tests/test_mcp.py
bash docs/tests/test_organization.sh
```

## 📝 Test Requirements

- Backend server running on port 8000
- Valid JWT token (get from demo login)
- Organization with team members
- At least one project with tasks

## 🔧 Configuration

Update the token in test scripts:
```python
TOKEN = "your_jwt_token_here"
```

Get a fresh token:
```bash
curl -X POST http://localhost:8000/api/v1/auth/demo-login
```
