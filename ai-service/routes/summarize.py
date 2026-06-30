from fastapi import APIRouter
from pydantic import BaseModel

from services.summary_chain import generate_summary

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str

@router.post("/summarize")
def summarize(request: SummaryRequest):
    result = generate_summary(request.text)
    return result