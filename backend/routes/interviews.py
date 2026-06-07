from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
from database.connection import get_db
from models.interview import Interview
from services.auth_service import get_current_user
import uuid

router = APIRouter(prefix="/interviews", tags=["Interviews"])

class InterviewRequest(BaseModel):
    company_name: str
    role: Optional[str] = None
    interview_date: Optional[date] = None
    round_type: Optional[str] = None
    outcome: Optional[str] = "Pending"
    difficulty: Optional[str] = None
    notes: Optional[str] = None

@router.post("/")
def create_interview(
    request: InterviewRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    new_interview = Interview(
        user_id=uuid.UUID(current_user["sub"]),
        company_name=request.company_name,
        role=request.role,
        interview_date=request.interview_date,
        round_type=request.round_type,
        outcome=request.outcome,
        difficulty=request.difficulty,
        notes=request.notes
    )
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return {"message": "Interview logged successfully", "interview_id": str(new_interview.id)}

@router.get("/")
def get_interviews(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    interviews = db.query(Interview).filter(
        Interview.user_id == uuid.UUID(current_user["sub"])
    ).order_by(Interview.created_at.desc()).all()
    return interviews

@router.put("/{interview_id}")
def update_interview(
    interview_id: str,
    request: InterviewRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        Interview.id == uuid.UUID(interview_id),
        Interview.user_id == uuid.UUID(current_user["sub"])
    ).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    interview.company_name = request.company_name
    interview.role = request.role
    interview.interview_date = request.interview_date
    interview.round_type = request.round_type
    interview.outcome = request.outcome
    interview.difficulty = request.difficulty
    interview.notes = request.notes
    db.commit()
    db.refresh(interview)
    return {"message": "Interview updated successfully"}

@router.delete("/{interview_id}")
def delete_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        Interview.id == uuid.UUID(interview_id),
        Interview.user_id == uuid.UUID(current_user["sub"])
    ).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}
