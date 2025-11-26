# 🔐 Authentication System Update

## Problem Solved

Fixed the OAuth CSRF state mismatch error by replacing GitHub OAuth with a simpler, more reliable email/password authentication system.

## New Authentication System

### Features
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Demo account for quick testing
- ✅ JWT tokens (7-day expiry)
- ✅ Bcrypt password hashing
- ✅ Beautiful hand-drawn UI

### Setup

1. **Install new dependencies**:
```bash
cd backend
pip install passlib[bcrypt] python-multipart email-validator
# or
pip install -r requirements.txt
```

2. **Restart backend**:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

3. **Access the app**:
```
http://localhost:5173
```

## Usage

### Option 1: Demo Account (Fastest)
1. Click "🎮 Try Demo Account" button
2. Automatically logs in as demo user
3. Start using the app immediately

**Demo Credentials**:
- Email: `demo@atlas.ai`
- Password: `demo123`

### Option 2: Create New Account
1. Click "Don't have an account? Register"
2. Enter username, email, password
3. Click "✨ Create Account"
4. Automatically logged in

### Option 3: Login with Existing Account
1. Enter email and password
2. Click "🚀 Sign In"

## API Endpoints

### POST /api/v1/auth/register
Register a new user
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar_url": "https://ui-avatars.com/api/?name=john_doe",
    "role": "developer"
  }
}
```

### POST /api/v1/auth/login
Login with existing account
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

Response: Same as register

### POST /api/v1/auth/demo-login
Quick demo login (no body required)

Response: Same as register

## Security Features

- ✅ **Bcrypt hashing**: Passwords are hashed with bcrypt (cost factor 12)
- ✅ **JWT tokens**: Secure token-based authentication
- ✅ **7-day expiry**: Tokens expire after 7 days
- ✅ **Email validation**: Email format validation
- ✅ **Password requirements**: Minimum 6 characters
- ✅ **Unique constraints**: Username and email must be unique

## Database Changes

### User Model Updates
```python
class User(Base):
    id = Column(Integer, primary_key=True)
    github_id = Column(String(50), nullable=True)  # Now optional
    username = Column(String(100), unique=True)    # Now unique
    email = Column(String(255), unique=True)
    password_hash = Column(String(255))            # NEW: For password auth
    avatar_url = Column(String(500))
    role = Column(String(50), default='developer')
    is_active = Column(Boolean, default=True)
```

## Migration

If you have existing users from GitHub OAuth, they will still work. The system supports both:
- GitHub OAuth users (github_id set, no password_hash)
- Email/password users (password_hash set, github_id null)

## Frontend Changes

### New Login Page
- `frontend/src/pages/SimpleLogin.tsx`
- Hand-drawn UI style
- Registration and login forms
- Demo account button
- Error handling

### Routes Updated
- `/` - Main app (requires auth)
- `/login` - New simple login page
- `/github-login` - Old GitHub OAuth (still available)

## Testing

### Test Registration
1. Go to http://localhost:5173
2. Click "Don't have an account? Register"
3. Fill in:
   - Username: test_user
   - Email: test@example.com
   - Password: test123
4. Click "Create Account"
5. Should redirect to dashboard

### Test Login
1. Go to http://localhost:5173
2. Enter:
   - Email: test@example.com
   - Password: test123
3. Click "Sign In"
4. Should redirect to dashboard

### Test Demo Account
1. Go to http://localhost:5173
2. Click "🎮 Try Demo Account"
3. Should immediately redirect to dashboard

## Troubleshooting

### "Username or email already registered"
- Try a different username or email
- Or login with existing credentials

### "Incorrect email or password"
- Check email spelling
- Check password (case-sensitive)
- Try demo account to verify system works

### "Module 'passlib' not found"
```bash
cd backend
pip install passlib[bcrypt]
```

### Database locked error
- Stop backend
- Delete `backend/test.db`
- Restart backend (will recreate database)

## Advantages Over GitHub OAuth

1. **No external dependencies**: Works without GitHub
2. **No CSRF issues**: No state management needed
3. **Faster testing**: Demo account for instant access
4. **Simpler setup**: No OAuth app configuration
5. **More control**: Full control over auth flow
6. **Better UX**: Single-page login experience

## Next Steps

- ✅ Authentication working
- ✅ Demo account available
- ✅ Registration and login functional
- ⏳ Optional: Add password reset
- ⏳ Optional: Add email verification
- ⏳ Optional: Add social login (Google, etc.)

---

**Status**: ✅ **WORKING**
**Commit**: `feat(auth): replace GitHub OAuth with simple email/password auth`
