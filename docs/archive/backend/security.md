# Security Architecture & Implementation

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Target Audience:** Backend Developers (Primary), DevOps Engineers (Infrastructure security)
- **Phase Relevance:** Phase 1 (Critical), Phase 3 (Security hardening)
- **Reading Time:** 15 minutes
- **Related:** [Architecture Overview](architecture.md), [API Design](api-design.md)

## Security Overview

### Security Classification
- **Data Classification:** Internal/Confidential
- **Compliance Requirements:** Basic data protection
- **Risk Level:** Medium (internal development tool)
- **Security Model:** Defense in depth with zero trust principles

### Core Security Principles
1. **Authentication First:** All API endpoints require valid authentication
2. **Least Privilege:** Users receive minimum necessary permissions
3. **Defense in Depth:** Multiple security layers protect against threats
4. **Input Validation:** All input sanitized and validated
5. **Audit Trail:** Comprehensive logging of security events
6. **Secure by Default:** Security controls enabled by default

## Authentication & Authorization

### GitHub OAuth 2.0 Integration

#### OAuth Configuration
```python
GITHUB_OAUTH_CONFIG = {
    "client_id": os.getenv("GITHUB_CLIENT_ID"),
    "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
    "scope": "user:email",
    "authorization_url": "https://github.com/login/oauth/authorize",
    "token_url": "https://github.com/login/oauth/access_token",
    "user_info_url": "https://api.github.com/user"
}
```

#### OAuth Flow Security
```python
# Secure OAuth state parameter generation
def generate_oauth_state():
    return secrets.token_urlsafe(32)

# CSRF protection with state validation
def validate_oauth_state(state_token, stored_state):
    return secrets.compare_digest(state_token, stored_state)
```

### JWT Token Management

#### Token Configuration
```python
JWT_CONFIG = {
    "algorithm": "HS256",
    "expiry": 900,  # 15 minutes
    "secret_key": os.getenv("JWT_SECRET_KEY"),  # 256-bit random key
    "issuer": "ai-scrum-master",
    "audience": "ai-scrum-users"
}
```

#### Secure Token Generation
```python
import jwt
from datetime import datetime, timedelta

def create_jwt_token(user_data: dict) -> str:
    payload = {
        "user_id": user_data["id"],
        "username": user_data["username"],
        "role": user_data["role"],
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(seconds=JWT_CONFIG["expiry"]),
        "iss": JWT_CONFIG["issuer"],
        "aud": JWT_CONFIG["audience"]
    }
    return jwt.encode(payload, JWT_CONFIG["secret_key"], algorithm=JWT_CONFIG["algorithm"])
```

#### Token Validation
```python
def validate_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            JWT_CONFIG["secret_key"],
            algorithms=[JWT_CONFIG["algorithm"]],
            audience=JWT_CONFIG["audience"],
            issuer=JWT_CONFIG["issuer"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

### Role-Based Access Control (RBAC)

#### User Roles
```python
USER_ROLES = {
    "developer": {
        "permissions": [
            "tasks:read",
            "tasks:update_own",
            "notifications:read_own",
            "chat:send",
            "chat:read",
            "triage:create",
            "triage:read"
        ]
    },
    "designer": {
        "permissions": [
            "tasks:read",
            "tasks:update_own",
            "notifications:read_own",
            "chat:send",
            "chat:read"
        ]
    },
    "tester": {
        "permissions": [
            "tasks:read",
            "tasks:update_own",
            "notifications:read_own",
            "chat:send",
            "chat:read",
            "triage:create",
            "triage:read"
        ]
    },
    "project_manager": {
        "permissions": [
            "tasks:*",
            "notifications:*",
            "chat:*",
            "triage:*",
            "users:read"
        ]
    },
    "admin": {
        "permissions": ["*"]  # Full access
    }
}
```

#### Permission Validation
```python
def check_permission(user_role: str, permission: str) -> bool:
    user_permissions = USER_ROLES.get(user_role, {}).get("permissions", [])
    
    # Check for admin wildcard
    if "*" in user_permissions:
        return True
    
    # Check for specific permission
    if permission in user_permissions:
        return True
    
    # Check for resource wildcard (e.g., "tasks:*")
    resource = permission.split(":")[0]
    resource_wildcard = f"{resource}:*"
    if resource_wildcard in user_permissions:
        return True
    
    return False
```

## Input Validation & Sanitization

### FastAPI Pydantic Models
```python
from pydantic import BaseModel, Field, validator
from typing import Optional
import re

class TaskCreateModel(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: str = Field(..., min_length=1, max_length=2000, description="Task description")
    assigned_role: str = Field(..., regex="^(developer|designer|tester|project_manager)$")
    assigned_user_id: Optional[int] = Field(None, ge=1)
    priority: int = Field(0, ge=0, le=10)
    epic_id: Optional[str] = Field(None, regex="^[a-zA-Z0-9_-]+$", max_length=50)
    
    @validator('title', 'description')
    def sanitize_text(cls, v):
        # Remove HTML tags and dangerous characters
        return re.sub(r'<[^>]*>', '', v).strip()
    
    @validator('assigned_role')
    def validate_role(cls, v):
        valid_roles = {'developer', 'designer', 'tester', 'project_manager'}
        if v not in valid_roles:
            raise ValueError('Invalid role')
        return v
```

### SQL Injection Prevention
```python
# Using SQLAlchemy async with parameterized queries
async def get_user_tasks(user_id: int, status: Optional[str] = None):
    query = select(Task).where(Task.assigned_user_id == user_id)
    
    if status:
        # Parameterized query prevents SQL injection
        query = query.where(Task.status == status)
    
    result = await db_session.execute(query)
    return result.scalars().all()
```

### Input Sanitization
```python
import html
import re
from bleach import clean

def sanitize_user_input(input_text: str) -> str:
    """Sanitize user input to prevent XSS and other attacks"""
    # Remove HTML tags
    cleaned = clean(input_text, tags=[], strip=True)
    
    # HTML escape remaining content
    escaped = html.escape(cleaned)
    
    # Remove any remaining dangerous patterns
    safe_text = re.sub(r'[<>"\']', '', escaped)
    
    return safe_text.strip()
```

## API Security

### Request Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Different limits for different endpoint types
@limiter.limit("5/minute")
async def auth_endpoints():
    pass

@limiter.limit("100/minute")
async def task_endpoints():
    pass

@limiter.limit("500/minute")
async def chat_endpoints():
    pass
```

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

CORS_CONFIG = {
    "allow_origins": ["http://localhost:3000"],  # Frontend origin only
    "allow_credentials": True,
    "allow_methods": ["GET", "POST", "PUT", "DELETE"],
    "allow_headers": ["Authorization", "Content-Type"],
    "max_age": 300  # Preflight cache duration
}
```

### Request/Response Security Headers
```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response

# Trusted host validation
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"])
```

## Database Security

### Connection Security
```python
DATABASE_CONFIG = {
    "url": f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    "connect_args": {
        "ssl": "require",  # Require SSL connection
        "server_settings": {
            "application_name": "ai-scrum-master",
        }
    },
    "pool_pre_ping": True,
    "echo": False  # Never log SQL in production
}
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY user_own_data ON users
FOR ALL TO application_user
USING (id = current_setting('app.user_id')::integer);

-- Task access based on assignment and role
CREATE POLICY task_access ON tasks
FOR SELECT TO application_user
USING (
    assigned_user_id = current_setting('app.user_id')::integer 
    OR assigned_role = current_setting('app.user_role')
    OR current_setting('app.user_role') IN ('project_manager', 'admin')
);

-- Notification access (own notifications only)
CREATE POLICY notification_access ON notifications
FOR ALL TO application_user
USING (user_id = current_setting('app.user_id')::integer);

-- Chat message access (sender, recipient, or admin)
CREATE POLICY chat_message_access ON chat_messages
FOR SELECT TO application_user
USING (
    sender_id = current_setting('app.user_id')::integer
    OR recipient_id = current_setting('app.user_id')::integer
    OR recipient_id IS NULL  -- Group messages
    OR current_setting('app.user_role') = 'admin'
);
```

### Database User Permissions
```sql
-- Create application-specific database user
CREATE USER ai_scrum_app WITH PASSWORD 'secure_generated_password';

-- Grant minimal required permissions
GRANT CONNECT ON DATABASE ai_scrum_master TO ai_scrum_app;
GRANT USAGE ON SCHEMA public TO ai_scrum_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ai_scrum_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ai_scrum_app;

-- Revoke dangerous permissions
REVOKE CREATE ON SCHEMA public FROM ai_scrum_app;
REVOKE ALL ON SCHEMA information_schema FROM ai_scrum_app;
REVOKE ALL ON SCHEMA pg_catalog FROM ai_scrum_app;
```

## Password & Secret Management

### Environment Variables
```bash
# .env file (never committed to version control)
JWT_SECRET_KEY=generate_256_bit_random_key_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DATABASE_URL=postgresql://user:pass@localhost/db
ENCRYPTION_KEY=another_256_bit_random_key
```

### Secret Generation
```python
import secrets
import base64

def generate_jwt_secret():
    """Generate a secure 256-bit key for JWT signing"""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()

def generate_encryption_key():
    """Generate a secure key for data encryption"""
    return secrets.token_urlsafe(32)
```

### Runtime Secret Validation
```python
def validate_secrets():
    """Validate all required secrets are present and secure"""
    required_secrets = [
        "JWT_SECRET_KEY",
        "GITHUB_CLIENT_SECRET", 
        "DATABASE_URL"
    ]
    
    for secret in required_secrets:
        value = os.getenv(secret)
        if not value:
            raise ValueError(f"Missing required secret: {secret}")
        
        if secret in ["JWT_SECRET_KEY", "GITHUB_CLIENT_SECRET"]:
            if len(value) < 32:
                raise ValueError(f"Secret {secret} is too short (minimum 32 characters)")
```

## Data Encryption

### Sensitive Data Encryption
```python
from cryptography.fernet import Fernet

class DataEncryption:
    def __init__(self, encryption_key: str):
        self.cipher = Fernet(encryption_key.encode())
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()

# Usage for sensitive fields
encryptor = DataEncryption(os.getenv("ENCRYPTION_KEY"))

def store_sensitive_data(user_id: int, sensitive_info: str):
    encrypted_info = encryptor.encrypt(sensitive_info)
    # Store encrypted_info in database
```

### Password Hashing
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

## WebSocket Security

### WebSocket Authentication
```python
class WebSocketAuth:
    @staticmethod
    async def authenticate_websocket(websocket: WebSocket, token: str):
        try:
            payload = validate_jwt_token(token)
            return payload
        except HTTPException:
            await websocket.close(code=4001, reason="Invalid token")
            return None

# WebSocket connection with authentication
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, token: str):
    user_data = await WebSocketAuth.authenticate_websocket(websocket, token)
    if not user_data:
        return
    
    # Verify user_id matches token
    if user_data["user_id"] != user_id:
        await websocket.close(code=4003, reason="User ID mismatch")
        return
    
    await websocket.accept()
    # Continue with authenticated WebSocket connection
```

### Message Validation
```python
def validate_websocket_message(message: dict, user_role: str) -> bool:
    """Validate incoming WebSocket messages"""
    required_fields = ["type", "data"]
    
    # Check required fields
    for field in required_fields:
        if field not in message:
            return False
    
    # Validate message type
    valid_types = ["chat_message", "task_update", "status_update"]
    if message["type"] not in valid_types:
        return False
    
    # Role-based message validation
    if message["type"] == "task_update" and user_role not in ["project_manager", "admin"]:
        return False
    
    return True
```

## Security Monitoring & Logging

### Security Event Logging
```python
import logging
from datetime import datetime

security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)

class SecurityLogger:
    @staticmethod
    def log_auth_attempt(username: str, success: bool, ip_address: str):
        event = {
            "event_type": "authentication_attempt",
            "username": username,
            "success": success,
            "ip_address": ip_address,
            "timestamp": datetime.utcnow().isoformat(),
        }
        security_logger.info(f"AUTH_ATTEMPT: {event}")
    
    @staticmethod
    def log_permission_denied(user_id: int, resource: str, action: str):
        event = {
            "event_type": "permission_denied",
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
        }
        security_logger.warning(f"PERMISSION_DENIED: {event}")
    
    @staticmethod
    def log_suspicious_activity(user_id: int, activity: str, details: dict):
        event = {
            "event_type": "suspicious_activity",
            "user_id": user_id,
            "activity": activity,
            "details": details,
            "timestamp": datetime.utcnow().isoformat(),
        }
        security_logger.error(f"SUSPICIOUS_ACTIVITY: {event}")
```

### Rate Limit Monitoring
```python
class RateLimitMonitor:
    def __init__(self):
        self.failed_attempts = {}
    
    def record_rate_limit_exceeded(self, ip_address: str):
        if ip_address not in self.failed_attempts:
            self.failed_attempts[ip_address] = []
        
        self.failed_attempts[ip_address].append(datetime.utcnow())
        
        # Check for suspicious pattern (>10 rate limit hits in 5 minutes)
        recent_attempts = [
            attempt for attempt in self.failed_attempts[ip_address]
            if (datetime.utcnow() - attempt).seconds < 300
        ]
        
        if len(recent_attempts) > 10:
            SecurityLogger.log_suspicious_activity(
                user_id=None,
                activity="excessive_rate_limiting",
                details={"ip_address": ip_address, "attempts": len(recent_attempts)}
            )
```

## Vulnerability Management

### Security Dependency Scanning
```python
# requirements-security.txt - Security-focused dependencies
safety==2.3.1
bandit==1.7.5
semgrep==1.38.0

# Regular security scans
# Command: safety check
# Command: bandit -r .
# Command: semgrep --config=auto
```

### Security Headers Validation
```python
def validate_security_headers(response):
    required_headers = [
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Strict-Transport-Security",
        "Content-Security-Policy"
    ]
    
    missing_headers = []
    for header in required_headers:
        if header not in response.headers:
            missing_headers.append(header)
    
    if missing_headers:
        SecurityLogger.log_suspicious_activity(
            user_id=None,
            activity="missing_security_headers",
            details={"missing_headers": missing_headers}
        )
```

## Incident Response

### Security Incident Detection
```python
class SecurityIncident:
    SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    
    @staticmethod
    def create_incident(incident_type: str, severity: str, details: dict):
        incident = {
            "id": f"SEC-{int(time.time())}",
            "type": incident_type,
            "severity": severity,
            "details": details,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "OPEN"
        }
        
        # Log incident
        security_logger.critical(f"SECURITY_INCIDENT: {incident}")
        
        # Send alert for HIGH/CRITICAL incidents
        if severity in ["HIGH", "CRITICAL"]:
            # Integration with alerting system
            send_security_alert(incident)
        
        return incident
```

### Automated Response Actions
```python
class AutomatedSecurity:
    @staticmethod
    async def block_suspicious_ip(ip_address: str, duration_minutes: int = 60):
        """Temporarily block suspicious IP addresses"""
        # Add to blocked IP list
        blocked_until = datetime.utcnow() + timedelta(minutes=duration_minutes)
        
        SecurityLogger.log_suspicious_activity(
            user_id=None,
            activity="ip_blocked",
            details={"ip_address": ip_address, "blocked_until": blocked_until.isoformat()}
        )
    
    @staticmethod
    async def disable_user_account(user_id: int, reason: str):
        """Disable user account for security reasons"""
        # Update user is_active to False
        # Log security action
        SecurityLogger.log_suspicious_activity(
            user_id=user_id,
            activity="account_disabled",
            details={"reason": reason}
        )
```

## Security Testing

### Automated Security Tests
```python
import pytest
from fastapi.testclient import TestClient

class TestSecurity:
    def test_authentication_required(self, client: TestClient):
        """Test that endpoints require authentication"""
        response = client.get("/api/v1/tasks")
        assert response.status_code == 401
    
    def test_invalid_token_rejected(self, client: TestClient):
        """Test that invalid tokens are rejected"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/v1/tasks", headers=headers)
        assert response.status_code == 401
    
    def test_sql_injection_prevention(self, client: TestClient):
        """Test SQL injection prevention"""
        malicious_input = "'; DROP TABLE users; --"
        response = client.post("/api/v1/tasks", json={
            "title": malicious_input,
            "description": "test",
            "assigned_role": "developer"
        })
        # Should not cause server error
        assert response.status_code in [400, 422]  # Validation error, not server error
    
    def test_xss_prevention(self, client: TestClient):
        """Test XSS prevention"""
        xss_payload = "<script>alert('xss')</script>"
        response = client.post("/api/v1/tasks", json={
            "title": xss_payload,
            "description": "test",
            "assigned_role": "developer"
        })
        # Check response doesn't contain unescaped script tags
        assert "<script>" not in response.text
```

### Manual Security Checklist
- [ ] All endpoints require authentication
- [ ] JWT tokens expire appropriately (15 minutes)
- [ ] User roles are properly enforced
- [ ] Input validation prevents SQL injection
- [ ] XSS protection is implemented
- [ ] CORS is properly configured
- [ ] Security headers are present
- [ ] Rate limiting is active
- [ ] Sensitive data is encrypted
- [ ] Database access is restricted
- [ ] Security logging is comprehensive
- [ ] WebSocket connections are authenticated

Ready for secure implementation! ���
