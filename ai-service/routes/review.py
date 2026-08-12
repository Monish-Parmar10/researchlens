from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.review_chain import generate_review, ReviewResponse


router = APIRouter()

MAX_CHARS = 50_000


class ReviewRequest(BaseModel):
    text: str


@router.post("/review", response_model=ReviewResponse)
async def review(request: ReviewRequest):

    text = request.text.strip()

    # Check if text is too short
    if not text or len(text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Text too short. Please provide full paper text."
        )

    # Check maximum length
    if len(text) > MAX_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Text too long. Max {MAX_CHARS} characters."
        )

    try:
        result = await generate_review(text)
        return result

    except Exception as e:
        # Log actual error for debugging
        print(f"[review] AI service error: {e}")

        raise HTTPException(
            status_code=500,
            detail="AI service failed to generate review. Please try again."
        )