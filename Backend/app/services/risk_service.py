from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.models.task import Task
from app.config.database import SessionLocal
from datetime import datetime, timedelta
from app.services.notification_service import notification_service

class RiskService:
    def calculate_task_risk(self, task: Task) -> str:
        """
        Calculate risk level for a task based on:
        - Due date proximity
        - Progress vs time elapsed
        - Status
        - Estimate vs actual progress
        """
        if task.status == 'Done':
            return 'low'
        
        risk_score = 0
        progress = task.progress_percentage if task.progress_percentage is not None else 0
        
        # Check due date
        if task.due_date:
            now = datetime.utcnow()
            days_until_due = (task.due_date.replace(tzinfo=None) - now).days
            
            if days_until_due < 0:
                # Overdue - CRITICAL
                risk_score += 60
            elif days_until_due == 0:
                # Due today
                risk_score += 40
            elif days_until_due == 1:
                # Due tomorrow
                risk_score += 30
            elif days_until_due <= 3:
                # Due within 3 days
                risk_score += 20
            elif days_until_due <= 7:
                # Due within a week
                risk_score += 10
            
            # Check progress vs time remaining
            if days_until_due > 0 and task.created_at:
                # Calculate expected progress based on time elapsed
                total_time = (task.due_date.replace(tzinfo=None) - task.created_at.replace(tzinfo=None)).days
                elapsed_time = (now - task.created_at.replace(tzinfo=None)).days
                
                if total_time > 0:
                    expected_progress = (elapsed_time / total_time) * 100
                    progress_gap = expected_progress - progress
                    
                    # If we're behind schedule
                    if progress_gap > 50:
                        risk_score += 30
                    elif progress_gap > 30:
                        risk_score += 20
                    elif progress_gap > 15:
                        risk_score += 10
        else:
            # No due date set - moderate risk
            if task.status == 'In Progress':
                risk_score += 15
            elif task.status == 'To Do':
                risk_score += 10
        
        # Check progress for in-progress tasks
        if task.status == 'In Progress':
            if progress == 0:
                # Started but no progress - stuck task
                risk_score += 25
            elif progress < 25:
                risk_score += 15
            elif progress < 50:
                risk_score += 10
        
        # Check if task is not started but should be
        if task.status == 'To Do' and task.due_date:
            now = datetime.utcnow()
            days_until_due = (task.due_date.replace(tzinfo=None) - now).days
            if days_until_due <= 2:
                # Not started and due very soon
                risk_score += 30
            elif days_until_due <= 5:
                risk_score += 15
        
        # Determine risk level
        if risk_score >= 50:
            return 'high'
        elif risk_score >= 25:
            return 'medium'
        else:
            return 'low'

    async def detect_delays_and_update_risks(self) -> dict:
        """
        Scan all active tasks and update risk levels.
        Send notifications for high-risk tasks.
        """
        notifications_to_send = []
        
        async with SessionLocal() as session:
            # Get all non-completed tasks
            result = await session.execute(
                select(Task).where(Task.status.in_(['To Do', 'In Progress']))
            )
            tasks = result.scalars().all()
            
            high_risk_count = 0
            medium_risk_count = 0
            
            for task in tasks:
                old_risk = task.risk_level
                new_risk = self.calculate_task_risk(task)
                
                # Update risk level if changed
                if old_risk != new_risk:
                    task.risk_level = new_risk
                    
                    # Queue notification if risk increased to high
                    if new_risk == 'high' and old_risk != 'high' and task.assignee_id:
                        notifications_to_send.append({
                            'user_id': task.assignee_id,
                            'title': task.title
                        })
                
                if new_risk == 'high':
                    high_risk_count += 1
                elif new_risk == 'medium':
                    medium_risk_count += 1
            
            await session.commit()
        
        # Send notifications outside session context
        notifications_sent = 0
        for notif in notifications_to_send:
            try:
                await notification_service.create_notification(
                    user_id=notif['user_id'],
                    notification_type='task_at_risk',
                    title='⚠️ Task At Risk',
                    message=f'Task "{notif["title"]}" is at high risk of delay',
                    link='/task-board'
                )
                notifications_sent += 1
            except Exception as e:
                print(f"Error sending notification: {e}")
        
        return {
            'tasks_scanned': len(tasks),
            'high_risk': high_risk_count,
            'medium_risk': medium_risk_count,
            'notifications_sent': notifications_sent
        }

    async def get_project_risks(self, project_id: str) -> dict:
        """Get risk summary for a project"""
        async with SessionLocal() as session:
            import uuid
            
            # Convert project_id to UUID
            if isinstance(project_id, str):
                if len(project_id) == 32 and '-' not in project_id:
                    project_id = f"{project_id[:8]}-{project_id[8:12]}-{project_id[12:16]}-{project_id[16:20]}-{project_id[20:]}"
                project_uuid = uuid.UUID(project_id)
            else:
                project_uuid = project_id
            
            result = await session.execute(
                select(Task).where(
                    and_(
                        Task.project_id == project_uuid,
                        Task.status.in_(['To Do', 'In Progress'])
                    )
                )
            )
            tasks = result.scalars().all()
            
            # Recalculate risk for all tasks to ensure accuracy
            for task in tasks:
                task.risk_level = self.calculate_task_risk(task)
            
            await session.commit()
            
            high_risk = [t for t in tasks if t.risk_level == 'high']
            medium_risk = [t for t in tasks if t.risk_level == 'medium']
            low_risk = [t for t in tasks if t.risk_level == 'low']
            
            # Build at-risk tasks with detailed information
            at_risk_tasks = []
            for task in high_risk + medium_risk:
                risk_factors = self._get_risk_factors(task)
                at_risk_tasks.append({
                    'task_id': str(task.id),
                    'task_title': task.title,
                    'risk_level': task.risk_level,
                    'risk_factors': risk_factors,
                    'assignee_username': f'User #{task.assignee_id}' if task.assignee_id else None,
                    'due_date': task.due_date.isoformat() if task.due_date else None,
                    'progress_percentage': task.progress_percentage if task.progress_percentage is not None else 0,
                    'status': task.status,
                    'estimated_delay_days': self._estimate_delay(task)
                })
            
            return {
                'total_tasks': len(tasks),
                'high_risk_count': len(high_risk),
                'medium_risk_count': len(medium_risk),
                'low_risk_count': len(low_risk),
                'at_risk_tasks': at_risk_tasks
            }
    
    def _get_risk_factors(self, task: Task) -> list:
        """Identify specific risk factors for a task"""
        factors = []
        
        if task.due_date:
            now = datetime.utcnow()
            days_until_due = (task.due_date.replace(tzinfo=None) - now).days
            
            if days_until_due < 0:
                factors.append('Overdue')
            elif days_until_due == 0:
                factors.append('Due Today')
            elif days_until_due <= 2:
                factors.append('Due Very Soon')
            elif days_until_due <= 7:
                factors.append('Due This Week')
        else:
            factors.append('No Due Date')
        
        progress = task.progress_percentage if task.progress_percentage is not None else 0
        
        if task.status == 'In Progress' and progress == 0:
            factors.append('No Progress')
        elif task.status == 'In Progress' and progress < 25:
            factors.append('Low Progress')
        elif task.status == 'To Do' and task.due_date:
            now = datetime.utcnow()
            days_until_due = (task.due_date.replace(tzinfo=None) - now).days
            if days_until_due <= 2:
                factors.append('Not Started')
        
        if task.due_date and task.created_at:
            now = datetime.utcnow()
            total_time = (task.due_date.replace(tzinfo=None) - task.created_at.replace(tzinfo=None)).days
            elapsed_time = (now - task.created_at.replace(tzinfo=None)).days
            
            if total_time > 0:
                expected_progress = (elapsed_time / total_time) * 100
                progress_gap = expected_progress - progress
                
                if progress_gap > 30:
                    factors.append('Behind Schedule')
        
        if not task.assignee_id:
            factors.append('Unassigned')
        
        return factors if factors else ['At Risk']
    
    def _estimate_delay(self, task: Task) -> int:
        """Estimate potential delay in days"""
        if not task.due_date:
            return 0
        
        now = datetime.utcnow()
        days_until_due = (task.due_date.replace(tzinfo=None) - now).days
        
        if days_until_due < 0:
            return abs(days_until_due)
        
        progress = task.progress_percentage if task.progress_percentage is not None else 0
        
        if progress < 50 and days_until_due <= 3:
            return max(1, 3 - days_until_due)
        elif progress < 25 and days_until_due <= 7:
            return max(1, 5 - days_until_due)
        
        return 0

risk_service = RiskService()
