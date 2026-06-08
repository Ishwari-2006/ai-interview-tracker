from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from models.interview import Interview
from models.question import Question
from services.auth_service import get_current_user
import uuid

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = uuid.UUID(current_user["sub"])

    total_interviews = db.query(Interview).filter(
        Interview.user_id == user_id
    ).count()

    passed = db.query(Interview).filter(
        Interview.user_id == user_id,
        Interview.outcome == "Pass"
    ).count()

    failed = db.query(Interview).filter(
        Interview.user_id == user_id,
        Interview.outcome == "Fail"
    ).count()

    pass_rate = round((passed / total_interviews * 100), 1) if total_interviews > 0 else 0

    total_questions = db.query(Question).filter(
        Question.user_id == user_id
    ).count()

    stuck_questions = db.query(Question).filter(
        Question.user_id == user_id,
        Question.was_stuck == True
    ).count()

    round_breakdown = db.query(
        Interview.round_type,
        func.count(Interview.id)
    ).filter(
        Interview.user_id == user_id
    ).group_by(Interview.round_type).all()

    topic_breakdown = db.query(
        Question.topic_tag,
        func.count(Question.id)
    ).filter(
        Question.user_id == user_id
    ).group_by(Question.topic_tag).all()

    stuck_by_topic = db.query(
        Question.topic_tag,
        func.count(Question.id)
    ).filter(
        Question.user_id == user_id,
        Question.was_stuck == True
    ).group_by(Question.topic_tag).all()

    return {
        "total_interviews": total_interviews,
        "passed": passed,
        "failed": failed,
        "pass_rate": pass_rate,
        "total_questions": total_questions,
        "stuck_questions": stuck_questions,
        "round_breakdown": [{"round": r, "count": c} for r, c in round_breakdown],
        "topic_breakdown": [{"topic": t, "count": c} for t, c in topic_breakdown],
        "stuck_by_topic": [{"topic": t, "count": c} for t, c in stuck_by_topic]
    } 
