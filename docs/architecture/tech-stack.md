# Technical Stack Specification

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Related:** [Architecture Overview](architecture.md)
- **Target Audience:** All technical team members (Backend Developers, Frontend Developers, DevOps Engineers)
- **Phase Relevance:** Phase 1 (Critical), Phase 2-4 (Reference)
- **Reading Time:** 15 minutes

## Frontend Technology Stack

### Core Framework
- **React:** 18.2.0
  - **Rationale:** Industry standard, extensive ecosystem, excellent TypeScript support
  - **Features:** Hooks, Context API, Concurrent Rendering
  - **Build Tool:** Create React App 5.0.1 with TypeScript template

### TypeScript Configuration
- **TypeScript:** 5.2.2
  - **Strict Mode:** Enabled for type safety
  - **Target:** ES2022
  - **Module:** ESNext with bundler resolution

### State Management
- **Primary:** React Context + useReducer
  - **Rationale:** Built-in, sufficient for MVP complexity
  - **Pattern:** Context providers for user, tasks, notifications
- **Form State:** React Hook Form 7.45.4
  - **Validation:** Zod 3.22.2 for schema validation

### Styling & UI
- **CSS Framework:** Tailwind CSS 3.3.0
  - **Configuration:** Custom design tokens for branding
  - **Dark Mode:** Class-based dark mode support
- **Component Library:** Headless UI 1.7.17
  - **Accessibility:** WCAG 2.1 AA compliant components
- **Icons:** Heroicons 2.0.18

### HTTP & Communication
- **HTTP Client:** Axios 1.5.0
  - **Interceptors:** Request/response transformation
  - **Error Handling:** Centralized error processing
- **WebSocket:** Native WebSocket API
  - **Reconnection:** Custom retry logic
  - **Message Queue:** Local message buffering

### Development Tools
- **Linting:** ESLint 8.48.0 with TypeScript rules
- **Formatting:** Prettier 3.0.3
- **Testing:** Jest 29.6.4 + React Testing Library 13.4.0
- **Bundle Analysis:** webpack-bundle-analyzer 4.9.1

## Backend Technology Stack

### Core Framework
- **FastAPI:** 0.104.1
  - **Python Version:** 3.11.6 (required)
  - **ASGI Server:** Uvicorn 0.23.2
  - **Performance:** Async/await throughout
  - **Documentation:** Automatic OpenAPI generation

### Database Layer
- **Database:** PostgreSQL 15.4
  - **Driver:** asyncpg 0.28.3 (async PostgreSQL driver)
  - **ORM:** SQLAlchemy 2.0.21 (async core)
  - **Migrations:** Alembic 1.12.0
  - **Connection Pooling:** Built-in SQLAlchemy pooling

### Authentication & Security
- **OAuth:** Authlib 1.2.1 (GitHub OAuth integration)
- **JWT Tokens:** PyJWT 2.8.0
- **Password Hashing:** passlib 1.7.4 with bcrypt
- **CORS:** FastAPI built-in CORS middleware
- **Rate Limiting:** slowapi 0.1.8

### Real-Time Communication
- **WebSocket:** FastAPI native WebSocket support
- **Connection Management:** Custom connection manager
- **Message Broadcasting:** In-memory pub/sub pattern

### Background Tasks
- **Scheduler:** APScheduler 3.10.4
  - **Backend:** AsyncIOScheduler for async tasks
  - **Jobs:** Daily delay detection, cleanup tasks
- **Task Queue:** FastAPI BackgroundTasks (simple tasks)

### Validation & Serialization
- **Request Validation:** Pydantic 2.4.2
  - **Strict Validation:** Type coercion disabled
  - **Custom Validators:** Input sanitization
- **Response Models:** Pydantic BaseModel serialization

### Development Tools
- **Linting:** Ruff 0.0.292 (fast Python linter)
- **Formatting:** Black 23.7.0
- **Type Checking:** MyPy 1.5.1
- **Testing:** pytest 7.4.2 + pytest-asyncio 0.21.1

## Infrastructure & Deployment

### Containerization
- **Docker Engine:** 24.0.5
- **Docker Compose:** 2.21.0
  - **Services:** frontend, backend, database, nginx
  - **Networks:** Custom bridge network
  - **Volumes:** Database persistence, shared uploads

### Database Configuration
- **PostgreSQL:** 15.4 (official Docker image)
  - **Memory:** 256MB shared_buffers
  - **Connections:** max_connections = 100
  - **Logging:** Log slow queries > 1000ms

### Development Environment
- **Local Development:** Docker Compose override
- **Hot Reload:** Volume mounts for source code
- **Environment Variables:** .env file management
- **Health Checks:** Application readiness probes

## Package Management & Versioning

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "18.2.0",
    "@types/react": "18.2.21",
    "typescript": "5.2.2",
    "tailwindcss": "3.3.0",
    "axios": "1.5.0",
    "@headlessui/react": "1.7.17",
    "@heroicons/react": "2.0.18",
    "react-hook-form": "7.45.4",
    "zod": "3.22.2"
  }
}
```

### Backend Dependencies
```python
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.23.2
sqlalchemy[asyncio]==2.0.21
asyncpg==0.28.3
alembic==1.12.0
pydantic==2.4.2
authlib==1.2.1
PyJWT==2.8.0
passlib[bcrypt]==1.7.4
APScheduler==3.10.4
slowapi==0.1.8
python-multipart==0.0.6
```

## Development Environment Setup

### Prerequisites
- **Node.js:** 18.17.0 (LTS)
- **Python:** 3.11.6
- **Docker:** 24.0.5+
- **Docker Compose:** 2.21.0+

### Setup Commands
```bash
# Clone repository
git clone <repository-url>
cd ai-scrum-master

# Environment setup
cp .env.example .env
# Edit .env with required secrets

# Start development environment
docker-compose up -d

# Install development tools (optional)
npm install -g @angular/cli typescript
pip install black ruff mypy
```

### Environment Variables
```bash
# Backend Configuration
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/ai_scrum_master
JWT_SECRET_KEY=your-256-bit-secret-here
SESSION_SECRET_KEY=your-session-secret-here
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Frontend Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WS_BASE_URL=ws://localhost:8000
```

## Version Management Strategy

### Semantic Versioning
- **Major:** Breaking API changes
- **Minor:** New features, backward compatible
- **Patch:** Bug fixes, security updates

### Dependency Updates
- **Security Updates:** Immediate (within 24 hours)
- **Minor Updates:** Monthly review cycle
- **Major Updates:** Quarterly assessment
- **Lock Files:** Committed for reproducible builds

### Browser Support
- **Modern Browsers:** Last 2 versions of Chrome, Firefox, Safari, Edge
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **No Support:** Internet Explorer

## Performance Considerations

### Frontend Optimizations
- **Code Splitting:** Route-based lazy loading
- **Bundle Size:** Target < 500KB initial bundle
- **Caching:** Service Worker for static assets
- **Image Optimization:** WebP format with fallbacks

### Backend Optimizations
- **Database:** Connection pooling (5-10 connections)
- **Caching:** In-memory caching for frequent queries
- **Response Compression:** Gzip compression enabled
- **Async Operations:** Non-blocking I/O throughout

### Monitoring
- **Frontend:** Web Vitals, error tracking
- **Backend:** Response times, error rates
- **Database:** Query performance, connection usage
- **Infrastructure:** Resource utilization

## Security Hardening

### Dependency Security
- **Vulnerability Scanning:** Regular dependency audits
- **Updates:** Automated security patch updates
- **License Compliance:** MIT/BSD/Apache 2.0 preferred

### Runtime Security
- **Container Security:** Non-root user, minimal base images
- **Network Security:** Internal Docker networks only
- **Secrets Management:** Environment variables only
- **Input Validation:** Strict type checking and sanitization

Ready for implementation with this technology stack! ���️
