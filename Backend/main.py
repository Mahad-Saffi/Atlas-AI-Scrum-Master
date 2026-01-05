from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import SessionLocal, engine
from app.api.v1 import ai as ai_router



app = FastAPI()

# Add CORS middleware FIRST (before routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.models import Base
from app.config.database import engine
from app.core.startup import startup_checks
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("startup")
async def startup():
    """Run startup checks and initialize database"""
    try:
        # Run comprehensive startup checks
        await startup_checks()
        
        # Start background scheduler
        from app.core.scheduler import scheduler
        from app.services.risk_service import risk_service
        
        # Add risk detection task (runs every hour = 3600 seconds)
        async def run_risk_detection():
            """Periodic risk detection task"""
            try:
                result = await risk_service.detect_delays_and_update_risks()
                logging.info(f"Risk detection: {result['high_risk']} high, {result['medium_risk']} medium risks found")
            except Exception as e:
                logging.error(f"Risk detection failed: {e}")
        
        scheduler.add_task(run_risk_detection, 3600, "Risk Detection")  # Every hour
        await scheduler.start()
        
        # Run risk detection immediately on startup
        logging.info("Running initial risk detection...")
        await run_risk_detection()
        
    except Exception as e:
        logging.error(f"❌ Startup failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    from app.core.scheduler import scheduler
    await scheduler.stop()

@app.get("/health")
async def health_check():
    """Comprehensive health check"""
    from sqlalchemy import text
    
    health_status = {
        "status": "healthy",
        "service": "atlas-backend",
        "database": "unknown",
        "checks": {}
    }
    
    # Check database connection
    try:
        async with SessionLocal() as session:
            await session.execute(text("SELECT 1"))
            health_status["database"] = "connected"
            health_status["checks"]["database"] = "✅ OK"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = "disconnected"
        health_status["checks"]["database"] = f"❌ Error: {str(e)}"
    
    # Check if tables exist
    try:
        from sqlalchemy import inspect
        async with engine.begin() as conn:
            def get_tables(connection):
                inspector = inspect(connection)
                return inspector.get_table_names()
            
            tables = await conn.run_sync(get_tables)
            health_status["checks"]["tables"] = f"✅ {len(tables)} tables"
            health_status["tables_count"] = len(tables)
    except Exception as e:
        health_status["checks"]["tables"] = f"❌ Error: {str(e)}"
    
    return health_status

from app.api.v1 import projects as projects_router
from app.api.v1 import notifications as notifications_router
from app.api.v1 import chat as chat_router
from app.api.v1 import auth as auth_router
from app.api.v1 import issues as issues_router
from app.api.v1 import organizations as organizations_router
from app.api.v1 import ai_automation as ai_automation_router

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(ai_router.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(projects_router.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(notifications_router.router, prefix="/api/v1/notifications", tags=["notifications"])
app.include_router(chat_router.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(issues_router.router, prefix="/api/v1/issues", tags=["issues"])
app.include_router(organizations_router.router, prefix="/api/v1/organizations", tags=["organizations"])
app.include_router(ai_automation_router.router, prefix="/api/v1/ai-automation", tags=["ai-automation"])

@app.get("/")
async def read_root():
    return {"message": "Atlas AI Scrum Master API", "version": "1.0.0", "status": "running"}

from app.core.security import get_current_user

@app.get("/users/me")
async def get_user(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user
