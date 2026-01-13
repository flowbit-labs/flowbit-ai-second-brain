from app.utils import clean_text

def ingest_note(title: str, text: str) -> tuple[str, str]:
    title = (title or "Untitled note").strip()
    return title, clean_text(text)
