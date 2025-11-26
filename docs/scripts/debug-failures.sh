#!/bin/bash

echo "🔍 Debugging Failed Tests"
echo "========================="
echo ""

# Check database location and contents
echo "1. Database Check:"
echo "   Location: backend/test.db"
if [ -f "backend/test.db" ]; then
    echo "   ✓ File exists"
    echo ""
    echo "   Users table:"
    sqlite3 backend/test.db "SELECT id, username, email FROM users;" 2>&1
    echo ""
    echo "   Projects table:"
    sqlite3 backend/test.db "SELECT id, name, owner_id FROM projects;" 2>&1
    echo ""
    echo "   Tasks table (first 3):"
    sqlite3 backend/test.db "SELECT id, title, status, project_id FROM tasks LIMIT 3;" 2>&1
else
    echo "   ✗ File not found!"
fi

echo ""
echo "2. Test Auth Protection:"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/users/me)
echo "   Response: $response"

echo ""
echo "3. Test Get Tasks Endpoint:"
PROJECT_ID=$(sqlite3 backend/test.db "SELECT id FROM projects LIMIT 1;" 2>/dev/null)
echo "   Project ID: $PROJECT_ID"
if [ -n "$PROJECT_ID" ]; then
    echo "   Testing endpoint: /api/v1/projects/$PROJECT_ID/tasks"
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        "http://localhost:8000/api/v1/projects/$PROJECT_ID/tasks")
    echo "   Response: $response"
fi

echo ""
echo "4. Test Complete Task Endpoint:"
TASK_ID=$(sqlite3 backend/test.db "SELECT id FROM tasks WHERE status='To Do' LIMIT 1;" 2>/dev/null)
echo "   Task ID: $TASK_ID"
if [ -n "$TASK_ID" ]; then
    echo "   Testing endpoint: /api/v1/projects/tasks/$TASK_ID/complete"
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        "http://localhost:8000/api/v1/projects/tasks/$TASK_ID/complete")
    echo "   Response: $response"
fi

echo ""
echo "5. Check Backend Logs:"
echo "   Check your backend terminal for any errors"
