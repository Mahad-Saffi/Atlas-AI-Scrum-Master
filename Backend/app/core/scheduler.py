"""
Background task scheduler for periodic jobs
"""
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class BackgroundScheduler:
    def __init__(self):
        self.tasks = []
        self.running = False
    
    async def start(self):
        """Start the background scheduler"""
        if self.running:
            return
        
        self.running = True
        logger.info("🚀 Background scheduler started")
        
        # Start all scheduled tasks
        for task_func, interval, name in self.tasks:
            asyncio.create_task(self._run_periodic_task(task_func, interval, name))
    
    async def stop(self):
        """Stop the background scheduler"""
        self.running = False
        logger.info("🛑 Background scheduler stopped")
    
    def add_task(self, task_func, interval_seconds: int, name: str):
        """Add a periodic task"""
        self.tasks.append((task_func, interval_seconds, name))
        logger.info(f"📋 Scheduled task: {name} (every {interval_seconds}s)")
    
    async def _run_periodic_task(self, task_func, interval_seconds: int, name: str):
        """Run a task periodically"""
        while self.running:
            try:
                logger.info(f"⏰ Running scheduled task: {name}")
                await task_func()
                logger.info(f"✅ Completed task: {name}")
            except Exception as e:
                logger.error(f"❌ Error in scheduled task {name}: {e}")
            
            # Wait for the next interval
            await asyncio.sleep(interval_seconds)

# Global scheduler instance
scheduler = BackgroundScheduler()
