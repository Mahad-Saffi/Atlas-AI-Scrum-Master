#!/usr/bin/env python3
"""
Atlas AI Scrum Master MCP Server
Quick setup for Claude Desktop
"""

import os
import json
import asyncio
import httpx
from typing import Any

# You need to install: pip install mcp httpx
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

# HTTP client
client = httpx.AsyncClient(
    base_url=ATLAS_API_URL,
    headers={"Authorization": f"Bearer {ATLAS_TOKEN}"},
    timeout=30.0
)


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return [
        Tool(
            name="list_projects",
            description="List all projects in Atlas",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="list_tasks",
            description="List tasks for a project. Can filter by status (todo, in_progress, done).",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "integer", "description": "Project ID"},
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
                    "task_id": {"type": "integer", "description": "Task ID to complete"},
                },
                "required": ["task_id"],
            },
        ),
        Tool(
            name="get_project_risks",
            description="Get risk summary for a project (high/medium/low risk tasks)",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "integer", "description": "Project ID"},
                },
                "required": ["project_id"],
            },
        ),
        Tool(
            name="report_issue",
            description="Report a new issue (blocker, bug, or question)",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "integer", "description": "Project ID"},
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
                    "project_id": {"type": "integer", "description": "Project ID"},
                },
                "required": ["project_id"],
            },
        ),
        Tool(
            name="get_notifications",
            description="Get recent notifications",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="get_online_users",
            description="Get list of currently online team members",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="create_project",
            description="Create a new project instantly by describing what you want to build. The AI will generate a complete project plan with epics, stories, and tasks.",
            inputSchema={
                "type": "object",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "Description of the project you want to create (e.g., 'Build a todo app with user authentication')",
                    },
                },
                "required": ["description"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Execute a tool."""
    try:
        if name == "list_projects":
            response = await client.get("/api/v1/projects")
            response.raise_for_status()
            projects = response.json()
            
            if not projects:
                return [TextContent(type="text", text="No projects found.")]
            
            result = "📋 **Projects:**\n\n"
            for p in projects:
                result += f"• **{p['name']}** (ID: {p['id']})\n"
                result += f"  {p.get('description', 'No description')}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "list_tasks":
            project_id = arguments["project_id"]
            status = arguments.get("status")
            
            response = await client.get(f"/api/v1/projects/{project_id}/tasks")
            response.raise_for_status()
            tasks = response.json()
            
            if status:
                tasks = [t for t in tasks if t['status'] == status]
            
            if not tasks:
                return [TextContent(type="text", text="No tasks found.")]
            
            result = f"📝 **Tasks** ({len(tasks)}):\n\n"
            for t in tasks:
                risk = "🔴" if t.get('risk_level') == 'high' else "🟡" if t.get('risk_level') == 'medium' else "🟢"
                result += f"{risk} **{t['title']}** (ID: {t['id']})\n"
                result += f"   Status: {t['status']}\n"
                if t.get('risk_level'):
                    result += f"   Risk: {t['risk_level']}\n"
                result += "\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "complete_task":
            task_id = arguments["task_id"]
            response = await client.post(f"/api/v1/projects/tasks/{task_id}/complete")
            response.raise_for_status()
            result = response.json()
            
            message = f"✅ Task {task_id} completed!"
            if result.get("next_task"):
                message += f"\n\n📌 Next task: {result['next_task']['title']}"
            
            return [TextContent(type="text", text=message)]
        
        elif name == "get_project_risks":
            project_id = arguments["project_id"]
            response = await client.get(f"/api/v1/projects/{project_id}/risks")
            response.raise_for_status()
            risks = response.json()
            
            result = "⚠️ **Risk Summary:**\n\n"
            result += f"🔴 High Risk: {risks.get('high', 0)} tasks\n"
            result += f"🟡 Medium Risk: {risks.get('medium', 0)} tasks\n"
            result += f"🟢 Low Risk: {risks.get('low', 0)} tasks\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "report_issue":
            response = await client.post("/api/v1/issues", json=arguments)
            response.raise_for_status()
            issue = response.json()
            
            return [TextContent(type="text", text=f"🚨 Issue reported! ID: {issue['id']}")]
        
        elif name == "list_issues":
            project_id = arguments["project_id"]
            response = await client.get(f"/api/v1/issues/project/{project_id}")
            response.raise_for_status()
            issues = response.json()
            
            if not issues:
                return [TextContent(type="text", text="No issues found.")]
            
            result = f"🚨 **Issues** ({len(issues)}):\n\n"
            for issue in issues:
                priority = "🔥" if issue['priority'] == 'critical' else "⚠️" if issue['priority'] == 'high' else "📌"
                result += f"{priority} **{issue['title']}** (ID: {issue['id']})\n"
                result += f"   Type: {issue['issue_type']} | Priority: {issue['priority']}\n"
                result += f"   Status: {issue['status']}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "get_notifications":
            response = await client.get("/api/v1/notifications")
            response.raise_for_status()
            notifications = response.json()
            
            if not notifications:
                return [TextContent(type="text", text="No notifications.")]
            
            result = f"🔔 **Notifications** ({len(notifications)}):\n\n"
            for notif in notifications[:10]:
                status = "📭" if notif.get('is_read') else "📬"
                result += f"{status} {notif['message']}\n\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "get_online_users":
            response = await client.get("/api/v1/chat/online-users")
            response.raise_for_status()
            users = response.json()
            
            if not users:
                return [TextContent(type="text", text="No users online.")]
            
            result = "👥 **Online Users:**\n\n"
            for user in users:
                result += f"🟢 {user['username']}\n"
            
            return [TextContent(type="text", text=result)]
        
        elif name == "create_project":
            description = arguments["description"]
            response = await client.post(
                "/api/v1/ai/discover",
                json={"message": description}
            )
            response.raise_for_status()
            result = response.json()
            
            return [TextContent(type="text", text=result["text"])]
        
        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]
    
    except httpx.HTTPStatusError as e:
        return [TextContent(type="text", text=f"API Error: {e.response.status_code}")]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


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
