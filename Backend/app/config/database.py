from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from starlette.config import Config

config = Config(".env")
DATABASE_URL = config("DATABASE_URL")

engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

from app.models.user import Base