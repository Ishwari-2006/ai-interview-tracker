from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from services.auth_service import get_current_user
import httpx
import os

router = APIRouter(prefix="/insights", tags=["Insights"])

class InterviewData(BaseModel):
    company_name: str
    role: Optional[str] = None
    round_type: Optional[str] = None
    outcome: Optional[str] = None
    difficulty: Optional[str] = None

class QuestionData(BaseModel):
    question_text: str
    topic_tag: Optional[str] = None
    was_stuck: Optional[bool] = False

class StuckTopic(BaseModel):
    topic: Optional[str] = None
    count: int

class InsightsRequest(BaseModel):
    interviews: List[InterviewData]
    questions: List[QuestionData]
    total_interviews: int
    pass_rate: float
    total_questions: int
    stuck_questions: int
    stuck_by_topic: List[StuckTopic]

def build_prompt(data: InsightsRequest) -> str:
    interview_summary = '\n'.join([
        f"- {i.company_name} ({i.role or 'Unknown role'}): {i.round_type or 'Unknown round'}, Outcome: {i.outcome}, Difficulty: {i.difficulty or 'Not rated'}"
        for i in data.interviews
    ]) or 'No interviews logged yet'

    question_summary = '\n'.join([
        f"- [{q.topic_tag or 'Untagged'}] {q.question_text} {'(WAS STUCK)' if q.was_stuck else ''}"
        for q in data.questions
    ]) or 'No questions logged yet'

    stuck_topics = ', '.join([
        f"{t.topic}: {t.count} times"
        for t in data.stuck_by_topic if t.topic
    ]) or 'None'

    return f"""You are an expert interview coach analyzing a student's interview performance data.

Here is their interview history:
{interview_summary}

Here are the questions they were asked (marked WAS STUCK if they struggled):
{question_summary}

Overall Stats:
- Total Interviews: {data.total_interviews}
- Pass Rate: {data.pass_rate}%
- Total Questions: {data.total_questions}
- Stuck on {data.stuck_questions} questions
- Topics they struggled with most: {stuck_topics}

Based on this data, please provide:

1. PERFORMANCE SUMMARY (2-3 sentences about overall performance)
2. TOP 3 WEAK AREAS (with specific reason based on their data)
3. PERSONALIZED 2-WEEK STUDY PLAN (day by day)
4. TOP 5 RESOURCES (free — websites, YouTube, practice strategies)
5. MOTIVATIONAL MESSAGE (1-2 encouraging sentences)

Format with these exact headers:
## Performance Summary
## Weak Areas
## 2-Week Study Plan
## Recommended Resources
## Keep Going!

Be specific to their actual data, not generic advice."""

@router.post("/generate")
async def generate_insights(
    request: InsightsRequest,
    current_user: dict = Depends(get_current_user)
):
    prompt = build_prompt(request)

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1500
            }
        )

    result = response.json()

    if "error" in result:
        error_msg = result["error"].get("message", "Unknown error")
        # Return a friendly message instead of crashing
        if "rate_limit" in str(result["error"]).lower():
            return {"insights": "## Rate Limit Reached\nYou are generating insights too quickly. Please wait 30 seconds and try again."}
        return {"insights": f"## Error\n{error_msg}"}

    text = result["choices"][0]["message"]["content"]
    return {"insights": text}