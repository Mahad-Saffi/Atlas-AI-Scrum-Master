#!/usr/bin/env python3
"""
Atlas AI Scrum Master MCP Server v2
Complete implementation with organization support and error handling
"""

import os
import json
import asyncio
import httpx
from typing import Any

try:
    from mcp.server import Server
    from mcp.types import Tool, TextContent
    from mcp.server.stdio import stdio_server
except ImportError:
    print("❌ Please install MCP: pip install mcp httpx")
    exit(1)

# Configuration
ATLAS_API_URL = os.getenv("ATLAS_API_URL", "http://localhost:8000")
ATLAS_TOKEN = os.getenv("ATLAS_TOKEN", "")

# Initialize server
app = Server("atlas-scrum-master")

# HTTP client with error handling
client = httpx.AsyncClient(
    base_url=ATLAS_API_URL,
    headers={"Authorization": f"Bearer {ATLAS_TOKEN}"},
    timeout=30.0
)


# ============================================================================
# ERROR HANDLING UTILITIES
# ============================================================================

def format_error(error: Exception, context: str = "") -> str:
    """Format error messages in a user-friendly way"""
    if isinstance(error, httpx.HTTPStatusError):
        status = error.response.status_code
        if status == 401:
            return "🔒 Authentication failed. Your token may have expired. Please get a new token."
        elif status == 403:
            return "⛔ Permission denied. You don't have access to perform this action."
        elif status == 404:
            return f"❓ Not found. {context}"
        elif status == 400:
            try:
                detail = error.response.json().get('detail', 'Bad request')
                return f"⚠️ {detail}"
            except:
                return "⚠️ Invalid request. Please check your input."
        elif status == 500:
            return "💥 Server error. The Atlas backend encountered an issue. Please try again."
        else:
            return f"❌ Error {status}: {context}"
    elif isinstance(error, httpx.ConnectError):
        return "🔌 Cannot connect to Atlas backend. Make sure it's running on port 8000."
    elif isinstance(error, httpx.TimeoutException):
        return "⏱️ Request timed out. The server is taking too long to respond."
    else:
        return f"❌ Unexpected error: {str(error)}"


async def safe_api_call(func, error_context: str = ""):
    """Wrapper for API calls with error handling"""
    try:
        return await func()
    except Exception as e:
        error_msg = format_error(e, error_context)
        return [TextContent(type="text", text=error_msg)]


# ============================================================================
# TOOL DEFINITIONS
# ============================================================================

@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available Atlas tools."""
    return [
        # ===== ORGANIZATION MANAGEMENT =====
        Tool(
            name="get_my_organization",
            description="Get information about your organization/team",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="list_team_members",
            description="List all members in your organization/team",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="add_team_member",
            description="Add a new team member to your organization (owner only)",
            inputSchema={
                "type": "object",
                "properties": {
                    "email": {"type": "string", "description": "Email address"},
                    "password": {"type": "string", "description": "Temporary password"},
                    "username": {"type": "string", "description": "Username"},
                    "role": {"type": "string", "description": "Role (developer, designer, qa, manager, etc.)"},
                    "description": {"type": "string", "description": "What they do in the team"},
                },
                "required": ["email", "password", "username", "role"],
            },
        ),
        
        # ===== PROJECT MANAGEMENT =====
        Tool(
            name="list_projects",
            description="List all projects in your organization",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="create_project",
            description="Create a new project instantly by describing what you want to build",
            inputSchema={
                "type": "object",
                "properties": {
                    "description": {"type": "string", "description": "Project description"},
                },
                "required": ["description"],
            },
        ),
        Tool(
            name="get_project_details",
            description="Get detailed information about a specific project",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID (UUID)"},
                },
                "required": ["project_id"],
            },
        ),
        
        # ===== TASK MANAGEMENT =====
        Tool(
            name="list_tasks",
            description="List tasks for a project. Can filter by status",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID (UUID)"},
                    "status": {"type": "string", "enum": ["todo", "in_progress", "done"], "description": "Filter by status (optional)"},
                },
                "required": ["project_id"],
            },
        ),
        Tool(
            name="complete_task",
            description="Mark a task as completed",
            inputSchema={
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "Task ID (UUID)"},
                },
                "required": ["task_id"],
            },
        ),
        Tool(
            name="update_task",
            description="Update task status or assignee",
            inputSchema={
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "Task ID (UUID)"},
                    "status": {"type": "string", "enum": ["todo", "in_progress", "done"]},
                    "assigned_to": {"type": "integer", "description": "User ID to assign"},
                },
                "required": ["task_id"],
            },
        ),
        Tool(
            name="bulk_assign_tasks",
            description="Assign multiple tasks to a user at once (efficient for assigning many tasks)",
            inputSchema={
                "type": "object",
                "properties": {
                    "task_ids": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Array of task IDs (UUIDs) to assign"
                    },
                    "assigned_to": {"type": "integer", "description": "User ID to assign all tasks to"},
                },
                "required": ["task_ids", "assigned_to"],
            },
        ),
        
        # ===== RISK MANAGEMENT =====
        Tool(
            name="get_project_risks",
            description="Get risk summary for a project (high/medium/low risk tasks)",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID (UUID)"},
                },
                "required": ["project_id"],
            },
        ),
        
        # ===== ISSUE TRACKING =====
        Tool(
            name="report_issue",
            description="Report a new issue (blocker, bug, or question)",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID (UUID)"},
                    "title": {"type": "string", "description": "Issue title"},
                    "description": {"type": "string", "description": "Issue description"},
                    "issue_type": {"type": "string", "enum": ["blocker", "bug", "question"]},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
                },
                "required": ["project_id", "title", "description", "issue_type", "priority"],
            },
        ),
        Tool(
            name="list_issues",
            description="List all issues for a project",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID (UUID)"},
                    "status": {"type": "string", "enum": ["open", "in_progress", "resolved"]},
                },
                "required": ["project_id"],
            },
        ),
        Tool(
            name="assign_issue",
            description="Assign an issue to a team member",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_id": {"type": "integer", "description": "Issue ID"},
                    "assigned_to": {"type": "integer", "description": "User ID"},
                },
                "required": ["issue_id", "assigned_to"],
            },
        ),
        Tool(
            name="resolve_issue",
            description="Mark an issue as resolved",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_id": {"type": "integer", "description": "Issue ID"},
                    "resolution": {"type": "string", "description": "How it was resolved"},
                },
                "required": ["issue_id", "resolution"],
            },
        ),
        
        # ===== NOTIFICATIONS =====
        Tool(
            name="get_notifications",
            description="Get recent notifications",
            inputSchema={
                "type": "object",
                "properties": {
                    "unread_only": {"type": "boolean", "description": "Only unread (default: false)"},
                },
            },
        ),
        Tool(
            name="mark_notification_read",
            description="Mark a notification as read",
            inputSchema={
                "type": "object",
                "properties": {
                    "notification_id": {"type": "integer", "description": "Notification ID"},
                },
                "required": ["notification_id"],
            },
        ),
        
        # ===== TEAM COLLABORATION =====
        Tool(
            name="get_online_users",
            description="Get list of currently online team members",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


# ============================================================================
# TOOL IMPLEMENTATIONS
# ============================================================================

@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Execute a tool and return results."""
    
    # ===== ORGANIZATION MANAGEMENT =====
    
    if name == "get_my_organization":
        async def get_org():
            response = await client.get("/api/v1/organizations/my-organization")
            response.raise_for_status()
            org = response.json()
            
            result = f"🏢 **Your Organization**\n\n"
            result += f"**Name:** {org['name']}\n"
            result += f"**Description:** {org.get('description', 'No description')}\n"
            result += f"**Role:** {'Owner' if org['is_owner'] else 'Member'}\n"
            result += f"**Created:** {org['created_at']}\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(get_org, "Could not fetch organization")
    
    elif name == "list_team_members":
        async def list_members():
            response = await client.get("/api/v1/organizations/members")
            response.raise_for_status()
            members = response.json()
            
            if not members:
                return [TextContent(type="text", text="No team members found.")]
            
            result = f"👥 **Team Members** ({len(members)}):\n\n"
            for member in members:
                result += f"• **{member['username']}** ({member['email']})\n"
                result += f"  Role: {member['role']}\n"
                result += f"  Description: {member.get('description', 'No description')}\n"
                result += f"  Invited by: {member['invited_by']}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(list_members, "Could not fetch team members")
    
    elif name == "add_team_member":
        async def add_member():
            data = {
                "email": arguments["email"],
                "password": arguments["password"],
                "username": arguments["username"],
                "role": arguments["role"],
                "description": arguments.get("description", "")
            }
            response = await client.post("/api/v1/organizations/add-member", json=data)
            response.raise_for_status()
            result = response.json()
            
            msg = f"✅ **Team member added successfully!**\n\n"
            msg += f"**Username:** {result['user']['username']}\n"
            msg += f"**Email:** {result['user']['email']}\n"
            msg += f"**Role:** {result['user']['role']}\n\n"
            msg += f"They can now login with:\n"
            msg += f"Email: {arguments['email']}\n"
            msg += f"Password: {arguments['password']}\n"
            
            return [TextContent(type="text", text=msg)]
        
        return await safe_api_call(add_member, "Could not add team member")
    
    # ===== PROJECT MANAGEMENT =====
    
    elif name == "list_projects":
        async def list_projs():
            response = await client.get("/api/v1/projects")
            response.raise_for_status()
            projects = response.json()
            
            if not projects:
                return [TextContent(type="text", text="📋 No projects found.\n\nCreate your first project with the 'create_project' tool!")]
            
            result = f"📋 **Projects** ({len(projects)}):\n\n"
            for p in projects:
                result += f"• **{p['name']}**\n"
                result += f"  ID: `{p['id']}`\n"
                result += f"  Description: {p.get('description', 'No description')}\n"
                result += f"  Created: {p.get('created_at', 'Unknown')}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(list_projs, "Could not fetch projects")
    
    elif name == "create_project":
        async def create_proj():
            description = arguments["description"]
            response = await client.post(
                "/api/v1/ai/discover",
                json={"message": description}
            )
            response.raise_for_status()
            result = response.json()
            
            return [TextContent(type="text", text=result["text"])]
        
        return await safe_api_call(create_proj, "Could not create project")
    
    elif name == "get_project_details":
        async def get_details():
            project_id = arguments["project_id"]
            
            # Get project info
            proj_response = await client.get(f"/api/v1/projects/{project_id}")
            proj_response.raise_for_status()
            project = proj_response.json()
            
            # Get tasks
            tasks_response = await client.get(f"/api/v1/projects/{project_id}/tasks")
            tasks_response.raise_for_status()
            tasks = tasks_response.json()
            
            todo = sum(1 for t in tasks if t['status'] == 'todo')
            in_progress = sum(1 for t in tasks if t['status'] == 'in_progress')
            done = sum(1 for t in tasks if t['status'] == 'done')
            
            result = f"📊 **Project: {project['name']}**\n\n"
            result += f"**Description:** {project.get('description', 'N/A')}\n\n"
            result += f"**Task Statistics:**\n"
            result += f"• To Do: {todo}\n"
            result += f"• In Progress: {in_progress}\n"
            result += f"• Done: {done}\n"
            result += f"• Total: {len(tasks)}\n"
            result += f"• Completion: {int(done/len(tasks)*100) if tasks else 0}%\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(get_details, "Could not fetch project details")
    
    # ===== TASK MANAGEMENT =====
    
    elif name == "list_tasks":
        async def list_task():
            project_id = arguments["project_id"]
            status = arguments.get("status")
            
            response = await client.get(f"/api/v1/projects/{project_id}/tasks")
            response.raise_for_status()
            tasks = response.json()
            
            if status:
                tasks = [t for t in tasks if t['status'] == status]
            
            if not tasks:
                return [TextContent(type="text", text=f"📝 No tasks found{' with status ' + status if status else ''}.")]
            
            result = f"📝 **Tasks** ({len(tasks)}):\n\n"
            for t in tasks:
                risk = "🔴" if t.get('risk_level') == 'high' else "🟡" if t.get('risk_level') == 'medium' else "🟢"
                result += f"{risk} **{t['title']}**\n"
                result += f"   ID: `{t['id']}`\n"
                result += f"   Status: {t['status']}\n"
                if t.get('risk_level'):
                    result += f"   Risk: {t['risk_level']}\n"
                if t.get('assignee_id'):
                    result += f"   Assigned to: User {t['assignee_id']}\n"
                result += "\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(list_task, "Could not fetch tasks")
    
    elif name == "complete_task":
        async def complete():
            task_id = arguments["task_id"]
            response = await client.post(f"/api/v1/projects/tasks/{task_id}/complete")
            response.raise_for_status()
            result = response.json()
            
            message = f"✅ **Task completed!**\n\n"
            if result.get("next_task"):
                message += f"📌 **Next task assigned:**\n"
                message += f"• {result['next_task']['title']}\n"
                message += f"  ID: `{result['next_task']['id']}`\n"
            
            return [TextContent(type="text", text=message)]
        
        return await safe_api_call(complete, "Could not complete task")
    
    elif name == "update_task":
        async def update():
            task_id = arguments["task_id"]
            update_data = {k: v for k, v in arguments.items() if k != "task_id" and v is not None}
            
            response = await client.patch(f"/api/v1/projects/tasks/{task_id}", json=update_data)
            response.raise_for_status()
            
            return [TextContent(type="text", text=f"✅ Task updated successfully!")]
        
        return await safe_api_call(update, "Could not update task")
    
    elif name == "bulk_assign_tasks":
        async def bulk_assign():
            task_ids = arguments["task_ids"]
            assigned_to = arguments["assigned_to"]
            
            response = await client.post(
                "/api/v1/projects/tasks/bulk-assign",
                json={"task_ids": task_ids, "assigned_to": assigned_to}
            )
            response.raise_for_status()
            result = response.json()
            
            message = f"✅ **Bulk Assignment Complete!**\n\n"
            message += f"• Successfully assigned: {result['success_count']} tasks\n"
            if result['failed_count'] > 0:
                message += f"• Failed: {result['failed_count']} tasks\n"
                for failed in result['failed_tasks'][:5]:  # Show first 5 failures
                    message += f"  - {failed['task_id']}: {failed['reason']}\n"
            
            return [TextContent(type="text", text=message)]
        
        return await safe_api_call(bulk_assign, "Could not bulk assign tasks")
    
    # ===== RISK MANAGEMENT =====
    
    elif name == "get_project_risks":
        async def get_risks():
            project_id = arguments["project_id"]
            response = await client.get(f"/api/v1/projects/{project_id}/risks")
            response.raise_for_status()
            risks = response.json()
            
            result = "⚠️ **Risk Summary:**\n\n"
            result += f"🔴 High Risk: {risks.get('high', 0)} tasks\n"
            result += f"🟡 Medium Risk: {risks.get('medium', 0)} tasks\n"
            result += f"🟢 Low Risk: {risks.get('low', 0)} tasks\n"
            
            total = risks.get('high', 0) + risks.get('medium', 0) + risks.get('low', 0)
            if total > 0:
                high_pct = int(risks.get('high', 0) / total * 100)
                if high_pct > 30:
                    result += f"\n⚠️ **Warning:** {high_pct}% of tasks are high risk!"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(get_risks, "Could not fetch risk summary")
    
    # ===== ISSUE TRACKING =====
    
    elif name == "report_issue":
        async def report():
            response = await client.post("/api/v1/issues", json=arguments)
            response.raise_for_status()
            issue = response.json()
            
            return [TextContent(type="text", text=f"🚨 **Issue reported!**\n\nIssue ID: {issue['id']}\nNotifications sent to relevant team members.")]
        
        return await safe_api_call(report, "Could not report issue")
    
    elif name == "list_issues":
        async def list_issue():
            project_id = arguments["project_id"]
            status = arguments.get("status")
            
            url = f"/api/v1/issues/project/{project_id}"
            if status:
                url += f"?status={status}"
            
            response = await client.get(url)
            response.raise_for_status()
            issues = response.json()
            
            if not issues:
                return [TextContent(type="text", text="🚨 No issues found.")]
            
            result = f"🚨 **Issues** ({len(issues)}):\n\n"
            for issue in issues:
                priority_emoji = "🔥" if issue['priority'] == 'critical' else "⚠️" if issue['priority'] == 'high' else "📌"
                result += f"{priority_emoji} **{issue['title']}** (ID: {issue['id']})\n"
                result += f"   Type: {issue['issue_type']} | Priority: {issue['priority']}\n"
                result += f"   Status: {issue['status']}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(list_issue, "Could not fetch issues")
    
    elif name == "assign_issue":
        async def assign():
            issue_id = arguments["issue_id"]
            assigned_to = arguments["assigned_to"]
            
            response = await client.post(f"/api/v1/issues/{issue_id}/assign", json={"assigned_to": assigned_to})
            response.raise_for_status()
            
            return [TextContent(type="text", text=f"✅ Issue assigned successfully!")]
        
        return await safe_api_call(assign, "Could not assign issue")
    
    elif name == "resolve_issue":
        async def resolve():
            issue_id = arguments["issue_id"]
            resolution = arguments["resolution"]
            
            response = await client.post(f"/api/v1/issues/{issue_id}/resolve", json={"resolution": resolution})
            response.raise_for_status()
            
            return [TextContent(type="text", text=f"✅ Issue resolved!")]
        
        return await safe_api_call(resolve, "Could not resolve issue")
    
    # ===== NOTIFICATIONS =====
    
    elif name == "get_notifications":
        async def get_notifs():
            unread_only = arguments.get("unread_only", False)
            response = await client.get("/api/v1/notifications")
            response.raise_for_status()
            notifications = response.json()
            
            if unread_only:
                notifications = [n for n in notifications if not n.get('is_read')]
            
            if not notifications:
                return [TextContent(type="text", text="🔔 No notifications.")]
            
            result = f"🔔 **Notifications** ({len(notifications)}):\n\n"
            for notif in notifications[:10]:
                status = "📭" if notif.get('is_read') else "📬"
                result += f"{status} {notif['message']}\n"
                result += f"   Type: {notif['type']} | ID: {notif['id']}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(get_notifs, "Could not fetch notifications")
    
    elif name == "mark_notification_read":
        async def mark_read():
            notif_id = arguments["notification_id"]
            response = await client.post(f"/api/v1/notifications/{notif_id}/read")
            response.raise_for_status()
            
            return [TextContent(type="text", text=f"✅ Notification marked as read.")]
        
        return await safe_api_call(mark_read, "Could not mark notification as read")
    
    # ===== TEAM COLLABORATION =====
    
    elif name == "get_online_users":
        async def get_online():
            response = await client.get("/api/v1/chat/online-users")
            response.raise_for_status()
            users = response.json()
            
            if not users:
                return [TextContent(type="text", text="👥 No users currently online.")]
            
            result = "👥 **Online Users:**\n\n"
            for user in users:
                result += f"🟢 {user['username']}\n"
            
            return [TextContent(type="text", text=result)]
        
        return await safe_api_call(get_online, "Could not fetch online users")
    
    else:
        return [TextContent(type="text", text=f"❓ Unknown tool: {name}")]


# ============================================================================
# MAIN
# ============================================================================

async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
