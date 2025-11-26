# Backend Logical Issues - Atlas AI Scrum Master

## 🔍 Overview
This document outlines logical/architectural issues in the backend that don't cause functional failures but represent design flaws, security concerns, or maintainability problems.

---

## 🚨 Critical Issues

### 1. Database Session Management Anti-Pattern
**Severity**: High  
**Files**: All service files (`risk_service.py`, `notification_service.py`, `task_service.py`, `issue_service.py`)

**Issue**:
Every service method creates its own database session using `async with SessionLocal()`. This creates multiple problems:

```python
# Current anti-pattern
async def create_notification(self, user_id: int, ...):
    async with SessionLocal() as session:  # ❌ New session every time
        async with session.begin():
            # ... operations
```

**Problems**:
1. **No transaction boundaries across operations** - If a task completion triggers a notification, they're in separate transactions. If notification fails, task is still marked complete.
2. **Connection pool exhaustion** - Each method call opens a new connection
3. **Cannot rollback related operations** - No way to ensure atomicity across service calls
4. **Testing difficulty** - Cannot inject mock sessions for unit testing
5. **Race conditions** - Multiple concurrent requests can create inconsistent state

**Recommended Solution**:
- Use dependency injection for database sessions
- Pass session as parameter to service methods
- Let API endpoints manage transaction boundaries
- Implement Unit of Work pattern

```python
# Better approach
async def create_notification(
    self, 
    session: AsyncSession,  # ✅ Injected session
    user_id: int, 
    ...
):
    notification = Notification(...)
    session.add(notification)
    # Caller controls commit
```

**Impact**: Medium-High (can cause data inconsistency under load)

---

### 2. Missing Transaction Rollback on Errors
**Severity**: High  
**Files**: `task_service.py`, `issue_service.py`, `notification_service.py`

**Issue**:
When operations fail, there's no explicit rollback, leading to partial updates:

```python
# In task_service.py - complete_task()
task.status = "Done"  # ✅ Committed

# Find next task
next_task = ...
if next_task:
    next_task.assignee_id = user_id_int
    next_task.status = "In Progress"  # ✅ Committed

# Create notification
await notification_service.create_notification(...)  # ❌ If this fails, task is still done
```

**Problems**:
- Task marked complete but notification never sent
- Next task assigned but user never notified
- No way to recover from partial failures
- Database left in inconsistent state

**Recommended Solution**:
```python
async with session.begin():
    try:
        # All operations
        task.status = "Done"
        next_task.status = "In Progress"
        notification = Notification(...)
        session.add(notification)
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise
```

**Impact**: High (data corruption risk)

---

### 3. Race Condition in Task Assignment
**Severity**: High  
**Files**: `task_service.py` - `complete_task()`

**Issue**:
Multiple users completing tasks simultaneously can get assigned the same "next task":

```python
# User A completes task 1
next_task_result = await session.execute(
    select(Task).where(
        Task.status == "To Do",
        Task.assignee_id.is_(None)  # ❌ Not locked
    )
)
# User B completes task 2 at same time - gets SAME next task!
next_task = next_task_result.scalars().first()
next_task.assignee_id = user_id_int  # Both users assigned same task
```

**Problems**:
- Two users can be assigned the same task
- Creates confusion and duplicate work
- No pessimistic locking

**Recommended Solution**:
```python
# Use SELECT FOR UPDATE to lock the row
next_task_result = await session.execute(
    select(Task)
    .where(Task.status == "To Do", Task.assignee_id.is_(None))
    .with_for_update(skip_locked=True)  # ✅ Lock row, skip if locked
    .order_by(Task.order)
    .limit(1)
)
```

**Impact**: High (duplicate work, user confusion)

---

### 4. Notification Spam - No Deduplication
**Severity**: Medium  
**Files**: `notification_service.py`, `risk_service.py`

**Issue**:
Risk detection runs periodically and can send duplicate notifications:

```python
# In risk_service.py
if new_risk == 'high' and old_risk != 'high':
    await notification_service.create_notification(...)  # ❌ No check for existing notification
```

**Problems**:
- User gets same "Task at risk" notification every time risk detection runs
- No deduplication logic
- Notification fatigue
- No rate limiting

**Recommended Solution**:
```python
# Check for recent similar notifications
recent_notif = await session.execute(
    select(Notification).where(
        Notification.user_id == user_id,
        Notification.type == 'task_at_risk',
        Notification.message.contains(task.title),
        Notification.created_at > datetime.utcnow() - timedelta(hours=24)
    )
)
if not recent_notif.scalars().first():
    # Create notification
```

**Impact**: Medium (poor UX, notification spam)

---

### 5. Hardcoded JWT Secret in Code
**Severity**: Critical (Security)  
**Files**: `security.py`, `auth_service.py`

**Issue**:
JWT secret key is loaded from `.env` but there's no validation or fallback:

```python
# In security.py
config = Config(".env")
payload = jwt.decode(credentials.credentials, config('JWT_SECRET_KEY'), ...)
```

**Problems**:
- If `.env` is missing, app crashes with unclear error
- No validation that secret is strong enough
- Secret might be committed to git
- No key rotation mechanism

**Recommended Solution**:
```python
JWT_SECRET_KEY = config('JWT_SECRET_KEY', default=None)
if not JWT_SECRET_KEY or len(JWT_SECRET_KEY) < 32:
    raise ValueError("JWT_SECRET_KEY must be set and at least 32 characters")

# Add key rotation support
JWT_SECRET_KEY_OLD = config('JWT_SECRET_KEY_OLD', default=None)
```

**Impact**: Critical (security vulnerability)

---

### 6. No Pagination on List Endpoints
**Severity**: Medium  
**Files**: `notification_service.py`, `issue_service.py`, `projects.py`

**Issue**:
All list endpoints return unlimited results:

```python
# In notification_service.py
query = query.order_by(desc(Notification.created_at)).limit(50)  # ❌ Hardcoded limit
```

**Problems**:
- Memory exhaustion with large datasets
- Slow response times
- No way for client to request more/less
- Hardcoded limit of 50 is arbitrary

**Recommended Solution**:
```python
async def get_user_notifications(
    self,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    max_limit: int = 100
):
    limit = min(limit, max_limit)  # Enforce max
    query = query.offset(skip).limit(limit)
    
    # Return pagination metadata
    return {
        'items': notifications,
        'total': total_count,
        'skip': skip,
        'limit': limit
    }
```

**Impact**: Medium (performance degradation at scale)

---

### 7. Silent Exception Handling
**Severity**: Medium  
**Files**: `websocket_manager.py`, `task_service.py`

**Issue**:
Exceptions are caught but not logged or handled:

```python
# In websocket_manager.py
try:
    await connection.send_json(message)
except:
    pass  # ❌ Silent failure - no logging, no retry
```

**Problems**:
- Failures go unnoticed
- No debugging information
- Cannot diagnose production issues
- Masks real problems

**Recommended Solution**:
```python
import logging
logger = logging.getLogger(__name__)

try:
    await connection.send_json(message)
except Exception as e:
    logger.error(f"Failed to send message to user {user_id}: {e}")
    # Optionally: mark connection as stale, retry, etc.
```

**Impact**: Medium (debugging difficulty)

---

### 8. Inconsistent Error Handling
**Severity**: Medium  
**Files**: All service files

**Issue**:
Some methods raise exceptions, others return None or False:

```python
# task_service.py
if not task:
    raise ValueError(f"Task not found")  # ✅ Raises

# notification_service.py  
if notification:
    # ... update
    return True
return False  # ❌ Returns boolean
```

**Problems**:
- API endpoints must handle different error patterns
- Inconsistent error responses to clients
- Some errors are silent (False return)
- No standard error format

**Recommended Solution**:
```python
# Create custom exceptions
class TaskNotFoundError(Exception):
    pass

class NotificationNotFoundError(Exception):
    pass

# Use consistently
if not task:
    raise TaskNotFoundError(f"Task {task_id} not found")
```

**Impact**: Medium (maintainability, API consistency)

---

### 9. No Input Validation in Services
**Severity**: Medium  
**Files**: All service files

**Issue**:
Services trust all input without validation:

```python
# In notification_service.py
async def create_notification(
    self,
    user_id: int,  # ❌ No validation
    notification_type: str,  # ❌ No enum validation
    title: str,  # ❌ No length check
    message: str,  # ❌ No length check
    ...
):
```

**Problems**:
- Can create notifications with empty titles
- Invalid notification types accepted
- Extremely long messages can break UI
- No sanitization of user input

**Recommended Solution**:
```python
from enum import Enum

class NotificationType(str, Enum):
    TASK_ASSIGNED = "task_assigned"
    TASK_AT_RISK = "task_at_risk"
    NEW_ISSUE = "new_issue"

async def create_notification(
    self,
    user_id: int,
    notification_type: NotificationType,  # ✅ Enum
    title: str,
    message: str,
    ...
):
    if not title or len(title) > 200:
        raise ValueError("Title must be 1-200 characters")
    if not message or len(message) > 1000:
        raise ValueError("Message must be 1-1000 characters")
```

**Impact**: Medium (data quality, security)

---

### 10. WebSocket Connection Leak
**Severity**: Medium  
**Files**: `websocket_manager.py`

**Issue**:
Disconnected websockets are not properly cleaned up:

```python
def disconnect(self, websocket: WebSocket, user_id: int):
    if user_id in self.active_connections:
        if websocket in self.active_connections[user_id]:
            self.active_connections[user_id].remove(websocket)
        
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]
    # ❌ But presence is not updated!
    # ❌ Channel memberships not cleaned up!
```

**Problems**:
- User shows as "online" after disconnect
- Memory leak from channel_members dict
- Stale connections accumulate
- No heartbeat/ping mechanism

**Recommended Solution**:
```python
async def disconnect(self, websocket: WebSocket, user_id: int):
    # Remove connection
    if user_id in self.active_connections:
        self.active_connections[user_id].remove(websocket)
        
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]
            
            # ✅ Update presence
            await self.update_presence(user_id, 'offline')
            
            # ✅ Broadcast offline status
            await self.broadcast_presence_update(user_id, 'offline')
            
            # ✅ Clean up channel memberships
            for channel_id in list(self.channel_members.keys()):
                self.channel_members[channel_id].discard(user_id)
```

**Impact**: Medium (memory leak, incorrect presence)

---

## 📊 Summary

| Severity | Count | Issues |
|----------|-------|--------|
| Critical | 1 | JWT secret handling |
| High | 4 | Session management, transaction rollback, race conditions, notification spam |
| Medium | 5 | Pagination, error handling, validation, websocket cleanup |

**Total Issues**: 10

---

## 🎯 Recommended Priority

1. **Immediate** (Critical/High):
   - Fix JWT secret validation (#5)
   - Implement proper session management (#1)
   - Add transaction rollback (#2)
   - Fix race condition in task assignment (#3)

2. **Short-term** (High/Medium):
   - Add notification deduplication (#4)
   - Implement pagination (#6)
   - Fix error handling consistency (#7, #8)

3. **Medium-term** (Medium):
   - Add input validation (#9)
   - Fix WebSocket cleanup (#10)

---

## 📝 Testing Recommendations

To verify these issues:

1. **Race Condition Test**: Have 2 users complete tasks simultaneously
2. **Transaction Test**: Inject failure in notification service after task completion
3. **Load Test**: Create 10,000 notifications and try to list them
4. **WebSocket Test**: Connect/disconnect rapidly, check memory usage
5. **Security Test**: Try to use expired/invalid JWT tokens

---

## 🔗 Related Files

- `backend/app/services/risk_service.py`
- `backend/app/services/notification_service.py`
- `backend/app/services/task_service.py`
- `backend/app/services/issue_service.py`
- `backend/app/services/websocket_manager.py`
- `backend/app/core/security.py`
- `backend/app/api/v1/auth.py`

---

**Created**: November 24, 2025  
**Status**: Open for review  
**Labels**: `backend`, `architecture`, `technical-debt`, `security`
