from sqlalchemy import Column, DateTime, Text, Integer,ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database.connection import Base
from datetime import datetime
import uuid

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    weak_areas = Column(JSONB)
    recommendations = Column(Text)
    total_interviews_analyzed = Column(Integer)
