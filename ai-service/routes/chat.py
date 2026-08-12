from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.rag_chain import index_paper, chat_with_paper


router = APIRouter()


# REQUEST MODELS

class IndexRequest(BaseModel):
    text: str


class ChatRequest(BaseModel):
    paper_id: str
    question: str


# INDEX PAPER

@router.post("/chat/index")
async def index(request: IndexRequest):

    text = request.text.strip()

    if not text or len(text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Text too short. Please provide full paper text."
        )

    try:

        result = await index_paper(text)

        return result

    except Exception as e:

        print(f"[chat/index] RAG indexing error: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to index paper: {str(e)}"
        )


# CHAT WITH PAPER

@router.post("/chat")
async def chat(request: ChatRequest):

    paper_id = request.paper_id.strip()
    question = request.question.strip()

    if not paper_id:
        raise HTTPException(
            status_code=400,
            detail="paper_id is required."
        )

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        answer = await chat_with_paper(
            question,
            paper_id
        )

        return {
            "paper_id": paper_id,
            "question": question,
            "answer": answer
        }

    except Exception as e:

        print(f"[chat] RAG chat error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to answer question."
        )