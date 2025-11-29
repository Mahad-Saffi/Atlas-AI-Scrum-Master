# 📁 Atlas AI Scrum Master - Project Structure

Clean and organized project structure for easy navigation.

## 🗂️ Root Directory

```
Atlas-AI-Scrum-Master/
├── 📄 README.md                    # Project overview and quick start
├── 📄 LICENSE                      # MIT License
├── 📄 CHANGELOG.md                 # Version history
├── 📄 .gitignore                   # Git ignore rules
├── 🐳 docker-compose.yml           # Docker configuration
├── 🐍 atlas_mcp_server_v2.py       # MCP server (latest version)
├── 🐍 atlas_mcp_server.py          # MCP server (v1)
│
├── 📂 backend/                     # Python FastAPI backend
├── 📂 frontend/                    # React TypeScript frontend
├── 📂 docs/                        # All documentation
└── 📂 scripts/                     # Setup and utility scripts
```

## 🔧 Backend Structure

```
backend/
├── 📄 main.py                      # FastAPI application entry
├── 📄 requirements.txt             # Python dependencies
├── 📄 requirements-dev.txt         # Development dependencies
├── 📄 alembic.ini                  # Database migration config
├── 🗄️ atlas.db                     # SQLite database (production)
├── 🗄️ test.db                      # SQLite database (testing)
├── 🐍 init_database.py             # Database initialization
├── 🐍 migrate_organizations.py     # Organization migration script
│
├── 📂 app/
│   ├── 📂 api/v1/                  # API endpoints
│   │   ├── auth.py                 # Authentication
│   │   ├── organizations.py        # Organization management
│   │   ├── projects.py             # Project management
│   │   ├── issues.py               # Issue tracking
│   │   ├── notifications.py        # Notifications
│   │   ├── chat.py                 # Real-time chat
│   │   └── ai.py                   # AI integration
│   │
│   ├── 📂 models/                  # SQLAlchemy models
│   │   ├── user.py                 # User model
│   │   ├── organization.py         # Organization models
│   │   ├── project.py              # Project model
│   │   ├── task.py                 # Task model
│   │   ├── issue.py                # Issue model
│   │   └── ...                     # Other models
│   │
│   ├── 📂 services/                # Business logic
│   │   ├── ai_service.py           # OpenAI integration
│   │   ├── organization_service.py # Organization logic
│   │   ├── project_service.py      # Project logic
│   │   ├── task_service.py         # Task logic
│   │   ├── notification_service.py # Notification logic
│   │   └── ...                     # Other services
│   │
│   ├── 📂 core/                    # Core utilities
│   │   ├── security.py             # JWT & authentication
│   │   ├── startup.py              # Startup checks
│   │   └── ...                     # Other core modules
│   │
│   └── 📂 config/                  # Configuration
│       └── database.py             # Database config
│
├── 📂 alembic/                     # Database migrations
│   └── versions/                   # Migration files
│
└── 📂 tests/                       # Backend tests
    └── test_*.py                   # Test files
```

## 🎨 Frontend Structure

```
frontend/
├── 📄 package.json                 # Node dependencies
├── 📄 vite.config.ts               # Vite configuration
├── 📄 tsconfig.json                # TypeScript config
├── 📄 tailwind.config.js           # Tailwind CSS config
├── 📄 index.html                   # HTML entry point
│
├── 📂 src/
│   ├── 📄 main.tsx                 # React entry point
│   ├── 📄 App.tsx                  # Main App component
│   │
│   ├── 📂 components/              # React components
│   │   ├── Dashboard.tsx           # Dashboard view
│   │   ├── TaskBoard.tsx           # Kanban board
│   │   ├── ChatInterface.tsx       # Chat UI
│   │   ├── IssueTracker.tsx        # Issue management
│   │   └── ...                     # Other components
│   │
│   ├── 📂 services/                # API services
│   │   ├── api.ts                  # API client
│   │   ├── auth.ts                 # Auth service
│   │   └── websocket.ts            # WebSocket service
│   │
│   ├── 📂 types/                   # TypeScript types
│   │   └── index.ts                # Type definitions
│   │
│   ├── 📂 styles/                  # CSS styles
│   │   └── index.css               # Global styles
│   │
│   └── 📂 assets/                  # Static assets
│       └── images/                 # Images
│
└── 📂 public/                      # Public assets
    └── favicon.ico                 # Favicon
```

## 📚 Documentation Structure

```
docs/
├── 📄 README.md                    # Documentation index
├── 📄 INDEX.md                     # Complete documentation guide
├── 📄 architecture.md              # System architecture
├── 📄 HOW_IT_WORKS.md              # How the system works
├── 📄 ORGANIZATION_FEATURE.md      # Multi-tenant features
├── 📄 IMPLEMENTATION_STATUS.md     # Implementation progress
├── 📄 PROJECT_STRUCTURE.md         # This file
│
├── 📂 guides/                      # User guides
│   ├── QUICK_START.md              # 5-minute setup
│   ├── HOW_TO_CREATE_MCP_SERVER.md # MCP development guide
│   └── ...                         # Other guides
│
├── 📂 mcp/                         # MCP integration docs
│   ├── README.md                   # MCP overview
│   ├── MCP_QUICK_START.md          # Quick setup
│   ├── SETUP_MCP.md                # Detailed setup
│   ├── MCP_IMPLEMENTATION_GUIDE.md # Implementation details
│   └── RESTART_CLAUDE.md           # Troubleshooting
│
├── 📂 tests/                       # Test scripts
│   ├── README.md                   # Test documentation
│   ├── test_bulk_assign.py         # Bulk assignment test
│   ├── test_mcp.py                 # MCP integration test
│   └── test_organization.sh        # Organization test
│
├── 📂 setup/                       # Setup guides
│   ├── BACKEND_SETUP.md            # Backend installation
│   ├── FRONTEND_SETUP.md           # Frontend installation
│   └── ...                         # Other setup docs
│
├── 📂 sprints/                     # Sprint documentation
│   ├── sprint-1/                   # Sprint 1 docs
│   ├── sprint-2/                   # Sprint 2 docs
│   └── ...                         # Other sprints
│
├── 📂 summaries/                   # Project summaries
│   ├── PROJECT_COMPLETE.md         # Completion summary
│   └── ...                         # Other summaries
│
├── 📂 epics/                       # Epic documentation
│   └── *.md                        # Epic files
│
└── 📂 testing/                     # Testing documentation
    └── *.md                        # Test docs
```

## 🔧 Scripts Structure

```
scripts/
├── 📄 README.md                    # Scripts documentation
├── 🔧 setup_claude.bat             # Claude Desktop setup
└── 🔧 update_claude_config.bat     # Update Claude config
```

## 🎯 Key Files

### Essential Configuration
- **`.env`** - Environment variables (backend)
- **`atlas.db`** - Production database
- **`claude_desktop_config.json`** - MCP configuration (in AppData)

### Entry Points
- **Backend**: `backend/main.py`
- **Frontend**: `frontend/src/main.tsx`
- **MCP Server**: `atlas_mcp_server_v2.py`

### Documentation
- **Main README**: `README.md`
- **Docs Index**: `docs/INDEX.md`
- **Quick Start**: `docs/guides/QUICK_START.md`

## 📊 File Count Summary

- **Total Files**: ~150+
- **Python Files**: ~40
- **TypeScript/React**: ~30
- **Documentation**: ~50
- **Configuration**: ~15
- **Tests**: ~15

## 🗂️ Organization Principles

### ✅ Clean Root Directory
- Only essential files in root
- No loose documentation files
- Clear separation of concerns

### 📁 Logical Grouping
- **Code**: `backend/`, `frontend/`
- **Docs**: `docs/`
- **Scripts**: `scripts/`
- **MCP**: Root level (for easy access)

### 📝 Documentation First
- Every directory has README.md
- Clear navigation paths
- Comprehensive guides

### 🔧 Easy Access
- Quick start in main README
- Scripts in dedicated folder
- Tests organized by type

## 🚀 Navigation Tips

### Finding Things Quickly

**Need to start the app?**
→ `README.md` → Quick Start section

**Need MCP setup?**
→ `docs/mcp/MCP_QUICK_START.md`

**Need to run tests?**
→ `docs/tests/README.md`

**Need API documentation?**
→ `http://localhost:8000/docs` (when backend running)

**Need architecture info?**
→ `docs/architecture.md`

**Need sprint details?**
→ `docs/sprints/sprint-X/`

## 📚 Related Documentation

- [Documentation Index](./INDEX.md)
- [Quick Start Guide](./guides/QUICK_START.md)
- [Architecture Overview](./architecture.md)
- [MCP Integration](./mcp/README.md)

---

**Last Updated**: November 30, 2025  
**Version**: 2.0  
**Status**: Production Ready 🚀
