import uuid
from sqlalchemy import Column, String, Text, ForeignKey, TIMESTAMP, func, Integer
from sqlalchemy.orm import relationship
from app.models.user import Base

def generate_uuid():
    return str(uuid.uuid4())

class Story(Base):
    __tablename__ = 'stories'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    epic_id = Column(String(36), ForeignKey('epics.id'), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    epic = relationship("Epic", back_populates="stories")
    tasks = relationship("Task", back_populates="story", cascade="all, delete-orphan")
