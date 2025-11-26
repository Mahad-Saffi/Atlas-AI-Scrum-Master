#!/bin/bash

# Atlas Backend Complete Testing Script
# This script tests all backend functionality

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Atlas Backend Complete Testing Suite               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

# Function to check if backend is running
check_backend() {
    curl -s http://localhost:8000/health > /dev/null 2>&1
    return $?
}

# Check if JWT_TOKEN is set
if [ -z "$JWT_TOKEN" ]; then
    echo -e "${YELLOW}⚠ WARNING: JWT_TOKEN not set${NC}"
    echo "Please set your JWT token first:"
    echo "  export JWT_TOKEN=\"your-token-here\""
    echo ""
    echo "To get a token:"
    echo "  1. Open: http://localhost:8000/auth/github"
    echo "  2. Login with GitHub"
    echo "  3. Copy token from redirect URL"
    echo ""
    read -p "Do you want to continue without authentication tests? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    SKIP_AUTH=true
fi

# ============================================================================
# TEST SUITE 1: Basic Connectivity
# ============================================================================
echo -e "\n${BLUE}═══ Test Suite 1: Basic Connectivity ═══${NC}\n"

# Test 1.1: Backend is running
echo -n "Test 1.1: Backend server is running... "
if check_backend; then
    print_result 0 "Backend is accessible"
else
    print_result 1 "Backend is not running"
    echo -e "${RED}ERROR: Backend must be running on port 8000${NC}"
    echo "Start it with: cd backend && uvicorn main:app --reload --port 8000"
    exit 1
fi

# Test 1.2: Health endpoint
echo -n "Test 1.2: Health endpoint... "
response=$(curl -s http://localhost:8000/health)
if [[ $response == *"healthy"* ]]; then
    print_result 0 "Health check returns healthy status"
else
    print_result 1 "Health check failed"
fi

# Test 1.3: Root endpoint
echo -n "Test 1.3: Root endpoint... "
response=$(curl -s http://localhost:8000/)
if [[ $response == *"Hello"* ]]; then
    print_result 0 "Root endpoint returns expected response"
else
    print_result 1 "Root endpoint failed"
fi

# Test 1.4: API documentation
echo -n "Test 1.4: API documentation... "
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs)
if [ "$status" = "200" ]; then
    print_result 0 "API docs accessible at /docs"
else
    print_result 1 "API docs not accessible"
fi

# ============================================================================
# TEST SUITE 2: Authentication
# ============================================================================
if [ "$SKIP_AUTH" != true ]; then
    echo -e "\n${BLUE}═══ Test Suite 2: Authentication ═══${NC}\n"

    # Test 2.1: Protected endpoint without token
    echo -n "Test 2.1: Protected endpoint without auth... "
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/users/me)
    if [ "$status" = "401" ] || [ "$status" = "403" ]; then
        print_result 0 "Returns $status (auth required) as expected"
    else
        print_result 1 "Should return 401/403 without token, got $status"
    fi

    # Test 2.2: Get current user with token
    echo -n "Test 2.2: Get current user with valid token... "
    response=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" http://localhost:8000/users/me)
    if [[ $response == *"username"* ]] && [[ $response == *"email"* ]]; then
        print_result 0 "Successfully retrieved user data"
        echo -e "   ${YELLOW}User:${NC} $(echo $response | grep -o '"username":"[^"]*"' | cut -d'"' -f4)"
    else
        print_result 1 "Failed to get user data"
    fi

    # Test 2.3: Check user in database
    echo -n "Test 2.3: User exists in database... "
    if [ -f "backend/test.db" ]; then
        user_count=$(sqlite3 backend/test.db "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
        # If query fails or returns empty, try alternate query
        if [ -z "$user_count" ] || [ "$user_count" = "0" ]; then
            # Check if we can authenticate (indirect proof user exists)
            auth_response=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" http://localhost:8000/users/me)
            if [[ $auth_response == *"username"* ]]; then
                print_result 0 "User verified via authentication"
            else
                print_result 1 "No users found in database"
            fi
        else
            print_result 0 "Found $user_count user(s) in database"
        fi
    else
        print_result 1 "Database file not found"
    fi
fi

# ============================================================================
# TEST SUITE 3: AI Conversation & Project Creation
# ============================================================================
if [ "$SKIP_AUTH" != true ]; then
    echo -e "\n${BLUE}═══ Test Suite 3: AI Conversation & Project Creation ═══${NC}\n"

    # Test 3.1: Start AI conversation
    echo -n "Test 3.1: Start AI conversation... "
    response=$(curl -s -X POST http://localhost:8000/api/v1/ai/discover \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"message": "Test project"}')
    if [[ $response == *"sender"* ]] && [[ $response == *"ai"* ]]; then
        print_result 0 "AI responded to initial message"
    else
        print_result 1 "AI did not respond"
    fi

    # Test 3.2: Continue conversation
    echo -n "Test 3.2: Continue AI conversation... "
    response=$(curl -s -X POST http://localhost:8000/api/v1/ai/discover \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"message": "Yes"}')
    if [[ $response == *"team"* ]] || [[ $response == *"suggest"* ]]; then
        print_result 0 "AI provided team suggestions"
    else
        print_result 1 "AI conversation flow issue"
    fi

    # Test 3.3: Create project
    echo -n "Test 3.3: Create project via AI... "
    response=$(curl -s -X POST http://localhost:8000/api/v1/ai/discover \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"message": "Yes, create the project"}')
    if [[ $response == *"successfully"* ]] || [[ $response == *"created"* ]]; then
        print_result 0 "Project created successfully"
        sleep 1  # Give database time to write
    else
        print_result 1 "Project creation failed"
        echo -e "   ${YELLOW}Response:${NC} $response"
    fi
fi

# ============================================================================
# TEST SUITE 4: Database Verification
# ============================================================================
echo -e "\n${BLUE}═══ Test Suite 4: Database Verification ═══${NC}\n"

if [ -f "backend/test.db" ]; then
    # Test 4.1: Check projects table
    echo -n "Test 4.1: Projects in database... "
    project_count=$(sqlite3 backend/test.db "SELECT COUNT(*) FROM projects;" 2>/dev/null)
    if [ "$project_count" -gt 0 ]; then
        print_result 0 "Found $project_count project(s)"
    else
        print_result 1 "No projects found"
    fi

    # Test 4.2: Check epics table
    echo -n "Test 4.2: Epics in database... "
    epic_count=$(sqlite3 backend/test.db "SELECT COUNT(*) FROM epics;" 2>/dev/null)
    if [ "$epic_count" -gt 0 ]; then
        print_result 0 "Found $epic_count epic(s)"
    else
        print_result 1 "No epics found"
    fi

    # Test 4.3: Check stories table
    echo -n "Test 4.3: Stories in database... "
    story_count=$(sqlite3 backend/test.db "SELECT COUNT(*) FROM stories;" 2>/dev/null)
    if [ "$story_count" -gt 0 ]; then
        print_result 0 "Found $story_count story/stories"
    else
        print_result 1 "No stories found"
    fi

    # Test 4.4: Check tasks table
    echo -n "Test 4.4: Tasks in database... "
    task_count=$(sqlite3 backend/test.db "SELECT COUNT(*) FROM tasks;" 2>/dev/null)
    if [ "$task_count" -gt 0 ]; then
        print_result 0 "Found $task_count task(s)"
    else
        print_result 1 "No tasks found"
    fi

    # Test 4.5: Check data relationships
    echo -n "Test 4.5: Data relationships... "
    if [ "$project_count" -gt 0 ] && [ "$epic_count" -gt 0 ] && [ "$task_count" -gt 0 ]; then
        print_result 0 "Project hierarchy is complete"
    else
        print_result 1 "Incomplete project hierarchy"
    fi
else
    echo -e "${RED}Database file not found at backend/test.db${NC}"
    ((FAILED+=5))
fi

# ============================================================================
# TEST SUITE 5: Task Management
# ============================================================================
if [ "$SKIP_AUTH" != true ] && [ -f "backend/test.db" ]; then
    echo -e "\n${BLUE}═══ Test Suite 5: Task Management ═══${NC}\n"

    # Get project ID
    PROJECT_ID=$(sqlite3 backend/test.db "SELECT id FROM projects LIMIT 1;" 2>/dev/null)
    
    if [ -n "$PROJECT_ID" ]; then
        # Test 5.1: Get project tasks
        echo -n "Test 5.1: Get project tasks... "
        response=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" \
            "http://localhost:8000/api/v1/projects/$PROJECT_ID/tasks")
        if [[ $response == "["* ]]; then
            print_result 0 "Successfully retrieved tasks"
        else
            print_result 1 "Failed to get tasks"
        fi

        # Get a task ID
        TASK_ID=$(sqlite3 backend/test.db "SELECT id FROM tasks WHERE status='To Do' LIMIT 1;" 2>/dev/null)
        
        if [ -n "$TASK_ID" ]; then
            # Test 5.2: Complete a task
            echo -n "Test 5.2: Complete a task... "
            response=$(curl -s -X POST \
                "http://localhost:8000/api/v1/projects/tasks/$TASK_ID/complete" \
                -H "Authorization: Bearer $JWT_TOKEN" \
                -H "Content-Type: application/json")
            if [[ $response == *"message"* ]] || [[ $response == *"task"* ]]; then
                print_result 0 "Task completed successfully"
            else
                print_result 1 "Task completion failed"
            fi

            # Give database time to commit the transaction
            sleep 0.5

            # Test 5.3: Verify task status changed
            echo -n "Test 5.3: Verify task status... "
            # Remove hyphens from UUID for database query
            TASK_ID_NO_HYPHENS=$(echo $TASK_ID | tr -d '-')
            status=$(sqlite3 backend/test.db "SELECT status FROM tasks WHERE id='$TASK_ID_NO_HYPHENS';" 2>/dev/null)
            if [ "$status" = "Done" ]; then
                print_result 0 "Task status updated to Done"
            else
                print_result 1 "Task status not updated"
            fi
        else
            echo -e "${YELLOW}⚠ No tasks available for testing${NC}"
            ((FAILED+=2))
        fi
    else
        echo -e "${YELLOW}⚠ No projects available for testing${NC}"
        ((FAILED+=3))
    fi
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Test Summary                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Total Tests: ${BLUE}$TOTAL${NC}"
echo -e "Passed:      ${GREEN}$PASSED${NC}"
echo -e "Failed:      ${RED}$FAILED${NC}"
echo -e "Success Rate: ${BLUE}$PERCENTAGE%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 ALL TESTS PASSED! Backend is working perfectly! 🎉   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠ Most tests passed, but some issues need attention     ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ Multiple tests failed. Please review the errors above ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
