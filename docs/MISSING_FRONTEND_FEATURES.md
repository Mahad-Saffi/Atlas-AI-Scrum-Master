# Missing Frontend Features

This document lists backend API endpoints that are not yet implemented in the frontend.

## 1. Chat Features (Partially Implemented)

### ✅ Implemented:

- WebSocket connection for real-time chat
- Online users display
- Basic message sending

### ❌ Missing:

- **Channels Management**
  - `GET /api/v1/chat/channels` - List all channels
  - `POST /api/v1/chat/channels` - Create new channel
  - `POST /api/v1/chat/channels/{channel_id}/join` - Join channel
  - `GET /api/v1/chat/channels/{channel_id}/messages` - Get channel messages
- **Direct Messages**
  - `GET /api/v1/chat/direct-messages/{user_id}` - Get DMs with specific user
  - `GET /api/v1/chat/conversations` - List all DM conversations
- **Message Search**
  - `GET /api/v1/chat/search` - Search messages across channels and DMs
- **Typing Indicators**
  - WebSocket typing events not implemented in UI

## 2. Task Management (Partially Implemented)

### ✅ Implemented:

- Get project tasks
- Complete task

### ❌ Missing:

- **Task Updates**
  - `PATCH /api/v1/projects/tasks/{task_id}` - Update task details (estimate, progress, due date, status, assigned_to)
- **Bulk Operations**
  - `POST /api/v1/projects/tasks/bulk-assign` - Assign multiple tasks at once

## 3. Risk Management (Not Implemented)

### ❌ Missing:

- **Project Risks**
  - `GET /api/v1/projects/{project_id}/risks` - Get risk summary for project
  - `POST /api/v1/projects/detect-delays` - Manually trigger delay detection
- **Risk Dashboard** - No UI component exists

## 4. Issues/Blockers (Partially Implemented)

### ✅ Implemented:

- Create issue
- Get project issues

### ❌ Missing:

- **Issue Management**
  - `POST /api/v1/issues/{issue_id}/assign` - Assign issue to user (triage)
  - `POST /api/v1/issues/{issue_id}/resolve` - Resolve issue
- **Issue Filtering**
  - Status filter parameter not used in frontend

## 5. Organization/Team Management (Partially Implemented)

### ✅ Implemented:

- Organization setup page exists
- Add team members

### ❌ Missing:

- **Organization Info**
  - `GET /api/v1/organizations/my-organization` - Get organization details
  - Display organization info in UI
- **Member Management**
  - `GET /api/v1/organizations/members` - List all team members
  - `DELETE /api/v1/organizations/remove-member/{user_id}` - Remove member
  - Team members list/management UI

## 6. Notifications (Implemented ✅)

All notification endpoints are implemented in the frontend.

## 7. Projects (Mostly Implemented ✅)

Basic project features are implemented.

## Priority Recommendations

### High Priority:

1. **Task Update UI** - Allow editing task estimates, progress, due dates
2. **Bulk Task Assignment** - UI for assigning multiple tasks
3. **Risk Dashboard** - Display project risks and delays
4. **Channel Management** - Create/join channels in chat
5. **Direct Messages** - DM functionality in chat

### Medium Priority:

6. **Issue Assignment/Resolution** - Complete issue workflow
7. **Team Members List** - Display and manage team members
8. **Message Search** - Search functionality in chat

### Low Priority:

9. **Typing Indicators** - Show when users are typing
10. **Organization Details Display** - Show org info in UI

## Implementation Notes

### Quick Wins:

- Task update form (PATCH endpoint already exists)
- Risk dashboard page (GET endpoint ready)
- Team members list (GET endpoint ready)

### Complex Features:

- Channel management (requires new UI components)
- Direct messages (requires chat UI refactor)
- Message search (requires search UI component)
