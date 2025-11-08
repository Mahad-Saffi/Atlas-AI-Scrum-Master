from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.models.task import Task
from app.config.database import SessionLocal
import uuid
from datetime import datetime

class TaskService:
    async def get_tasks_for_user_in_project(self, project_id: str, user_id: str) -> list:
        async with SessionLocal() as session:
            # Convert project_id to UUID, handling both formats
            try:
                if isinstance(project_id, str):
                    # Add hyphens if missing
                    if len(project_id) == 32 and '-' not in project_id:
                        project_id = f"{project_id[:8]}-{project_id[8:12]}-{project_id[12:16]}-{project_id[16:20]}-{project_id[20:]}"
                    project_uuid = uuid.UUID(project_id)
                else:
                    project_uuid = project_id
                
                result = await session.execute(
                    select(Task).where(Task.project_id == project_uuid)
                )
                tasks = result.scalars().all()
                
                # Convert to dict for JSON serialization
                return [
                    {
                        "id": str(task.id),
                        "title": task.title,
                        "description": task.description,
                        "status": task.status,
                        "assignee_id": task.assignee_id,
                        "project_id": str(task.project_id),
                        "order": task.order
                    }
                    for task in tasks
                ]
            except Exception as e:
                print(f"Error getting tasks: {e}")
                return []

    async def complete_task(self, task_id: str, user_id: str) -> dict:
        """
        Mark a task as complete and automatically assign the next task to the user.
        """
        try:
            async with SessionLocal() as session:
                # Convert task_id to UUID, handling both formats
                if isinstance(task_id, str):
                    # Add hyphens if missing
                    if len(task_id) == 32 and '-' not in task_id:
                        task_id = f"{task_id[:8]}-{task_id[8:12]}-{task_id[12:16]}-{task_id[16:20]}-{task_id[20:]}"
                    task_uuid = uuid.UUID(task_id)
                else:
                    task_uuid = task_id
                
                user_id_int = int(user_id) if isinstance(user_id, str) else user_id
                
                # Get the task
                result = await session.execute(
                    select(Task).where(Task.id == task_uuid)
                )
                task = result.scalars().first()
                
                if not task:
                    raise ValueError(f"Task not found with id: {task_id}")
                
                # Mark as complete
                task.status = "Done"
                # Don't set updated_at manually, let the database handle it
                
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
                    next_task.assignee_id = user_id_int
                    next_task.status = "In Progress"
                
                # Commit changes
                await session.commit()
                
                # Refresh to get updated values
                await session.refresh(task)
                if next_task:
                    await session.refresh(next_task)
                
                return {
                    "id": str(task.id),
                    "title": task.title,
                    "status": task.status,
                    "next_task": {
                        "id": str(next_task.id),
                        "title": next_task.title
                    } if next_task else None
                }
        except Exception as e:
            print(f"Error completing task: {e}")
            raise

task_service = TaskService()
