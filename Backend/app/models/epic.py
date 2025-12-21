import uuid
from sqlalchemy import Column, String, Text, ForeignKey, TIMESTAMP, func, Integer
from sqlalchemy.orm import relationship
from app.models.user import Base

def generate_uuid():
    return str(uuid.uuid4())

class Epic(Base):
    __tablename__ = 'epics'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    project = relationship("Project", back_populates="epics")
    stories = relationship("Story", back_populates="epic", cascade="all, delete-orphan")
