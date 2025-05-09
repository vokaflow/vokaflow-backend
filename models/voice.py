from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from models.base import Base

class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"
    NEUTRAL = "neutral"

class Voice(Base):
    """Modelo para voces de síntesis"""
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    language = Column(String(10), nullable=False, default="en")
    gender = Column(Enum(Gender), nullable=False, default=Gender.NEUTRAL)
    file_path = Column(String(255), nullable=False)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    embedding_path = Column(String(255), nullable=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="voices")
    
    def __repr__(self) -> str:
        return f"<Voice {self.name} ({self.language}, {self.gender.value})>"
