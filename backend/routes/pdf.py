from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database.connection import get_db
from models.interview import Interview
from models.question import Question
from services.auth_service import get_current_user, get_current_user
from services.pdf_service import generate_report
from routes.auth import get_profile
import uuid

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.get("/report")
def download_report(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = uuid.UUID(current_user["sub"])

    # Fetch user data
    from models.user import User
    user = db.query(User).filter(User.id == user_id).first()
    user_data = {"name": user.name, "email": user.email} if user else {}

    # Fetch interviews
    interviews = db.query(Interview).filter(
        Interview.user_id == user_id
    ).order_by(Interview.created_at.desc()).all()

    interviews_data = [
        {
            "company_name": i.company_name,
            "role": i.role,
            "round_type": i.round_type,
            "outcome": i.outcome,
            "difficulty": i.difficulty,
            "interview_date": str(i.interview_date) if i.interview_date else None,
        }
        for i in interviews
    ]

    # Fetch questions
    questions = db.query(Question).filter(
        Question.user_id == user_id
    ).all()

    questions_data = [
        {
            "question_text": q.question_text,
            "topic_tag": q.topic_tag,
            "was_stuck": q.was_stuck,
        }
        for q in questions
    ]

    # Fetch stats
    from sqlalchemy import func
    total_interviews = len(interviews_data)
    passed = sum(1 for i in interviews_data if i['outcome'] == 'Pass')
    failed = sum(1 for i in interviews_data if i['outcome'] == 'Fail')
    pass_rate = round(passed / total_interviews * 100, 1) if total_interviews > 0 else 0
    total_questions = len(questions_data)
    stuck_questions = sum(1 for q in questions_data if q['was_stuck'])

    stuck_by_topic = db.query(
        Question.topic_tag, func.count(Question.id)
    ).filter(
        Question.user_id == user_id,
        Question.was_stuck == True
    ).group_by(Question.topic_tag).all()

    stats = {
        "total_interviews": total_interviews,
        "passed": passed,
        "failed": failed,
        "pass_rate": pass_rate,
        "total_questions": total_questions,
        "stuck_questions": stuck_questions,
        "stuck_by_topic": [{"topic": t, "count": c} for t, c in stuck_by_topic]
    }

    # Generate PDF
    pdf_bytes = generate_report(user_data, stats, interviews_data, questions_data)

    # Return PDF as a downloadable file
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=interview-report.pdf"
        }
    )