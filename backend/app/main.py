import os
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import get_db, engine
from app.models import Base, Item
from app.ingest.pdf import extract_pdf_text
from app.ingest.web import extract_web_text
from app.ingest.text import ingest_note
from app.services.processing import summarize_and_tag, make_chunks
from app.llm import embed
from app.services.vectors import upsert_chunks
from app.services.search import keyword_search, semantic_search
from app.services.qa import answer_question

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flowbit AI Second Brain")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_UPLOADS = "data/uploads"
os.makedirs(DATA_UPLOADS, exist_ok=True)

class LinkIn(BaseModel):
    url: str

class NoteIn(BaseModel):
    title: str = "Untitled note"
    text: str

class AskIn(BaseModel):
    question: str
    top_k: int = 6

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/items")
def list_items(db: Session = Depends(get_db)):
    items = db.query(Item).order_by(Item.created_at.desc()).limit(100).all()
    return items

@app.get("/items/{item_id}")
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    return item

def _store_item(db: Session, type_: str, title: str, source: str, content: str):
    summary, takeaways, tags = summarize_and_tag(title, content)
    item = Item(type=type_, title=title, source=source, content=content,
                summary=summary, takeaways=takeaways, tags=",".join(tags))
    db.add(item)
    db.commit()
    db.refresh(item)

    # vectors
    chunks = make_chunks(content)
    embs = embed(chunks)
    metas = [{"item_id": item.id, "title": item.title, "source": item.source, "type": item.type} for _ in chunks]
    upsert_chunks(item.id, chunks, embs, metas)
    return item

@app.post("/ingest/pdf")
async def ingest_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    path = os.path.join(DATA_UPLOADS, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    text = extract_pdf_text(path)
    title = file.filename.rsplit(".", 1)[0]
    return _store_item(db, "pdf", title, file.filename, text)

@app.post("/ingest/link")
def ingest_link(payload: LinkIn, db: Session = Depends(get_db)):
    title, text = extract_web_text(payload.url)
    return _store_item(db, "web", title, payload.url, text)

@app.post("/ingest/note")
def ingest_note_api(payload: NoteIn, db: Session = Depends(get_db)):
    title, text = ingest_note(payload.title, payload.text)
    return _store_item(db, "note", title, "note", text)

@app.get("/search")
def search(q: str, mode: str = "semantic", db: Session = Depends(get_db)):
    if mode == "keyword":
        items = keyword_search(db, q)
        return {"mode": "keyword", "items": items}
    hits = semantic_search(db, q, limit=10)
    return {"mode": "semantic", "hits": hits}

@app.post("/ask")
def ask(payload: AskIn, db: Session = Depends(get_db)):
    hits = semantic_search(db, payload.question, limit=payload.top_k)
    answer = answer_question(payload.question, hits)
    return {"answer": answer, "sources": hits}
