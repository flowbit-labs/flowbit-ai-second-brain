import os
import chromadb
from chromadb.config import Settings
from app.config import CHROMA_DIR

os.makedirs(CHROMA_DIR, exist_ok=True)

_client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(anonymized_telemetry=False))
_collection = _client.get_or_create_collection("flowbit_items")

def upsert_chunks(item_id: str, chunks: list[str], embeddings: list[list[float]], metadatas: list[dict]):
    ids = [f"{item_id}:{i}" for i in range(len(chunks))]
    _collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

def query(query_embedding: list[float], n: int = 8):
    return _collection.query(
        query_embeddings=[query_embedding],
        n_results=n,
        include=["documents", "metadatas", "distances"]
    )
