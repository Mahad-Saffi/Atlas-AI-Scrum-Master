import uuid
from sqlalchemy import Column, String, Text, ForeignKey, TIMESTAMP, func, Integer
from sqlalchemy.orm import relationship
from app.models.user import Base

def generate_uuid():
    return str(uuid.uuid4())

class Project(Base):
    __tablename__ = 'projects'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    organization_id = Column(String(36), ForeignKey('organizations.id'), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    owner = relationship("User")
    organization = relationship("Organization", back_populates="projects")
    epics = relationship("Epic", back_populates="project", cascade="all, delete-orphan")
