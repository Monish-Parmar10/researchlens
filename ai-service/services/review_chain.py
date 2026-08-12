import os
from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()


# Output Schema
class ReviewResponse(BaseModel):
    reviewer_analysis: str
    strengths: list[str]
    weaknesses: list[str]
    reviewer_questions: list[str]
    recommendation: Literal[
        "Accept",
        "Weak Accept",
        "Borderline",
        "Weak Reject",
        "Reject"
    ]


# LLM
llm = ChatGoogleGenerativeAI(
    model=os.getenv("MODEL"),
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)


# Structured Output
structured_llm = llm.with_structured_output(ReviewResponse)


# Prompt
prompt = PromptTemplate(
    input_variables=["text"],
    template="""
You are an expert academic research paper reviewer.

Your task is to critically review the given research paper.

Analyze ONLY the information provided in the paper.
Do not assume that missing information exists.

Provide the following:

1. REVIEWER ANALYSIS
   Give an overall academic assessment of the paper.
   Discuss the quality, relevance, methodology, experimental evaluation,
   and overall contribution.

2. STRENGTHS
   Identify the strongest aspects of the paper.
   Give 3 to 5 specific strengths.

3. WEAKNESSES
   Identify important problems, limitations, or missing information.
   Give 3 to 5 specific weaknesses.

4. REVIEWER QUESTIONS
   Generate 3 to 5 questions that a real academic reviewer
   would likely ask the authors during peer review.

5. FINAL RECOMMENDATION

Based on your complete analysis, provide ONE final recommendation.

You MUST choose exactly ONE of these options:

- Accept
- Weak Accept
- Borderline
- Weak Reject
- Reject

The recommendation should reflect the overall quality, contribution,
methodology, experiments, results, and limitations of the paper.

IMPORTANT RULES:

- Base your review only on the provided text.
- Do not invent information.
- Be objective and academically critical.
- Do not simply repeat sentences from the paper.
- Explain your reasoning clearly.
- If something important is missing, mention it as a weakness.
- Reviewer questions should be specific to the paper.

RESEARCH PAPER:
{text}
"""
)


# Chain
chain = prompt | structured_llm


# Main Chain Function
async def generate_review(text: str) -> dict:
    result = await chain.ainvoke({"text": text})
    return result.model_dump()