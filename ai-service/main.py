from fastapi import FastAPI

from routes.summarize import router as summarize_router
from routes.extract import router as extract_router

app = FastAPI(
    title="ResearchLens AI Service"
)

# Register routes
app.include_router(summarize_router)
app.include_router(extract_router)

@app.get("/")
def home():
    return {
        "message": "ResearchLens AI Service Running"
    }