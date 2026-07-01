import os
import re
from dotenv import load_dotenv
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

# Output Schema
class SummaryResponse(BaseModel):
    one_line: str
    executive: str
    detailed: str

# LLM
llm = ChatGoogleGenerativeAI(
    model=os.getenv("MODEL"),
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)

# structured output
structured_llm = llm.with_structured_output(SummaryResponse)

# Prompt
prompt = PromptTemplate(
    input_variables=["text"],
    template="""
You are an expert academic research assistant.

TASK:
Convert the given text into a proper structured 3-level summary.

VERY IMPORTANT RULES:
- DO NOT copy or repeat sentences from input
- DO NOT return original text
- You MUST compress and re-explain in your own words
- You MUST understand meaning and rewrite it

OUTPUT FORMAT:
one_line: Capture the main idea in 1 sentence
executive: Explain the topic in simple words (3–5 sentences)
detailed: Deep academic explanation with full understanding

INPUT TEXT:
{text}
"""
)

chain = prompt | structured_llm

def fix_spacing(text: str):

    # Insert space between a lowercase letter and a following capital letter
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    # Insert space between a letter and a following digit stuck together
    text = re.sub(r'([a-z])(\d)', r'\1 \2', text)
    return text


# MAIN CHAIN FUNCTION
async def generate_summary(text: str) -> dict:
    result = await chain.ainvoke({"text": text})
    return result.model_dump()  # Pydantic v2 

    for key in data:
        data[key] = fix_spacing(data[key])
        
        return data