from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from starlette.config import Config
import os

# Try to load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
config = Config(env_path if os.path.exists(env_path) else ".env")
DATABASE_URL = config("DATABASE_URL", default="sqlite+aiosqlite:///./atlas.db")

engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

from app.models.user import Base