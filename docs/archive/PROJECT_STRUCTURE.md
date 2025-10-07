# Project Structure Guide

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Target Audience:** All team members (Backend Developers, Frontend Developers, QA Engineers, DevOps Engineers)

## Repository Structure Overview

This document defines the complete file and folder structure for the Atlas AI Scrum Master repository, providing clear guidelines for both backend and frontend development.

## Root Directory Structure

```
Atlas-AI-Scrum-Master/
├── docs/                        # 📚 Documentation (organized by role & expertise)
│   ├── README.md               # 🎯 Team quick start guide (Hassaan, Omer, Salman, Mahad)
│   ├── PROJECT_STRUCTURE.md    # 📋 This file - repository organization
│   ├── READING_GUIDE.md        # 🔍 Original role-based reading guide
│   ├── architecture/           # 🏗️ System design (All technical team)
│   │   ├── architecture.md     # System architecture overview
│   │   └── tech-stack.md       # Technology specifications & versions
│   ├── backend/                # 🐍 Backend documentation (Hassaan's focus)
│   │   ├── database-schema.md  # PostgreSQL design & relationships
│   │   ├── api-design.md       # REST API & WebSocket specifications
│   │   └── security.md         # Authentication & security implementation
│   ├── frontend/               # ⚛️ Frontend documentation (Omer's focus)
│   │   └── frontend-architecture.md # React component design & patterns
│   ├── devops/                 # 🔧 Infrastructure (Mahad's DevOps focus)
│   │   └── deployment.md       # Docker setup & deployment strategy
│   ├── testing/                # 🧪 Quality assurance (Salman's focus)
│   │   └── testing-strategy.md # Testing approach & coverage requirements
│   ├── project-management/     # 📊 Project context (All team reference)
│   │   ├── brief.md            # Project goals & business context
│   │   ├── prd.md              # Product requirements & user stories
│   │   └── implementation-roadmap.md # 4-phase development plan
│   └── phases/                 # 📅 Phase-specific guidance
│       ├── phase-1/            # Foundation & Authentication (Weeks 1-4)
│       ├── phase-2/            # Core Features (Weeks 5-8)
│       ├── phase-3/            # Advanced Features (Weeks 9-11)
│       └── phase-4/            # Deployment & Adoption (Weeks 12-14)
├── backend/                     # 🐍 Python FastAPI Backend
│   ├── app/                    # Main application code
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application entry point
│   │   ├── config/             # Configuration management
│   │   │   ├── __init__.py
│   │   │   ├── settings.py     # Environment settings
│   │   │   └── database.py     # Database configuration
│   │   ├── models/             # SQLAlchemy database models
│   │   │   ├── __init__.py
│   │   │   ├── user.py         # User model
│   │   │   ├── task.py         # Task model
│   │   │   ├── notification.py # Notification model
│   │   │   ├── chat.py         # Chat message model
│   │   │   └── triage.py       # Triage item model
│   │   ├── schemas/            # Pydantic schemas for API
│   │   │   ├── __init__.py
│   │   │   ├── user.py         # User schemas
│   │   │   ├── task.py         # Task schemas
│   │   │   ├── notification.py # Notification schemas
│   │   │   ├── chat.py         # Chat schemas
│   │   │   └── auth.py         # Authentication schemas
│   │   ├── api/                # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── v1/             # API version 1
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py     # Authentication endpoints
│   │   │   │   ├── users.py    # User management endpoints
│   │   │   │   ├── tasks.py    # Task management endpoints
│   │   │   │   ├── notifications.py # Notification endpoints
│   │   │   │   ├── chat.py     # Chat endpoints
│   │   │   │   └── triage.py   # Triage endpoints
│   │   │   └── websocket.py    # WebSocket handlers
│   │   ├── services/           # Business logic services
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py # Authentication logic
│   │   │   ├── task_service.py # Task assignment logic
│   │   │   ├── notification_service.py # Notification logic
│   │   │   ├── chat_service.py # Chat logic
│   │   │   └── scheduler_service.py # Background task scheduling
│   │   ├── core/               # Core utilities
│   │   │   ├── __init__.py
│   │   │   ├── security.py     # Security utilities (JWT, OAuth)
│   │   │   ├── deps.py         # Dependency injection
│   │   │   ├── exceptions.py   # Custom exception classes
│   │   │   └── middleware.py   # Custom middleware
│   │   └── utils/              # Utility functions
│   │       ├── __init__.py
│   │       ├── yaml_parser.py  # Project plan YAML parsing
│   │       ├── date_utils.py   # Date/time utilities
│   │       └── validators.py   # Custom validators
│   ├── tests/                  # Backend test files
│   │   ├── __init__.py
│   │   ├── conftest.py         # Pytest configuration
│   │   ├── test_auth.py        # Authentication tests
│   │   ├── test_tasks.py       # Task management tests
│   │   ├── test_services/      # Service layer tests
│   │   └── test_integration/   # Integration tests
│   ├── alembic/                # Database migrations
│   │   ├── versions/           # Migration files
│   │   ├── env.py              # Alembic environment
│   │   └── alembic.ini         # Alembic configuration
│   ├── scripts/                # Deployment and utility scripts
│   │   ├── start.sh            # Start server script
│   │   ├── migrate.sh          # Database migration script
│   │   └── seed_data.py        # Development data seeding
│   ├── requirements.txt        # Python dependencies
│   ├── requirements-dev.txt    # Development dependencies
│   ├── pyproject.toml          # Python project configuration
│   ├── Dockerfile              # Docker container definition
│   └── .env.example            # Environment variables template
├── frontend/                    # ⚛️ React TypeScript Frontend
│   ├── public/                 # Static assets
│   │   ├── index.html          # HTML entry point
│   │   ├── favicon.ico         # Site icon
│   │   └── manifest.json       # PWA manifest
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Generic components
│   │   │   │   ├── Button/     # Button component
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Modal/      # Modal component
│   │   │   │   ├── Loading/    # Loading spinner component
│   │   │   │   └── ErrorBoundary/ # Error boundary component
│   │   │   ├── forms/          # Form components
│   │   │   │   ├── LoginForm/  # GitHub OAuth login form
│   │   │   │   ├── TaskForm/   # Task creation/editing form
│   │   │   │   └── IssueForm/  # Issue reporting form
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Header/     # Application header
│   │   │   │   ├── Sidebar/    # Navigation sidebar
│   │   │   │   ├── Footer/     # Application footer
│   │   │   │   └── Layout/     # Main layout wrapper
│   │   │   ├── tasks/          # Task-related components
│   │   │   │   ├── TaskBoard/  # Kanban task board
│   │   │   │   ├── TaskCard/   # Individual task card
│   │   │   │   ├── TaskList/   # Task list view
│   │   │   │   └── TaskFilter/ # Task filtering
│   │   │   ├── chat/           # Chat components
│   │   │   │   ├── ChatPanel/  # Main chat interface
│   │   │   │   ├── MessageList/ # Message display
│   │   │   │   ├── MessageInput/ # Message input
│   │   │   │   └── UserList/   # Online user list
│   │   │   └── notifications/  # Notification components
│   │   │       ├── NotificationBell/ # Notification icon
│   │   │       ├── NotificationList/ # Notification dropdown
│   │   │       └── NotificationItem/ # Individual notification
│   │   ├── pages/              # Page-level components
│   │   │   ├── Login/          # Login page
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Login.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Dashboard/      # Main dashboard
│   │   │   ├── Tasks/          # Task management pages
│   │   │   ├── Chat/           # Chat page
│   │   │   ├── Profile/        # User profile page
│   │   │   └── Settings/       # Application settings
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts      # Authentication hook
│   │   │   ├── useTasks.ts     # Task management hook
│   │   │   ├── useWebSocket.ts # WebSocket connection hook
│   │   │   ├── useNotifications.ts # Notifications hook
│   │   │   └── useLocalStorage.ts # Local storage hook
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.tsx # Authentication context
│   │   │   ├── TaskContext.tsx # Task state context
│   │   │   ├── ChatContext.tsx # Chat state context
│   │   │   └── NotificationContext.tsx # Notification context
│   │   ├── services/           # API services
│   │   │   ├── api.ts          # Axios configuration
│   │   │   ├── authService.ts  # Authentication API calls
│   │   │   ├── taskService.ts  # Task API calls
│   │   │   ├── chatService.ts  # Chat API calls
│   │   │   ├── notificationService.ts # Notification API calls
│   │   │   └── websocketService.ts # WebSocket management
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── auth.ts         # Authentication types
│   │   │   ├── task.ts         # Task types
│   │   │   ├── chat.ts         # Chat types
│   │   │   ├── notification.ts # Notification types
│   │   │   └── api.ts          # API response types
│   │   ├── utils/              # Utility functions
│   │   │   ├── formatters.ts   # Data formatting utilities
│   │   │   ├── validators.ts   # Form validation utilities
│   │   │   ├── constants.ts    # Application constants
│   │   │   └── helpers.ts      # General helper functions
│   │   ├── styles/             # Styling files
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── components.css  # Component-specific styles
│   │   │   └── tailwind.css    # Tailwind imports
│   │   ├── __tests__/          # Test files
│   │   │   ├── setup.ts        # Test setup configuration
│   │   │   ├── utils/          # Test utilities
│   │   │   └── __mocks__/      # Mock implementations
│   │   ├── App.tsx             # Root application component
│   │   ├── App.test.tsx        # App component tests
│   │   ├── index.tsx           # Application entry point
│   │   └── vite-env.d.ts       # Vite type definitions
│   ├── package.json            # Node.js dependencies
│   ├── package-lock.json       # Locked dependency versions
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.ts          # Vite build configuration
│   ├── .eslintrc.json          # ESLint configuration
│   ├── .prettierrc             # Prettier configuration
│   ├── Dockerfile              # Frontend Docker container
│   └── .env.example            # Environment variables template
├── database/                    # 🗄️ Database files and scripts
│   ├── init/                   # Database initialization
│   │   ├── 01-create-db.sql    # Database creation script
│   │   └── 02-create-user.sql  # User creation script
│   ├── migrations/             # Manual migration scripts (if needed)
│   ├── seeds/                  # Seed data for development
│   │   ├── dev-users.sql       # Development users
│   │   ├── sample-tasks.sql    # Sample tasks
│   │   └── test-data.sql       # Test data
│   └── backups/                # Database backup location
├── docker/                      # 🐳 Docker configuration
│   ├── nginx/                  # Nginx reverse proxy
│   │   ├── nginx.conf          # Nginx configuration
│   │   └── default.conf        # Default site configuration
│   ├── postgres/               # PostgreSQL configuration
│   │   └── postgresql.conf     # Database configuration
│   └── scripts/                # Docker utility scripts
│       ├── build.sh            # Build all containers
│       ├── start.sh            # Start development environment
│       └── stop.sh             # Stop all services
├── tests/                       # 🧪 End-to-end and integration tests
│   ├── e2e/                    # End-to-end tests (Playwright)
│   │   ├── auth.spec.ts        # Authentication flow tests
│   │   ├── tasks.spec.ts       # Task management tests
│   │   ├── chat.spec.ts        # Chat functionality tests
│   │   └── integration.spec.ts # Full workflow tests
│   ├── performance/            # Performance tests (Locust)
│   │   ├── locustfile.py       # Load testing scenarios
│   │   └── test_config.py      # Performance test configuration
│   └── fixtures/               # Test data fixtures
│       ├── users.json          # Test user data
│       ├── tasks.yaml          # Sample project plans
│       └── chat-history.json   # Sample chat data
├── scripts/                     # 📜 Project automation scripts
│   ├── setup.sh                # Initial project setup
│   ├── dev-start.sh            # Start development environment
│   ├── test-all.sh             # Run all tests
│   ├── build-prod.sh           # Production build script
│   ├── backup-db.sh            # Database backup script
│   └── deploy.sh               # Deployment script
├── config/                      # ⚙️ Configuration files
│   ├── development.env         # Development environment vars
│   ├── production.env          # Production environment vars
│   ├── test.env                # Test environment vars
│   └── docker-compose.yml      # Docker services definition
├── .github/                     # 🏗️ GitHub Actions workflows
│   ├── workflows/              # CI/CD workflows
│   │   ├── ci.yml              # Continuous integration
│   │   ├── tests.yml           # Automated testing
│   │   └── security.yml        # Security scanning
│   └── ISSUE_TEMPLATE/         # Issue templates
│       ├── bug_report.md       # Bug report template
│       └── feature_request.md  # Feature request template
├── .gitignore                   # Git ignore patterns
├── .dockerignore               # Docker ignore patterns
├── docker-compose.yml          # Development Docker Compose
├── docker-compose.prod.yml     # Production Docker Compose
├── README.md                   # Project overview
├── CONTRIBUTING.md             # Contribution guidelines
├── GIT_WORKFLOW.md             # Git workflow cheat sheet
├── LICENSE                     # MIT license
├── CHANGELOG.md                # Version history
├── cleanup-branches.sh         # Branch cleanup script
└── project-plan.yaml           # Project plan (when available)
```

## Key Directory Purposes

### Backend (`/backend/`)
**Primary Audience:** Backend Developers, DevOps Engineers

- **app/**: Core application code following FastAPI best practices
- **models/**: SQLAlchemy database models with relationships
- **api/**: RESTful API endpoints organized by version
- **services/**: Business logic separated from API handlers
- **tests/**: Comprehensive test coverage (target: 90%)

### Frontend (`/frontend/`)
**Primary Audience:** Frontend Developers, UI/UX Designers

- **components/**: Reusable React components with TypeScript
- **pages/**: Page-level components for routing
- **hooks/**: Custom React hooks for state management
- **services/**: API integration and WebSocket management
- **types/**: TypeScript definitions for type safety

### Documentation (`/docs/`)
**Primary Audience:** All team members, new joiners

- **Phase organization**: Documents grouped by development phase
- **Role-specific guidance**: Clear indication of target audience
- **Comprehensive coverage**: All aspects of the system documented

### Infrastructure (`/docker/`, `/config/`)
**Primary Audience:** DevOps Engineers, Backend Developers

- **docker/**: Container configurations for all services
- **config/**: Environment-specific configurations
- **scripts/**: Automation for development and deployment

## File Naming Conventions

### Backend Python Files
- **Models**: Singular nouns (e.g., `user.py`, `task.py`)
- **Services**: Service suffix (e.g., `auth_service.py`)
- **Tests**: Test prefix (e.g., `test_auth.py`)
- **Utilities**: Descriptive names (e.g., `yaml_parser.py`)

### Frontend TypeScript Files
- **Components**: PascalCase folders and files (e.g., `TaskBoard/TaskBoard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `authService.ts`)
- **Types**: camelCase descriptive (e.g., `auth.ts`, `task.ts`)

### Documentation Files
- **Uppercase**: Major documents (e.g., `README.md`, `CONTRIBUTING.md`)
- **Lowercase**: Technical docs (e.g., `architecture.md`, `api-design.md`)
- **Descriptive**: Clear purpose indication (e.g., `NEWCOMER_GUIDE.md`)

## Development Workflow

### 1. Backend Development
```bash
# Navigate to backend
cd backend/

# Install dependencies
pip install -r requirements-dev.txt

# Start database
docker-compose up -d postgres

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### 2. Frontend Development
```bash
# Navigate to frontend  
cd frontend/

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### 3. Full Stack Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Run full test suite
./scripts/test-all.sh
```

## Code Organization Best Practices

### Backend Structure
- **Separation of Concerns**: Models, services, and API handlers are clearly separated
- **Dependency Injection**: Use FastAPI's dependency system for database sessions and authentication
- **Error Handling**: Centralized exception handling with custom exception classes
- **Testing**: Each service and endpoint has corresponding test files

### Frontend Structure  
- **Component Organization**: Components grouped by feature and complexity level
- **State Management**: Context providers for global state, local state for component-specific data
- **Type Safety**: TypeScript interfaces for all data structures
- **Testing**: Unit tests for components, integration tests for user flows

### Shared Conventions
- **Consistent Imports**: Absolute imports from src/ directory
- **Error Boundaries**: Comprehensive error handling at appropriate levels
- **Code Quality**: ESLint, Prettier, and pre-commit hooks
- **Documentation**: JSDoc comments for complex functions

## Phase-Specific Focus

### Phase 1 (Foundation)
**Focus Areas**: `/backend/app/`, `/frontend/src/components/auth/`, `/database/`

### Phase 2 (Core Features)
**Focus Areas**: `/backend/app/services/`, `/frontend/src/components/tasks/`, `/frontend/src/components/chat/`

### Phase 3 (Advanced Features)  
**Focus Areas**: `/tests/`, `/docker/`, performance optimization across all areas

### Phase 4 (Deployment)
**Focus Areas**: `/scripts/`, `/config/`, deployment and monitoring setup

This structure supports clean development practices, clear separation of concerns, and easy navigation for team members at any experience level.