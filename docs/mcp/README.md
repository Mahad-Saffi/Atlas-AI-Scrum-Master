# MCP Integration Documentation

Model Context Protocol (MCP) integration for Atlas AI Scrum Master with Claude Desktop.

## 📚 Documentation

- **[MCP Quick Start](./MCP_QUICK_START.md)** - Get started in 5 minutes
- **[Setup Guide](./SETUP_MCP.md)** - Detailed configuration instructions
- **[Implementation Guide](./MCP_IMPLEMENTATION_GUIDE.md)** - Technical details
- **[Restart Claude](./RESTART_CLAUDE.md)** - Troubleshooting guide

## 🚀 Quick Setup

1. **Install MCP dependencies**
   ```bash
   pip install mcp httpx
   ```

2. **Get your JWT token**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/demo-login
   ```

3. **Configure Claude Desktop**
   Edit `C:\Users\[USER]\AppData\Roaming\Claude\claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "atlas": {
         "command": "python",
         "args": ["path/to/atlas_mcp_server_v2.py"],
         "env": {
           "ATLAS_API_URL": "http://localhost:8000",
           "ATLAS_TOKEN": "your_jwt_token_here"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

## 🛠️ Available Tools (18 total)

### Organization Management
- `get_my_organization` - View organization info
- `list_team_members` - List all team members
- `add_team_member` - Add new team member

### Project Management
- `list_projects` - List organization projects
- `create_project` - AI-powered project creation
- `get_project_details` - Project statistics

### Task Management
- `list_tasks` - List/filter project tasks
- `complete_task` - Mark task done
- `update_task` - Update task status/assignee
- `bulk_assign_tasks` - Assign multiple tasks efficiently

### Issue Tracking
- `report_issue` - Report blocker/bug/question
- `list_issues` - List project issues
- `assign_issue` - Assign to team member
- `resolve_issue` - Resolve with notes

### Others
- `get_project_risks` - Risk analysis
- `get_notifications` - View notifications
- `mark_notification_read` - Mark as read
- `get_online_users` - See online team members

## 🔧 Scripts

Configuration scripts are located in the [`scripts/`](../../scripts/) directory:
- `setup_claude.bat` - Automated Claude Desktop setup
- `update_claude_config.bat` - Update configuration

## 📝 Notes

- JWT tokens expire after 7 days - refresh as needed
- Backend must be running on port 8000
- Use `atlas_mcp_server_v2.py` for the latest features
