from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import Item
from app.llm import embed
from app.services.vectors import query as vquery

def keyword_search(db: Session, q: str, limit: int = 20):
    ql = f"%{q.lower()}%"
    stmt = select(Item).where(
        (Item.title.ilike(ql)) | (Item.content.ilike(ql)) | (Item.tags.ilike(ql))
    ).order_by(Item.created_at.desc()).limit(limit)
    return db.execute(stmt).scalars().all()

def semantic_search(db: Session, q: str, limit: int = 8):
    emb = embed([q])[0]
    res = vquery(emb, n=limit)
    hits = []
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[]])[0]
    for doc, meta, dist in zip(docs, metas, dists):
        hits.append({
            "chunk": doc,
            "item_id": meta.get("item_id"),
            "title": meta.get("title"),
            "source": meta.get("source"),
            "type": meta.get("type"),
            "distance": dist
        })
    return hits
