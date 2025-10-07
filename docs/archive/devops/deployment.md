# Deployment Guide & Infrastructure

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Related:** [Architecture Overview](architecture.md), [Tech Stack](tech-stack.md)
- **Target Audience:** DevOps Engineers (Primary), Backend Developers (Setup)
- **Phase Relevance:** Phase 1 (Setup), Phase 3 (Production readiness), Phase 4 (Deployment)
- **Reading Time:** 15 minutes

## Deployment Overview

### Deployment Strategy
- **Environment:** Localhost-only development deployment (NFR1 compliance)
- **Containerization:** Docker Compose for multi-service orchestration
- **Database:** PostgreSQL with persistent data volumes
- **Reverse Proxy:** Nginx for routing and static file serving
- **Health Monitoring:** Built-in health checks and status endpoints

### Infrastructure Components
- **Frontend:** React app served via Nginx
- **Backend:** FastAPI application server
- **Database:** PostgreSQL with data persistence
- **WebSocket:** Real-time communication support
- **Monitoring:** Health checks and logging

## Docker Configuration

### Project Structure
```
docker/
├── docker-compose.yml          # Main orchestration file
├── docker-compose.override.yml # Development overrides
├── .env                        # Environment variables
├── nginx/
│   ├── Dockerfile             # Custom Nginx image
│   ├── nginx.conf             # Main Nginx configuration
│   └── conf.d/
│       └── default.conf       # Site-specific configuration
├── backend/
│   ├── Dockerfile             # Backend container definition
│   ├── requirements.txt       # Python dependencies
│   └── entrypoint.sh          # Container startup script
└── frontend/
    ├── Dockerfile             # Frontend container definition
    ├── package.json           # Node.js dependencies
    └── nginx.conf             # Production Nginx config
```

### Main Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15.4-alpine
    container_name: ai_scrum_db
    environment:
      POSTGRES_DB: ai_scrum_master
      POSTGRES_USER: ${DB_USER:-ai_scrum_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dev_password_change_in_production}
      POSTGRES_INITDB_ARGS: --auth-host=scram-sha-256
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-scripts:/docker-entrypoint-initdb.d
    networks:
      - ai_scrum_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-ai_scrum_user} -d ai_scrum_master"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

  # Redis Cache (for sessions and real-time features)
  redis:
    image: redis:7.2-alpine
    container_name: ai_scrum_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ai_scrum_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  # FastAPI Backend
  backend:
    build:
      context: .
      dockerfile: docker/backend/Dockerfile
      target: development
    container_name: ai_scrum_backend
    environment:
      - DATABASE_URL=postgresql+asyncpg://${DB_USER:-ai_scrum_user}:${DB_PASSWORD:-dev_password_change_in_production}@db:5432/ai_scrum_master
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
      - ENVIRONMENT=development
      - CORS_ORIGINS=http://localhost:3000,http://localhost:8080
    ports:
      - "8000:8000"
    volumes:
      - .:/app
      - backend_logs:/app/logs
    networks:
      - ai_scrum_network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  # React Frontend
  frontend:
    build:
      context: .
      dockerfile: docker/frontend/Dockerfile
      target: development
    container_name: ai_scrum_frontend
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api/v1
      - REACT_APP_WS_URL=ws://localhost:8000/ws
      - REACT_APP_ENVIRONMENT=development
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - ai_scrum_network
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    build:
      context: ./docker/nginx
      dockerfile: Dockerfile
    container_name: ai_scrum_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/conf.d:/etc/nginx/conf.d
      - nginx_logs:/var/log/nginx
    networks:
      - ai_scrum_network
    depends_on:
      - frontend
      - backend
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  backend_logs:
    driver: local
  nginx_logs:
    driver: local

networks:
  ai_scrum_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Backend Dockerfile
```dockerfile
# docker/backend/Dockerfile
FROM python:3.11.6-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
        curl \
        netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Create application user
RUN useradd --create-home --shell /bin/bash app

# Set work directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base as development

# Install development dependencies
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy entrypoint script
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy application code
COPY . .

# Change ownership to app user
RUN chown -R app:app /app
USER app

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base as production

# Copy application code
COPY . .

# Copy entrypoint script
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Change ownership to app user
RUN chown -R app:app /app
USER app

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Backend Entrypoint Script
```bash
#!/bin/bash
# docker/backend/entrypoint.sh

set -e

echo "Starting AI Scrum Master Backend..."

# Wait for database
echo "Waiting for database..."
while ! nc -z db 5432; do
    sleep 1
done
echo "Database is ready!"

# Wait for Redis
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
    sleep 1
done
echo "Redis is ready!"

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Create initial data if needed
if [ "$ENVIRONMENT" = "development" ]; then
    echo "Creating development seed data..."
    python -m app.scripts.seed_dev_data
fi

# Start the application
echo "Starting FastAPI application..."
exec "$@"
```

### Frontend Dockerfile
```dockerfile
# docker/frontend/Dockerfile
FROM node:18.17.1-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Development stage
FROM base as development

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY frontend/ .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM base as build

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY frontend/ .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine as production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# docker/nginx/conf.d/default.conf
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

# HTTP Server
server {
    listen 80;
    server_name localhost;
    client_max_body_size 20M;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Frontend routing
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle client-side routing
        try_files $uri $uri/ @frontend;
    }

    location @frontend {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API routing
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # API-specific settings
        proxy_read_timeout 300s;
        proxy_connect_timeout 10s;
    }

    # WebSocket routing
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket-specific settings
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Environment Configuration

### Environment Variables
```bash
# .env file - NEVER commit to version control
# Database Configuration
DB_USER=ai_scrum_user
DB_PASSWORD=secure_random_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_scrum_master

# JWT Configuration
JWT_SECRET_KEY=generate_secure_256_bit_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRY=900

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Application Settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:8080

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Environment Validation
```python
# app/config.py
import os
from typing import List
from pydantic import BaseSettings, validator

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiry: int = 900
    
    # GitHub OAuth
    github_client_id: str
    github_client_secret: str
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Application
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    @validator('jwt_secret_key')
    def validate_jwt_secret(cls, v):
        if len(v) < 32:
            raise ValueError('JWT secret key must be at least 32 characters')
        return v
    
    class Config:
        env_file = ".env"

# Create global settings instance
settings = Settings()
```

## Deployment Commands

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd ai-scrum-master

# Copy environment template
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Development Deployment
```bash
# Start with rebuilding
docker-compose up --build -d

# Start specific services
docker-compose up db redis -d
docker-compose up backend -d
docker-compose up frontend -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create development user
docker-compose exec backend python -m app.scripts.create_dev_user

# View service status
docker-compose ps

# Check service health
docker-compose exec backend curl -f http://localhost:8000/health
docker-compose exec frontend curl -f http://localhost:3000
```

### Production Deployment
```bash
# Use production override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale backend for load
docker-compose up --scale backend=3 -d

# Update without downtime
docker-compose pull
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend
```

## Database Management

### Database Initialization
```sql
-- docker/init-scripts/01-init.sql
-- This script runs automatically when the database container starts

-- Create application user with limited permissions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ai_scrum_app') THEN
        CREATE USER ai_scrum_app WITH PASSWORD 'app_user_password';
    END IF;
END
$$;

-- Grant necessary permissions
GRANT CONNECT ON DATABASE ai_scrum_master TO ai_scrum_app;
GRANT USAGE ON SCHEMA public TO ai_scrum_app;
GRANT CREATE ON SCHEMA public TO ai_scrum_app;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Migration Management
```bash
# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Add new table"

# Run migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1

# View migration history
docker-compose exec backend alembic history

# Reset database (development only)
docker-compose down -v
docker-compose up -d
```

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U ai_scrum_user -d ai_scrum_master > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T db psql -U ai_scrum_user -d ai_scrum_master < backup_20250925_120000.sql

## Monitoring & Health Checks

### Application Health Endpoints
```python
# app/health.py - Health check endpoints
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from datetime import datetime

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AI Scrum Master API"
    }

@router.get("/db")
async def database_health(db: Session = Depends(get_db)):
    """Database connectivity health check."""
    try:
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unhealthy: {str(e)}")
```

### Monitoring Dashboard
```bash
#!/bin/bash
# monitor.sh - System monitoring script
echo "=== AI Scrum Master System Status ==="
echo "Timestamp: $(date)"
echo

# Check container health
echo "Container Status:"
docker-compose ps

echo -e "\nHealth Checks:"
# API health
curl -s http://localhost/health | jq '.'

echo -e "\nDatabase health:"
curl -s http://localhost/health/db | jq '.'

echo -e "\nSystem Resources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

## Security Hardening

### Production Security Configuration
```python
# app/config/security.py - Security configuration
from pydantic import BaseSettings
from typing import List

class SecuritySettings(BaseSettings):
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-here"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    ALLOWED_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    ALLOWED_HEADERS: List[str] = ["*"]
    
    # Security Headers
    HSTS_MAX_AGE: int = 31536000  # 1 year
    CONTENT_TYPE_NOSNIFF: bool = True
    X_FRAME_OPTIONS: str = "DENY"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        case_sensitive = True
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Check database status
docker-compose logs db

# Verify database connectivity
docker exec -it ai_scrum_db psql -U scrum_user -d scrum_db -c "SELECT version();"

# Reset database if corrupted
docker-compose down -v
docker-compose up -d db
# Wait for database to initialize, then:
docker-compose up -d
```

#### 2. WebSocket Connection Problems
```bash
# Check WebSocket endpoint
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Host: localhost:8000" \
  -H "Origin: http://localhost:3000" \
  http://localhost:8000/ws

# Test direct backend WebSocket
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://localhost:8000/ws
```

#### 3. Authentication Issues
```bash
# Verify GitHub OAuth configuration
curl -X GET "http://localhost:8000/auth/github" -L

# Check JWT token validation
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/users/me

# Debug OAuth callback
docker-compose logs backend | grep -i oauth
```

#### 4. Performance Issues
```bash
# Monitor container resources
docker stats

# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost/api/v1/tasks"
```

### Emergency Recovery
```bash
#!/bin/bash
# emergency-recovery.sh - Emergency system recovery

echo "Starting emergency recovery..."

# Stop all services
docker-compose down

# Clean up containers and volumes
docker system prune -f
docker volume prune -f

# Backup database if possible
if docker volume inspect ai-scrum_postgres-data >/dev/null 2>&1; then
    echo "Creating database backup..."
    docker run --rm -v ai-scrum_postgres-data:/data -v $(pwd)/backup:/backup alpine \
      tar czf /backup/postgres-backup-$(date +%Y%m%d_%H%M%S).tar.gz /data
fi

# Restart services
echo "Restarting services..."
docker-compose up -d --build

# Wait for services to start
echo "Waiting for services to initialize..."
sleep 30

# Health check
echo "Performing health check..."
curl -f http://localhost/health || echo "WARNING: Health check failed"

echo "Emergency recovery complete."
echo "Check logs if issues persist: docker-compose logs"
```

---

Ready for production deployment! ���
