from app.llm import chat

SYSTEM = """You are Flowbit Labs. Answer clearly and calmly.
Use only the provided sources. If sources are insufficient, say so.
Always cite sources like [1], [2] etc."""

def answer_question(question: str, sources: list[dict]) -> str:
    context_blocks = []
    for i, s in enumerate(sources, start=1):
        context_blocks.append(
            f"[{i}] TITLE: {s.get('title','')}\nSOURCE: {s.get('source','')}\nTYPE: {s.get('type','')}\nEXCERPT:\n{s.get('chunk','')}\n"
        )
    context = "\n\n".join(context_blocks)
    prompt = f"""
QUESTION:
{question}

SOURCES:
{context}

Write:
- A direct answer
- Bullet points where helpful
- Cite sources like [1], [2]
"""
    return chat(SYSTEM, prompt, temperature=0.2)
