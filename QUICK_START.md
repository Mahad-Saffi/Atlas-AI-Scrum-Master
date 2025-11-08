# Atlas Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- Docker Desktop installed and running
- GitHub account for OAuth
- OpenAI API key (for AI features)

---

## Step 1: Clone and Configure

```bash
# Clone the repository
git clone https://github.com/Mahad-Saffi/Atlas-AI-Scrum-Master.git
cd Atlas-AI-Scrum-Master

# Copy environment template
cp backend/.env.example backend/.env
```

## Step 2: Set Up Environment Variables

Edit `backend/.env` with your credentials:

```env
# GitHub OAuth (Get from: https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback

# JWT Secret (Generate a random string)
JWT_SECRET_KEY=your_super_secret_jwt_key_here
SESSION_SECRET_KEY=your_session_secret_key_here

# OpenAI API Key (Get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key

# Database (Default values work for Docker)
DATABASE_URL=postgresql+asyncpg://ai_scrum_user:dev_password_change_in_production@db:5432/ai_scrum_master
```

## Step 3: Start the Application

```bash
# Build and start all services
docker-compose up --build

# Wait for services to be healthy (check logs)
# You should see:
# ✓ Database ready
# ✓ Backend started on port 8000
# ✓ Frontend started on port 8080
```

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000
- **Health Check:** http://localhost:8000/health

---

## 🎯 First Time Usage

### 1. Sign In
- Click "Continue with GitHub"
- Authorize the application
- You'll be redirected back to Atlas

### 2. Create a Project
- Navigate to "Create Project"
- Start chatting with the AI
- Describe your project goals
- AI will suggest team members
- AI will generate a complete project plan

### 3. Manage Tasks
- View your tasks on the Task Board
- Click "Mark as Complete" when done
- Next task is automatically assigned to you

---

## 🛠️ Development Commands

### Backend

```bash
# Run backend tests
docker exec -it ai_scrum_backend pytest

# Check backend logs
docker logs ai_scrum_backend -f

# Run migrations
docker exec -it ai_scrum_backend alembic upgrade head

# Access backend shell
docker exec -it ai_scrum_backend bash
```

### Frontend

```bash
# Check frontend logs
docker logs ai_scrum_frontend -f

# Run frontend tests
docker exec -it ai_scrum_frontend npm test

# Access frontend shell
docker exec -it ai_scrum_frontend sh
```

### Database

```bash
# Access PostgreSQL
docker exec -it ai_scrum_db psql -U ai_scrum_user -d ai_scrum_master

# View tables
\dt

# Query users
SELECT * FROM users;
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: Deletes data)
docker-compose down -v

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check database is running
docker ps | grep ai_scrum_db

# Check database logs
docker logs ai_scrum_db

# Restart database
docker restart ai_scrum_db
```

### Frontend Can't Connect to Backend

1. Check CORS settings in `backend/main.py`
2. Verify `VITE_API_URL` in frontend
3. Check network in `docker-compose.yml`

---

## 📚 Key Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/callback` - OAuth callback
- `GET /users/me` - Get current user
- `POST /auth/refresh` - Refresh JWT token

### Projects
- `POST /api/v1/ai/discover` - Conversational project creation
- `GET /api/v1/projects/{id}/tasks` - Get project tasks

### Tasks
- `POST /api/v1/projects/tasks/{id}/complete` - Complete task

### Health
- `GET /health` - Service health check

---

## 🎨 Project Structure

```
Atlas-AI-Scrum-Master/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration
│   │   └── core/            # Security & utilities
│   ├── alembic/             # Database migrations
│   └── main.py              # FastAPI app
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API clients
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
├── docs/                    # Documentation
└── docker-compose.yml       # Docker configuration
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth App ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth Secret |
| `GITHUB_REDIRECT_URI` | Yes | OAuth callback URL |
| `JWT_SECRET_KEY` | Yes | JWT signing key |
| `SESSION_SECRET_KEY` | Yes | Session encryption key |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

---

## 📖 Next Steps

1. **Read the Documentation**
   - `docs/IMPLEMENTATION_STATUS.md` - Current progress
   - `docs/architecture.md` - System architecture
   - `WORK_COMPLETED.md` - Recent changes

2. **Explore the Code**
   - Start with `backend/main.py`
   - Check out `frontend/src/App.tsx`
   - Review models in `backend/app/models/`

3. **Start Contributing**
   - Pick a task from `docs/epics/full-backlog.md`
   - Create a feature branch
   - Submit a pull request

---

## 💬 Need Help?

- Check the logs: `docker-compose logs -f`
- Review documentation in `docs/`
- Check GitHub issues
- Contact the team

---

**Happy Coding! 🚀**
