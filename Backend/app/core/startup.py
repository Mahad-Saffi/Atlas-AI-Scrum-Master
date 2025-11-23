"""
Startup checks and database initialization
"""
from sqlalchemy import inspect, text
from app.config.database import engine, SessionLocal
from app.models.user import Base
import logging

logger = logging.getLogger(__name__)

async def check_database_schema():
    """Check if database schema is up to date"""
    try:
        async with engine.begin() as conn:
            # Check if tables exist
            def check_tables(connection):
                inspector = inspect(connection)
                return inspector.get_table_names()
            
            tables = await conn.run_sync(check_tables)
            
            if not tables:
                logger.info("No tables found. Creating database schema...")
                await conn.run_sync(Base.metadata.create_all)
                logger.info("✅ Database schema created successfully")
                return True
            
            # Check if users table has password_hash column
            def check_columns(connection):
                inspector = inspect(connection)
                if 'users' in inspector.get_table_names():
                    columns = [col['name'] for col in inspector.get_columns('users')]
                    return columns
                return []
            
            columns = await conn.run_sync(check_columns)
            
            if 'users' in tables and 'password_hash' not in columns:
                logger.warning("⚠️  Database schema outdated. Adding password_hash column...")
                await conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))
                await conn.commit()
                logger.info("✅ Database schema updated successfully")
            
            logger.info(f"✅ Database check passed. Tables: {', '.join(tables)}")
            return True
            
    except Exception as e:
        logger.error(f"❌ Database check failed: {e}")
        return False

async def verify_database_connection():
    """Verify database connection is working"""
    try:
        async with SessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
            logger.info("✅ Database connection verified")
            return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False

async def startup_checks():
    """Run all startup checks"""
    logger.info("🚀 Running startup checks...")
    
    # Check database connection
    if not await verify_database_connection():
        raise Exception("Database connection failed")
    
    # Check database schema
    if not await check_database_schema():
        raise Exception("Database schema check failed")
    
    logger.info("✅ All startup checks passed!")
    return True
