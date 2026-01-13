from pypdf import PdfReader
from app.utils import clean_text

def extract_pdf_text(path: str) -> str:
    reader = PdfReader(path)
    parts = []
    for page in reader.pages:
        txt = page.extract_text() or ""
        if txt.strip():
            parts.append(txt)
    return clean_text("\n\n".join(parts))
