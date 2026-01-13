from openai import OpenAI
from app.config import OPENAI_API_KEY, MODEL, EMBED_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

def chat(system: str, user: str, temperature: float = 0.4) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    )
    return resp.choices[0].message.content.strip()

def embed(texts: list[str]) -> list[list[float]]:
    resp = client.embeddings.create(
        model=EMBED_MODEL,
        input=texts
    )
    return [d.embedding for d in resp.data]
