from fastapi import FastAPI, Depends, HTTPException
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.config.database import SessionLocal, engine
from app.models import user as user_model
from app.api.v1 import ai as ai_router



app = FastAPI()

from app.models import Base
from app.config.database import engine

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "atlas-backend"}

from app.api.v1 import projects as projects_router

app.include_router(ai_router.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(projects_router.router, prefix="/api/v1/projects", tags=["projects"])

config = Config(".env")
app.add_middleware(SessionMiddleware, secret_key=config('SESSION_SECRET_KEY'))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db():
    async with SessionLocal() as session:
        yield session

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8000", "http://localhost:5173"],
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
    redirect_uri = config('GITHUB_REDIRECT_URI')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def github_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    user = await oauth.github.get('user', token=token)
    user_data = user.json()
    
    # Get user email
    emails = await oauth.github.get('user/emails', token=token)
    emails_data = emails.json()
    primary_email = next((email['email'] for email in emails_data if email['primary']), user_data.get('email', ''))
    
    result = await db.execute(select(user_model.User).filter(user_model.User.github_id == str(user_data['id'])))
    db_user = result.scalars().first()

    if not db_user:
        db_user = user_model.User(
            github_id=str(user_data['id']),
            username=user_data['login'],
            email=primary_email,
            avatar_url=user_data['avatar_url'],
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)

    user_role = db_user.role
    
    # Create JWT
    jwt_payload = {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "role": user_role,
        "avatar_url": db_user.avatar_url,
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    jwt_token = jwt.encode(jwt_payload, config('JWT_SECRET_KEY'), algorithm="HS256")
    from starlette.responses import RedirectResponse
    import json

    user_info = {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "avatar_url": db_user.avatar_url
    }

    # Redirect to frontend with token and user data
    return RedirectResponse(
        url=f"http://localhost:5173/auth/callback?token={jwt_token}&user={json.dumps(user_info)}"
    )

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
    

from app.core.security import get_current_user

@app.get("/users/me")
async def get_user(current_user: dict = Depends(get_current_user)):
    return current_user
