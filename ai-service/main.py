from fastapi import FastAPI

from routes.summarize import router

app = FastAPI(
    title="ResearchLens AI Service"
)

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "ResearchLens AI Service Running"
    }