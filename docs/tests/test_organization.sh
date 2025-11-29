#!/bin/bash

echo "🧪 Testing Organization Feature"
echo "================================"
echo ""

# Test 1: Register user
echo "Test 1: Register new user..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testowner","email":"owner@test.com","password":"test123"}')

TOKEN=$(echo $RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Registration failed"
    exit 1
fi
echo "✅ User registered successfully"
echo ""

# Test 2: Check organization
echo "Test 2: Check organization was auto-created..."
ORG=$(curl -s http://localhost:8000/api/v1/organizations/my-organization \
  -H "Authorization: Bearer $TOKEN")

ORG_ID=$(echo $ORG | python -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

if [ -z "$ORG_ID" ]; then
    echo "❌ Organization not found"
    exit 1
fi
echo "✅ Organization created: $ORG_ID"
echo ""

# Test 3: Add team member
echo "Test 3: Add team member..."
ADD_MEMBER=$(curl -s -X POST http://localhost:8000/api/v1/organizations/add-member \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@test.com","password":"dev123","username":"testdev","role":"developer","description":"Full stack developer"}')

if echo $ADD_MEMBER | grep -q "successfully"; then
    echo "✅ Team member added"
else
    echo "❌ Failed to add team member"
    echo $ADD_MEMBER
    exit 1
fi
echo ""

# Test 4: List team members
echo "Test 4: List team members..."
MEMBERS=$(curl -s http://localhost:8000/api/v1/organizations/members \
  -H "Authorization: Bearer $TOKEN")

MEMBER_COUNT=$(echo $MEMBERS | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$MEMBER_COUNT" -eq "2" ]; then
    echo "✅ Found 2 team members (owner + dev)"
else
    echo "❌ Expected 2 members, found $MEMBER_COUNT"
    exit 1
fi
echo ""

# Test 5: Create project
echo "Test 5: Create project with AI..."
PROJECT=$(curl -s -X POST http://localhost:8000/api/v1/ai/discover \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Create a simple todo app"}')

if echo $PROJECT | grep -q "Project Created"; then
    echo "✅ Project created successfully"
else
    echo "❌ Project creation failed"
    echo $PROJECT
    exit 1
fi
echo ""

# Test 6: List projects
echo "Test 6: List projects..."
PROJECTS=$(curl -s http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN")

PROJECT_COUNT=$(echo $PROJECTS | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$PROJECT_COUNT" -ge "1" ]; then
    echo "✅ Found $PROJECT_COUNT project(s)"
else
    echo "❌ No projects found"
    exit 1
fi
echo ""

# Test 7: Team member login
echo "Test 7: Team member login..."
MEMBER_TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@test.com","password":"dev123"}' | \
  python -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$MEMBER_TOKEN" ]; then
    echo "❌ Team member login failed"
    exit 1
fi
echo "✅ Team member logged in"
echo ""

# Test 8: Team member sees same projects
echo "Test 8: Team member sees organization projects..."
MEMBER_PROJECTS=$(curl -s http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer $MEMBER_TOKEN")

MEMBER_PROJECT_COUNT=$(echo $MEMBER_PROJECTS | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$MEMBER_PROJECT_COUNT" -eq "$PROJECT_COUNT" ]; then
    echo "✅ Team member sees same projects"
else
    echo "❌ Project isolation issue"
    exit 1
fi
echo ""

echo "================================"
echo "✅ All tests passed!"
echo "================================"
