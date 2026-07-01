from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.summary_chain import generate_summary, SummaryResponse

router = APIRouter()
MAX_CHARS = 50_000 

class SummaryRequest(BaseModel):
    text: str


@router.post("/summarize", response_model=SummaryResponse)
async def summarize(request: SummaryRequest):

    text = request.text.strip()

    if not text or len(text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Text too short. Please provide full paper text."
        )

    if len(text) > MAX_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Text too long. Max {MAX_CHARS} characters."
        )

    try:
        result = await generate_summary(text)
        return result

    except Exception as e:
        # Log the real error server-side for debugging
        print(f"[summarize] AI service error: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI service failed to generate summary. Please try again."
        )