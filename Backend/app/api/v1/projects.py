from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.task_service import task_service

router = APIRouter()

@router.get("/{project_id}/tasks")
async def get_project_tasks(project_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    tasks = await task_service.get_tasks_for_user_in_project(project_id, user_id)
    return tasks

@router.post("/tasks/{task_id}/complete")
async def complete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Mark a task as complete and trigger automated task assignment"""
    task = await task_service.complete_task(task_id, current_user['id'])
    return {"message": "Task completed successfully", "task": task}
