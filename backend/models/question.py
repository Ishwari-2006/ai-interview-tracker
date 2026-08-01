from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database.connection import Base
from datetime import datetime 
import uuid

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    topic_tag = Column(String(50))
    my_answer = Column(Text)
    was_stuck = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow) 
