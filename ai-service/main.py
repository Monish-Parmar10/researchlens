from fastapi import FastAPI

from routes.summarize import router as summarize_router
from routes.extract import router as extract_router
from routes.score import router as score_router
from routes.review import router as review_router
from routes.chat import router as chat_router

app = FastAPI(  
    title="ResearchLens AI Service"
)

# Register routes
app.include_router(summarize_router)
app.include_router(extract_router)
app.include_router(score_router)
app.include_router(review_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {
        "message": "ResearchLens AI Service Running"
    }