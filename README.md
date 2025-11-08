# Atlas AI Scrum Master 🤖

Intelligent project management automation system with AI-powered task assignment and real-time collaboration.

## 🎯 Project Overview

The Atlas AI Scrum Master is a comprehensive project management solution that automates task assignment, tracks project progress, and facilitates real-time team collaboration through intelligent automation.

### Key Features
- 🤖 **AI-Powered Task Assignment** - Automatic role-based task distribution
- ⚡ **Real-time Collaboration** - WebSocket-based chat and notifications  
- 📊 **Intelligent Triage** - Priority-based task categorization
- 🔐 **Secure Authentication** - GitHub OAuth with JWT tokens
- 📱 **Responsive Design** - Works seamlessly across all devices
- ⚡ **High Performance** - Sub-500ms API responses, 2-second load times

## 🏗️ Architecture

### Technology Stack
- **Backend**: Python 3.11 + FastAPI + PostgreSQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Real-time**: WebSocket connections for live updates
- **Authentication**: GitHub OAuth + JWT tokens
- **Deployment**: Docker Compose (localhost development)

### System Requirements
- **Timeline**: 3-month MVP (90 days)
- **Target**: 100% team adoption rate
- **Performance**: ≤2s page load, ≤500ms API response
- **Security**: OWASP compliant with mandatory controls

## 📚 Documentation

Comprehensive project documentation is organized in the [`docs/`](./docs/) directory.

### 🚀 **Quick Start**
- **📖 [Documentation Hub](./docs/README.md)** - Central documentation overview
- **🏗️ [Project Structure](./PROJECT_STRUCTURE.md)** - Repository organization
- **⚡ [Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes

### 📁 **Key Documents**

#### 🏛️ **Architecture & Planning**
- [🏗️ System Architecture](./docs/architecture.md) - Complete system design
- [📋 Product Requirements](./docs/project/prd.md) - Product vision and requirements
- [📊 Implementation Status](./docs/IMPLEMENTATION_STATUS.md) - Current progress

#### 📅 **Sprint Planning**
- [🗓️ Sprint Plan](./docs/sprints/SPRINT_PLAN.md) - 10-sprint roadmap
- [📝 Sprint Reports](./docs/sprints/) - Sprint retrospectives
- [📚 Full Backlog](./docs/epics/full-backlog.md) - All user stories and tasks

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 4.24+
- Docker Compose 2.21+
- Git 2.40+
- Node.js 18.17+ (for development)
- Python 3.11+ (for development)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Mahad-Saffi/Atlas-AI-Scrum-Master.git
cd Atlas-AI-Scrum-Master

# Copy environment template (when available)
cp .env.example .env
# Edit .env with your configuration

# Start all services (when Docker setup is ready)
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the application at: http://localhost:3000

## Running with Docker

To run the application using Docker, follow these steps:

### Prerequisites

*   Docker Desktop
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/Mahad-Saffi/Atlas-AI-Scrum-Master.git
cd Atlas-AI-Scrum-Master
```

### 2. Configure Environment Variables

You need to create a `.env` file in the `Backend` directory. You can copy the example file and fill in your GitHub OAuth credentials.

```bash
cp Backend/.env.example Backend/.env
```

Open `Backend/.env` and add your GitHub Client ID and Client Secret:

```
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
JWT_SECRET_KEY=your_256_bit_random_jwt_secret_key_here
SESSION_SECRET_KEY=your_session_secret_key_here
DATABASE_URL=postgresql://ai_scrum_user:dev_password_change_in_production@db:5432/ai_scrum_master
```

**Note:** You can generate a secure random string for `JWT_SECRET_KEY` and `SESSION_SECRET_KEY`.

### 3. Run the Application

```bash
docker-compose up --build -d
```

This command will build the Docker images and start all the services in the background.

### 4. Access the Application

Once the services are running, you can access the application in your browser at:

[http://localhost](http://localhost)

You should see the login page. You can now log in with your GitHub account and test the application.

### 5. Stopping the Application

To stop the application, run:

```bash
docker-compose down
```

## 📊 Project Status

- **Current Sprint**: Sprint 4 of 10 (In Progress)
- **Overall Progress**: ~45% Complete
- **Timeline**: On track for Week 20 completion
- **Story Points**: 47/122 completed

### ✅ **Completed Sprints**
- **Sprint 1**: Foundation & Authentication ✅
- **Sprint 2**: Conversational AI & Project Creation ✅
- **Sprint 3**: AI-Powered Plan Generation ✅

### 🔄 **Current Sprint (Sprint 4)**
- **Goal**: Task Board & Basic Workflow
- **Status**: 50% Complete
- **Deliverables**: TaskBoard UI, Task completion, Task filtering

### 📅 **Upcoming Sprints**
- **Sprint 5**: Automated Task Assignment & Notifications
- **Sprint 6**: Delay Detection & Risk Management
- **Sprint 7**: Real-time Chat Foundation
- **Sprint 8**: Advanced Chat & Direct Messaging
- **Sprint 9**: Issue Tracking & Triage
- **Sprint 10**: UI Polish, Responsiveness & Accessibility

## 🤝 Contributing

We welcome contributions from all team members! Please follow these guidelines:

### 👥 **Team Member Workflow**
**For Omer (Backend), Hassaan (Frontend), Salman (QA), and Mahad (DevOps):**

1. **Start with Documentation**: Check [docs/README.md](./docs/README.md) for your personalized guidance
2. **Create Feature Branch**: `git checkout -b feature/your-amazing-feature`
3. **Follow Role Guidelines**: Reference your role-specific documentation
4. **Write Tests**: Maintain our quality standards
5. **Update Documentation**: Keep docs current with changes
6. **Submit PR**: Include detailed description and testing notes

### 📋 **Development Standards**
- **Backend (Omer)**: Python Black formatting, 90% test coverage, FastAPI best practices
- **Frontend (Hassaan)**: ESLint + Prettier, TypeScript strict mode, 85% test coverage  
- **QA (Salman)**: Comprehensive test plans, automated testing, quality gates
- **DevOps (Mahad)**: Infrastructure as code, security compliance, deployment automation

### 🔄 **Collaboration Process**
1. **Phase-Based Development**: Follow our 4-phase timeline in [Implementation Roadmap](./docs/project-management/implementation-roadmap.md)
2. **Role Coordination**: Use role-specific documentation for integration points
3. **Quality Gates**: All PRs reviewed by relevant team members
4. **Documentation First**: Update docs before code changes

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by agile development methodologies
- Designed for developer productivity and team collaboration

---

**Ready to revolutionize your project management!** 🎉