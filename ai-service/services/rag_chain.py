import os
import uuid

from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()


# EMBEDDINGS

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# CHROMA DATABASE

CHROMA_DIR = "chroma_db"


# LLM

llm = ChatGoogleGenerativeAI(
    model=os.getenv("MODEL"),
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)



# INDEX PAPER

async def index_paper(text: str):

    # Create unique ID for this paper
    paper_id = str(uuid.uuid4())

    print(f"Creating index for paper: {paper_id}")

    # Split paper into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150
    )

    chunks = splitter.create_documents([text])

    print(f"Created {len(chunks)} chunks.")

    # Add paper ID to every chunk
    for chunk in chunks:
        chunk.metadata["paper_id"] = paper_id

    # Store chunks in Chroma
    vectorstore = Chroma(
        collection_name="research_papers",
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )

    vectorstore.add_documents(chunks)

    print(f"Paper {paper_id} indexed successfully.")

    return {
        "message": "Paper indexed successfully.",
        "paper_id": paper_id,
        "chunks": len(chunks)
    }


# CHAT WITH PAPER

async def chat_with_paper(question: str, paper_id: str) -> str:

    # Connect to existing Chroma database
    vectorstore = Chroma(
        collection_name="research_papers",
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )

    # Search ONLY inside this paper
    documents = vectorstore.similarity_search(
        question,
        k=4,
        filter={
            "paper_id": paper_id
        }
    )

    # If no relevant information was found
    if not documents:
        return "The information needed to answer this question is not available in the paper."

    # Combine retrieved chunks
    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    # Prompt
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are an academic research assistant.

Answer the user's question using ONLY the information
provided in the context from the research paper.

IMPORTANT RULES:

- Use only the provided paper context.
- Do not use outside knowledge.
- Do not invent information.
- Do not make assumptions.
- If the answer is not available in the paper,
  say exactly:

"The information needed to answer this question
is not available in the paper."

- Give a clear and concise answer.

PAPER CONTEXT:
{context}

QUESTION:
{question}
"""
    )

    chain = prompt | llm

    result = await chain.ainvoke(
        {
            "context": context,
            "question": question
        }
    )

    return result.content