import os
from dotenv import load_dotenv
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()


# output schema

class ScoreItem(BaseModel):
    score: int
    reason: str


class ScoreResponse(BaseModel):
    problem_statement: ScoreItem
    literature_review: ScoreItem
    methodology: ScoreItem
    experiments: ScoreItem
    results: ScoreItem
    conclusion: ScoreItem
    references: ScoreItem
    overall_score: int


# LLM

llm = ChatGoogleGenerativeAI(
    model=os.getenv("MODEL"),
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)

structured_llm = llm.with_structured_output(ScoreResponse)


# Prompt

prompt = PromptTemplate(
    input_variables=["text"],
    template="""
You are an expert academic conference reviewer.

Evaluate the research paper on the following seven dimensions.

For EACH dimension provide:

- score (0-100)
- short reason (1-2 sentences)

Dimensions:

1. Problem Statement
2. Literature Review
3. Methodology
4. Experiments
5. Results
6. Conclusion
7. References

Also provide an overall_score (0-100).

Scoring Guidelines:

- 90-100 = Excellent
- 80-89 = Very Good
- 70-79 = Good
- 60-69 = Average
- Below 60 = Needs Improvement

Research Paper:

{text}
"""
)

chain = prompt | structured_llm


# Main Function 

async def generate_score(text: str) -> dict:
    result = await chain.ainvoke({"text": text})
    return result.model_dump()