from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database.connection import get_db
from models.question import Question
from services.auth_service import get_current_user
import uuid

router = APIRouter(prefix="/questions", tags=["Questions"])

class QuestionRequest(BaseModel):
    interview_id: str
    question_text: str
    topic_tag: Optional[str] = None
    my_answer: Optional[str] = None
    was_stuck: Optional[bool] = False

@router.post("/")
def create_question(
    request: QuestionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    new_question = Question(
        interview_id=uuid.UUID(request.interview_id),
        user_id=uuid.UUID(current_user["sub"]),
        question_text=request.question_text,
        topic_tag=request.topic_tag,
        my_answer=request.my_answer,
        was_stuck=request.was_stuck
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return {"message": "Question added successfully", "question_id": str(new_question.id)}

@router.get("/")
def get_questions(
    topic_tag: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    query = db.query(Question).filter(
        Question.user_id == uuid.UUID(current_user["sub"])
    )
    if topic_tag:
        query = query.filter(Question.topic_tag == topic_tag)
    questions = query.order_by(Question.created_at.desc()).all()
    return questions

@router.delete("/{question_id}")
def delete_question(
    question_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    question = db.query(Question).filter(
        Question.id == uuid.UUID(question_id),
        Question.user_id == uuid.UUID(current_user["sub"])
    ).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully"}
