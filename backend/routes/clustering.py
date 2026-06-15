from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.question import Question
from services.auth_service import get_current_user
from services.clustering_service import cluster_questions
import uuid

router = APIRouter(prefix="/clustering", tags=["Clustering"])

@router.get("/")
def get_clustered_questions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch all questions for the current user,
    run semantic clustering on them,
    return grouped clusters.
    """
    user_id = uuid.UUID(current_user["sub"])

    # Get all questions from database
    questions = db.query(Question).filter(
        Question.user_id == user_id
    ).all()

    if not questions:
        return {"clusters": [], "total_questions": 0, "total_clusters": 0}

    # Convert SQLAlchemy objects to plain dicts
    # (clustering service works with plain dicts)
    questions_data = [
        {
            "id": str(q.id),
            "question_text": q.question_text,
            "topic_tag": q.topic_tag,
            "was_stuck": q.was_stuck,
            "interview_id": str(q.interview_id)
        }
        for q in questions
    ]

    # Run clustering
    clusters = cluster_questions(questions_data, threshold=0.7)

    return {
        "clusters": clusters,
        "total_questions": len(questions_data),
        "total_clusters": len(clusters)
    }