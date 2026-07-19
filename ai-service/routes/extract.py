from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz  # PyMuPDF

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/extract")
async def extract(file: UploadFile = File(...)):

    # Allow only PDF files
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    try:
        # Read uploaded file
        pdf_bytes = await file.read()

        # Check file size
        if len(pdf_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="PDF file is too large."
            )

        # Open PDF from memory
        pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

        text = ""

        # Extract text page by page
        for page in pdf:
            text += page.get_text()

        page_count = len(pdf)
        pdf.close()

        # Validate extracted text
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the PDF."
            )

        return {
            "filename": file.filename,
            "pages": page_count,
            "characters": len(text),
            "text": text
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"[extract] PDF extraction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to extract text from PDF."
        )