# Flowbit AI Second Brain (Flowbit Labs)

A minimal, modern web app that turns PDFs, web links, and notes into a searchable knowledge system with AI summaries + semantic search.

## Features
- Ingest: PDF uploads, URLs, text notes
- AI processing: summary, takeaways, tags
- Search: keyword + semantic (embeddings)
- Ask: ask questions across your library with cited sources
- Local-first: metadata in SQLite, vectors in ChromaDB

## Quickstart

### Backend
```bash
cd backend
cp .env.example .env
# add OPENAI_API_KEY in backend/.env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:3000

### Notes
- PDF text extraction quality depends on PDF formatting.
- Web extraction uses readability; some pages may block scraping.
- Everything is designed to be simple and extendable.

### Roadmap
- Export to Markdown
- Collections/folders
- Better PDF extraction for scanned docs (OCR optional)
- Auth (optional)
- Scheduled digests
