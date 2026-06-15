from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routes.auth import router as auth_router
from routes.interviews import router as interviews_router
from routes.questions import router as questions_router
from routes.dashboard import router as dashboard_router
from routes.insights import router as insights_router
from routes.clustering import router as clustering_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Interview Tracker API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(interviews_router)
app.include_router(questions_router)
app.include_router(dashboard_router)
app.include_router(insights_router)
app.include_router(clustering_router)

@app.get("/")
def root():
    return {"message": "AI Interview Tracker API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)