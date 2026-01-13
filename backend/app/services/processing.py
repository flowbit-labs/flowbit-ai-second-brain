from app.llm import chat
from app.utils import chunk_text

SYSTEM = """You are Flowbit Labs. You create calm, practical summaries.
Write in plain English. Avoid hype. Avoid fluff."""

def summarize_and_tag(title: str, text: str) -> tuple[str, str, list[str]]:
    prompt = f"""
TITLE: {title}

TEXT:
{text}

Return:
1) A short summary (5-7 lines)
2) Key takeaways (5 bullet points)
3) Tags (5-8 short tags, comma-separated)
"""
    out = chat(SYSTEM, prompt, temperature=0.3)

    # Simple parsing (robust enough for this MVP)
    summary = out
    takeaways = ""
    tags = []
    if "Key takeaways" in out:
        parts = out.split("Key takeaways", 1)
        summary = parts[0].strip()
        rest = parts[1]
        if "Tags" in rest:
            tparts = rest.split("Tags", 1)
            takeaways = tparts[0].strip(":\n ").strip()
            tag_line = tparts[1].strip(":\n ").strip()
            tags = [x.strip() for x in tag_line.replace("\n", " ").split(",") if x.strip()]
    return summary.strip(), takeaways.strip(), tags

def make_chunks(text: str) -> list[str]:
    return chunk_text(text, max_chars=1400, overlap=200)
