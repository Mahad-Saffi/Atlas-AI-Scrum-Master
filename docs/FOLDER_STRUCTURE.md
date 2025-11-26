# Atlas AI Scrum Master - Folder Structure

## 📁 Project Organization

```
Atlas-AI-Scrum-Master/
│
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 CHANGELOG.md                 # Version history
├── 📄 .gitignore                   # Git ignore rules
├── 📄 docker-compose.yml           # Docker configuration
│
├── 📂 backend/                     # Python FastAPI Backend
│   ├── 📂 app/
│   │   ├── 📂 api/v1/             # API endpoints
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── ai.py              # AI conversation endpoints
│   │   │   ├── projects.py        # Project management
│   │   │   ├── notifications.py   # Notification system
│   │   │   ├── chat.py            # WebSocket chat
│   │   │   └── issues.py          # Issue tracking
│   │   │
│   │   ├── 📂 models/             # Database models
│   │   │   ├── user.py            # User model
│   │   │   ├── project.py         # Project/Epic/Story models
│   │   │   ├── task.py            # Task model with risk
│   │   │   ├── notification.py    # Notification model
│   │   │   ├── message.py         # Chat message model
│   │   │   └── issue.py           # Issue model
│   │   │
│   │   ├── 📂 services/           # Business logic
│   │   │   ├── auth_service.py    # Password hashing
│   │   │   ├── ai_service.py      # OpenAI integration
│   │   │   ├── task_service.py    # Task management
│   │   │   ├── risk_service.py    # Risk calculation
│   │   │   ├── notification_service.py
│   │   │   ├── websocket_manager.py
│   │   │   └── issue_service.py
│   │   │
│   │   ├── 📂 core/               # Core utilities
│   │   │   ├── security.py        # JWT verification
│   │   │   └── startup.py         # Startup checks
│   │   │
│   │   └── 📂 config/             # Configuration
│   │       └── database.py        # Database setup
│   │
│   ├── 📄 main.py                 # FastAPI application
│   ├── 📄 requirements.txt        # Python dependencies
│   └── 📄 .env                    # Environment variables
│
├── 📂 frontend/                    # React TypeScript Frontend
│   ├── 📂 src/
│   │   ├── 📂 pages/              # Page components
│   │   │   ├── SimpleLogin.tsx    # Login page
│   │   │   ├── ProjectCreation.tsx # AI chat page
│   │   │   ├── TaskBoardPage.tsx  # Task board
│   │   │   ├── ProjectDashboard.tsx # Dashboard
│   │   │   └── ChatPage.tsx       # Team chat
│   │   │
│   │   ├── 📂 components/         # Reusable components
│   │   │   ├── UserProfile.tsx    # User dashboard
│   │   │   ├── ChatInterface.tsx  # AI chat UI
│   │   │   ├── ChatPanel.tsx      # Team chat UI
│   │   │   ├── NotificationBell.tsx # Notifications
│   │   │   ├── ThemeToggle.tsx    # Dark mode toggle
│   │   │   ├── ErrorBoundary.tsx  # Error handling
│   │   │   ├── LoadingSpinner.tsx # Loading states
│   │   │   └── 📂 tasks/
│   │   │       └── TaskBoard.tsx  # Kanban board
│   │   │
│   │   ├── 📂 services/           # API clients
│   │   │   ├── auth.ts            # Auth API
│   │   │   ├── aiService.ts       # AI API
│   │   │   ├── taskService.ts     # Task API
│   │   │   └── notificationService.ts
│   │   │
│   │   ├── 📂 hooks/              # Custom React hooks
│   │   │   └── useTheme.ts        # Theme management
│   │   │
│   │   ├── 📄 App.tsx             # Main app component
│   │   └── 📄 main.tsx            # Entry point
│   │
│   ├── 📄 package.json            # Node dependencies
│   ├── 📄 tsconfig.json           # TypeScript config
│   └── 📄 vite.config.ts          # Vite config
│
└── 📂 docs/                        # Documentation
    ├── 📄 INDEX.md                # Documentation index
    ├── 📄 README.md               # Docs overview
    ├── 📄 architecture.md         # System architecture
    ├── 📄 IMPLEMENTATION_STATUS.md # Feature status
    ├── 📄 PROJECT_STRUCTURE.md    # This file
    ├── 📄 GIT_COMMANDS.md         # Git reference
    │
    ├── 📂 guides/                 # User guides
    │   ├── QUICK_START.md         # 5-minute setup
    │   ├── AUTH_UPDATE.md         # Auth guide
    │   ├── LOCAL_DEVELOPMENT.md   # Dev setup
    │   └── LOCAL_TESTING_GUIDE.md # Testing guide
    │
    ├── 📂 setup/                  # Configuration
    │   └── SETUP_AI_INTEGRATION.md # OpenAI setup
    │
    ├── 📂 testing/                # Test docs
    │   ├── BACKEND_TESTING.md     # Backend tests
    │   └── TESTING_SUMMARY.md     # Test results
    │
    ├── 📂 summaries/              # Sprint reports
    │   ├── PROJECT_COMPLETE.md    # 100% completion
    │   ├── FINAL_SUMMARY.md       # Project summary
    │   ├── SPRINT_4_5_COMPLETE.md # Sprint 4-5
    │   ├── SPRINT_6_7_COMPLETE.md # Sprint 6-7
    │   ├── INTEGRATION_COMPLETE.md
    │   ├── COMPLETE_UI_REDESIGN_SUMMARY.md
    │   ├── FRONTEND_UI_UPDATE.md
    │   ├── UI_DESIGN_SYSTEM.md
    │   ├── AI_INTEGRATION_FIX.md
    │   ├── WORK_COMPLETED.md
    │   ├── RESTRUCTURE_SUMMARY.md
    │   ├── BACKEND_LOGICAL_ISSUES.md
    │   └── GITIGNORE_SUMMARY.md
    │
    ├── 📂 scripts/                # Utility scripts
    │   ├── start-local.sh         # Start dev servers
    │   ├── start-servers.sh       # Start both servers
    │   ├── test-backend-complete.sh # Run tests
    │   ├── test-local.sh          # Local testing
    │   ├── get-token.sh           # Get JWT token
    │   ├── fix-backend.sh         # Backend fixes
    │   └── debug-failures.sh      # Debug tests
    │
    ├── 📂 sprints/                # Sprint planning
    │   ├── SPRINT_PLAN.md         # 10-sprint plan
    │   ├── sprint-1-report.md     # Sprint reports
    │   ├── sprint-2-report.md
    │   └── sprint-3-report.md
    │
    ├── 📂 epics/                  # Product backlog
    │   ├── README.md              # Epic overview
    │   └── full-backlog.md        # Complete backlog
    │
    └── 📂 project/                # Project docs
        └── prd.md                 # Product requirements
```

## 📊 Key Directories

### Backend (`backend/`)
- **API Layer**: RESTful endpoints + WebSocket
- **Models**: SQLAlchemy ORM models (11 tables)
- **Services**: Business logic and integrations
- **Core**: Security, startup, configuration

### Frontend (`frontend/`)
- **Pages**: Full-page components
- **Components**: Reusable UI components
- **Services**: API client functions
- **Hooks**: Custom React hooks

### Documentation (`docs/`)
- **Guides**: Step-by-step tutorials
- **Setup**: Configuration instructions
- **Testing**: Test documentation
- **Summaries**: Sprint completion reports
- **Scripts**: Development utilities
- **Sprints**: Sprint planning and reports
- **Epics**: Product backlog
- **Project**: Core project documents

## 🎯 Quick Navigation

**Getting Started**
- Start here: [docs/INDEX.md](INDEX.md)
- Quick setup: [docs/guides/QUICK_START.md](guides/QUICK_START.md)

**Development**
- Backend code: `backend/app/`
- Frontend code: `frontend/src/`
- Scripts: `docs/scripts/`

**Documentation**
- Architecture: [docs/architecture.md](architecture.md)
- API docs: http://localhost:8000/docs (when running)
- Project status: [docs/summaries/PROJECT_COMPLETE.md](summaries/PROJECT_COMPLETE.md)

## 📝 File Naming Conventions

- **UPPERCASE.md**: Important documentation files
- **lowercase.md**: Regular documentation
- **PascalCase.tsx**: React components
- **camelCase.ts**: TypeScript modules
- **snake_case.py**: Python modules
- **kebab-case.sh**: Shell scripts

## 🔍 Finding Files

Use the [Documentation Index](INDEX.md) to quickly find what you need, or:

```bash
# Find a file by name
find . -name "filename"

# Search for content
grep -r "search term" docs/

# List all markdown files
find docs/ -name "*.md"
```

---

**Last Updated**: November 26, 2025  
**Project**: Atlas AI Scrum Master  
**Status**: ✅ Production Ready
