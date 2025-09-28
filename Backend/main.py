from fastapi import FastAPI, Depends, HTTPException
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta

app = FastAPI(root_path="/api/v1")

config = Config(".env")
app.add_middleware(SessionMiddleware, secret_key=config('SESSION_SECRET_KEY'))

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth(config)
oauth.register(
    name='github',
    client_id=config('GITHUB_CLIENT_ID'),
    client_secret=config('GITHUB_CLIENT_SECRET'),
    authorize_url='https://github.com/login/oauth/authorize',
    access_token_url='https://github.com/login/oauth/access_token',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/auth/github")
async def github_login(request: Request):
    redirect_uri = config('GITHUB_REDIRECT_URI', default='http://localhost:8000/api/v1/auth/callback')
    return await oauth.github.authorize_redirect(request, redirect_uri) # type: ignore

@app.get("/auth/callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request) # type: ignore
    user = await oauth.github.get('user', token=token)# type: ignore
    user_data = user.json()
    
    # Get user email
    emails = await oauth.github.get('user/emails', token=token) # type: ignore
    emails_data = emails.json()
    primary_email = next((email['email'] for email in emails_data if email['primary']), user_data.get('email', ''))
    
    # Assign role based on user (can be enhanced with database lookup later)
    # For now, default to developer role - enhance with proper role mapping
    user_role = "developer"  # TODO: Implement proper role assignment based on team members
    
    # Create JWT
    jwt_payload = {
        "id": user_data["id"],
        "username": user_data["login"],
        "email": primary_email,
        "role": user_role,
        "avatar_url": user_data["avatar_url"],
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    jwt_token = jwt.encode(jwt_payload, config('JWT_SECRET_KEY'), algorithm="HS256")
    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "expires_in": 900,
        "user": {
            "id": user_data["id"],
            "username": user_data["login"],
            "email": primary_email,
            "avatar_url": user_data["avatar_url"]
        }
    }

@app.post("/auth/refresh")
async def refresh_token(request: Request):
    token = request.headers.get("Authorization").split(" ")[1] # type: ignore
    try:
        payload = jwt.decode(token, config('JWT_SECRET_KEY'), algorithms=["HS256"])
        new_payload = {**payload, "exp": datetime.utcnow() + timedelta(minutes=15)}
        new_token = jwt.encode(new_payload, config('JWT_SECRET_KEY'), algorithm="HS256")
        return {"access_token": new_token, "expires_in": 900}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, config('JWT_SECRET_KEY'), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/users/me")
async def get_user(current_user: dict = Depends(get_current_user)):
    return current_user
