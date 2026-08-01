from sqlalchemy import Column, String, DateTime, Text, Date, Enum
from sqlalchemy.dialects.postgresql import UUID
from database.connection import Base
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_name = Column(String(150), nullable=False)
    role = Column(String(100))
    interview_date = Column(Date)
    round_type = Column(Enum('HR', 'Technical', 'DSA', 'System Design', 'Managerial', name='round_type'))
    outcome = Column(Enum('Pass', 'Fail', 'Pending', 'No Response', name='outcome_type'), default='Pending')
    difficulty = Column(Enum('Easy', 'Medium', 'Hard', name='difficulty_type'))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)