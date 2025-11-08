# Atlas Project Structure

Clean and organized structure for the Atlas AI Scrum Master project.

---

## 📁 Root Directory

```
Atlas-AI-Scrum-Master/
├── backend/                 # Python FastAPI backend application
├── frontend/                # React TypeScript frontend application
├── docs/                    # All project documentation
├── .vscode/                 # VS Code settings
├── .git/                    # Git repository
├── docker-compose.yml       # Docker services configuration
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore rules
├── README.md               # Project overview and quick start
├── QUICK_START.md          # Detailed setup guide
├── CHANGELOG.md            # Recent changes log
├── WORK_COMPLETED.md       # Work completion summary
├── PROJECT_STRUCTURE.md    # This file
└── LICENSE                 # MIT License
```

---

## 🐍 Backend Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── ai.py              # AI/conversational endpoints
│   │       └── projects.py        # Project and task endpoints
│   ├── config/
│   │   ├── __init__.py
│   │   └── database.py            # Database configuration
│   ├── core/
│   │   └── security.py            # Authentication & security
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User model
│   │   ├── project.py             # Project model
│   │   ├── epic.py                # Epic model
│   │   ├── story.py               # Story model
│   │   └── task.py                # Task model
│   └── services/
│       ├── ai_service.py          # AI/LangChain logic
│       ├── project_service.py     # Project business logic
│       ├── task_service.py        # Task business logic
│       └── user_service.py        # User business logic
├── alembic/
│   ├── versions/
│   │   └── 001_add_epic_story_models.py
│   ├── env.py
│   └── alembic.ini
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_ai.py
├── main.py                        # FastAPI application entry
├── test_models.py                 # Model verification script
├── requirements.txt               # Python dependencies
├── requirements-dev.txt           # Dev dependencies
├── .env                          # Environment variables
└── .env.example                  # Environment template
```

---

## ⚛️ Frontend Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   └── ChatInterface.test.tsx
│   │   ├── tasks/
│   │   │   └── TaskBoard.tsx
│   │   └── UserProfile.tsx
│   ├── pages/
│   │   ├── SignIn.tsx             # Login page
│   │   ├── AuthCallback.tsx       # OAuth callback
│   │   ├── ProjectCreation.tsx    # Project creation page
│   │   └── TaskBoardPage.tsx      # Task board page
│   ├── services/
│   │   ├── auth.ts                # Authentication service
│   │   ├── aiService.ts           # AI API client
│   │   └── taskService.ts         # Task API client
│   ├── tests/
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # Entry point
│   └── index.css
├── public/
│   ├── vite.svg
│   └── bg.jpg
├── Dockerfile                     # Frontend Docker config
├── nginx.conf                     # Nginx configuration
├── package.json                   # NPM dependencies
├── package-lock.json
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js
└── eslint.config.js
```

---

## 📚 Documentation Structure

```
docs/
├── README.md                      # Documentation overview
├── architecture.md                # Complete system architecture
├── IMPLEMENTATION_STATUS.md       # Current project status
├── epics/
│   ├── README.md                  # Epic overview
│   └── full-backlog.md           # Complete product backlog
├── sprints/
│   ├── SPRINT_PLAN.md            # 10-sprint plan
│   ├── sprint-1-report.md        # Sprint 1 retrospective
│   └── sprint-2-report.md        # Sprint 2 retrospective
└── project/
    └── prd.md                     # Product Requirements Document
```

---

## 🐳 Docker Configuration

```
docker-compose.yml                 # Main Docker Compose file

Services:
├── db          (PostgreSQL 15.4)  # Database
├── redis       (Redis 7.2)        # Cache & sessions
├── backend     (Python 3.11)      # FastAPI backend
└── frontend    (Node 18)          # React frontend
```

---

## 🗂️ Key Files

### Configuration Files
- **docker-compose.yml** - Docker services setup
- **backend/.env** - Backend environment variables
- **backend/alembic.ini** - Database migration config
- **frontend/vite.config.ts** - Frontend build config
- **frontend/tailwind.config.js** - Tailwind CSS config

### Documentation Files
- **README.md** - Project overview
- **QUICK_START.md** - Setup instructions
- **CHANGELOG.md** - Recent changes
- **WORK_COMPLETED.md** - Work summary
- **PROJECT_STRUCTURE.md** - This file

### Development Files
- **.gitignore** - Git ignore rules
- **.vscode/settings.json** - VS Code settings
- **backend/test_models.py** - Model verification
- **LICENSE** - MIT License

---

## 📦 Dependencies

### Backend (Python)
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **LangChain** - AI framework
- **Authlib** - OAuth implementation
- **PyJWT** - JWT tokens
- **asyncpg** - Async PostgreSQL driver

### Frontend (TypeScript/React)
- **React 18** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **TypeScript** - Type safety

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mahad-Saffi/Atlas-AI-Scrum-Master.git
   cd Atlas-AI-Scrum-Master
   ```

2. **Set up environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your credentials
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:8000
   - Health: http://localhost:8000/health

---

## 📝 Notes

### Naming Conventions
- **Backend:** snake_case for Python files and functions
- **Frontend:** PascalCase for components, camelCase for functions
- **Database:** snake_case for tables and columns
- **API:** kebab-case for endpoints

### Code Organization
- **Models:** Database schema definitions
- **Services:** Business logic layer
- **API:** HTTP endpoint handlers
- **Components:** Reusable UI elements
- **Pages:** Full page components

### Best Practices
- Keep components small and focused
- Use TypeScript for type safety
- Write tests for critical paths
- Document complex logic
- Follow the existing patterns

---

**Last Updated:** November 8, 2025  
**Maintained By:** Atlas Development Team
