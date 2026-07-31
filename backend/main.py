from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database.connection import engine, Base
from routes.auth import router as auth_router
from routes.interviews import router as interviews_router
from routes.questions import router as questions_router
from routes.dashboard import router as dashboard_router
from routes.insights import router as insights_router
from routes.pdf import router as pdf_router

Base.metadata.create_all(bind=engine)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AI Interview Tracker API")

# Attach limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://ai-interview-tracker-five.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(interviews_router)
app.include_router(questions_router)
app.include_router(dashboard_router)
app.include_router(insights_router)
app.include_router(pdf_router)

@app.get("/")
def root():
    return {"message": "AI Interview Tracker API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)