from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.models.task import Task
from app.config.database import SessionLocal
import uuid
from datetime import datetime

class TaskService:
    async def get_tasks_for_user_in_project(self, project_id: str, user_id: str) -> list[Task]:
        async with SessionLocal() as session:
            result = await session.execute(
                select(Task).where(Task.project_id == project_id, Task.assignee_id == user_id)
            )
            tasks = result.scalars().all()
            return tasks

    async def complete_task(self, task_id: str, user_id: str) -> dict:
        """
        Mark a task as complete and automatically assign the next task to the user.
        """
        async with SessionLocal() as session:
            async with session.begin():
                # Convert string IDs to UUID
                task_uuid = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
                user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
                
                # Get the task
                result = await session.execute(
                    select(Task).where(Task.id == task_uuid)
                )
                task = result.scalars().first()
                
                if not task:
                    raise ValueError("Task not found")
                
                # Mark as complete
                task.status = "Done"
                task.updated_at = datetime.utcnow()
                
                # Find next unassigned task in the same project
                next_task_result = await session.execute(
                    select(Task).where(
                        and_(
                            Task.project_id == task.project_id,
                            Task.status == "To Do",
                            Task.assignee_id.is_(None)
                        )
                    ).order_by(Task.order).limit(1)
                )
                next_task = next_task_result.scalars().first()
                
                # Auto-assign next task to the same user
                if next_task:
                    next_task.assignee_id = user_uuid
                    next_task.status = "In Progress"
                
                await session.commit()
                
                return {
                    "id": str(task.id),
                    "title": task.title,
                    "status": task.status,
                    "next_task": {
                        "id": str(next_task.id),
                        "title": next_task.title
                    } if next_task else None
                }

task_service = TaskService()
