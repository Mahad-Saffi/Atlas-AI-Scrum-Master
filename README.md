# Atlas AI Scrum Master 🤖

Intelligent project management automation system with AI-powered task assignment and real-time collaboration.

## 🎯 Project Overview

The Atlas AI Scrum Master is a comprehensive project management solution that automates task assignment, tracks project progress, and facilitates real-time team collaboration through intelligent automation.

### Key Features
- 🤖 **AI-Powered Project Planning** - OpenAI GPT-4o-mini for conversational project creation
- 📋 **Intelligent Task Management** - Kanban board with risk detection and auto-assignment
- ⚡ **Real-time Collaboration** - WebSocket chat with channels and direct messaging
- � **Semart Notifications** - Real-time alerts for tasks, risks, and issues
- � ***Issue Tracking & Triage** - Complete issue management system
- 🔐 **Secure Authentication** - Email/password with JWT tokens and bcrypt
- 🎨 **Beautiful UI** - Hand-drawn aesthetic with dark mode support
- 📱 **Responsive Design** - Mobile-friendly with accessibility features
- ⚡ **High Performance** - Fast API responses and optimized frontend

## 🏗️ Architecture

### Technology Stack
- **Backend**: Python 3.11 + FastAPI + SQLite (async)
- **Frontend**: React 18 + TypeScript + Vite
- **AI**: OpenAI GPT-4o-mini integration
- **Real-time**: WebSocket connections for chat and presence
- **Authentication**: Email/password with JWT tokens + bcrypt
- **Deployment**: Local development (Docker-ready)

### System Requirements
- **Timeline**: 3-month MVP (90 days)
- **Target**: 100% team adoption rate
- **Performance**: ≤2s page load, ≤500ms API response
- **Security**: OWASP compliant with mandatory controls

## 📚 Documentation

Comprehensive project documentation is organized in the [`docs/`](./docs/) directory.

### 🚀 **Quick Start**
- **📖 [Documentation Index](./docs/INDEX.md)** - Complete documentation guide
- **⚡ [Quick Start Guide](./docs/guides/QUICK_START.md)** - Get up and running in 5 minutes
- **🎉 [Project Complete](./docs/summaries/PROJECT_COMPLETE.md)** - 100% completion summary

### 📁 **Documentation Structure**
- **[Guides](./docs/guides/)** - User guides and tutorials
- **[Setup](./docs/setup/)** - Configuration and installation
- **[Testing](./docs/testing/)** - Test documentation and results
- **[Summaries](./docs/summaries/)** - Sprint and completion reports
- **[Scripts](./docs/scripts/)** - Utility scripts for development
- **[Architecture](./docs/architecture.md)** - System design
- **[Sprints](./docs/sprints/)** - Sprint planning and reports
- **[Epics](./docs/epics/)** - Product backlog and epics

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key

### 5-Minute Setup

**1. Clone the repository**
```bash
git clone https://github.com/Mahad-Saffi/Atlas-AI-Scrum-Master.git
cd Atlas-AI-Scrum-Master
```

**2. Set up Backend**
```bash
cd backend
pip install -r requirements.txt

# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_key_here" > .env

# Start backend server
uvicorn main:app --reload --port 8000
```

**3. Set up Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

**4. Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**5. Login with Demo Account**
- Email: `demo@atlas.ai`
- Password: `demo123`

That's it! 🎉 See the [Quick Start Guide](./docs/guides/QUICK_START.md) for more details.

## 📊 Project Status

**🎉 PROJECT COMPLETE! 🎉**

- **Completion**: 100% (10/10 sprints) ✅
- **Story Points**: 94/94 (100%) ✅
- **Quality**: Production-ready ⭐⭐⭐⭐⭐
- **Status**: Ready for deployment

### ✅ **All Sprints Completed**
- **Sprint 1**: Foundation & Authentication ✅
- **Sprint 2**: Basic Conversational AI ✅
- **Sprint 3**: AI-Powered Plan Generation ✅
- **Sprint 4**: Task Board & Basic Workflow ✅
- **Sprint 5**: Automated Task Assignment & Notifications ✅
- **Sprint 6**: Delay Detection & Risk Management ✅
- **Sprint 7**: Real-time Chat Foundation ✅
- **Sprint 8**: Advanced Chat & Direct Messaging ✅
- **Sprint 9**: Issue Tracking & Triage ✅
- **Sprint 10**: UI Polish, Responsiveness & Accessibility ✅

### 🎯 **Complete Feature Set**
- ✅ AI-powered project planning with OpenAI GPT-4o-mini
- ✅ Intelligent task management with risk detection
- ✅ Real-time notifications and updates
- ✅ Team chat with channels and direct messaging
- ✅ Issue tracking and triage system
- ✅ Progress monitoring and analytics
- ✅ Beautiful, accessible UI with dark mode
- ✅ Mobile-responsive design
- ✅ Full authentication system
- ✅ WebSocket real-time communication

See [Project Complete Summary](./docs/summaries/PROJECT_COMPLETE.md) for full details.

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