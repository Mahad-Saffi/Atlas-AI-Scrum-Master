import uuid
from sqlalchemy import Column, String, Text, ForeignKey, TIMESTAMP, func, Integer, VARCHAR
from sqlalchemy.orm import relationship
from app.models.user import Base

def generate_uuid():
    return str(uuid.uuid4())

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    story_id = Column(String(36), ForeignKey('stories.id'), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(20), nullable=False, default='To Do')
    assignee_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    due_date = Column(TIMESTAMP(timezone=True))
    estimate_hours = Column(Integer, nullable=True)  # Estimated hours to complete
    progress_percentage = Column(Integer, default=0)  # 0-100
    risk_level = Column(String(20), default='low')  # low, medium, high
    priority = Column(Integer, default=0)
    order = Column(Integer, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    project = relationship("Project")
    story = relationship("Story", back_populates="tasks")
    assignee = relationship("User")
