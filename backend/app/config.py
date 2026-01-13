import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
MODEL = os.getenv("FLOWBIT_MODEL", "gpt-4o-mini")
EMBED_MODEL = os.getenv("FLOWBIT_EMBED_MODEL", "text-embedding-3-small")

DATA_DIR = os.getenv("FLOWBIT_DATA_DIR", "data")
CHROMA_DIR = os.getenv("FLOWBIT_CHROMA_DIR", "data/chroma")
DB_URL = os.getenv("FLOWBIT_DB_URL", "sqlite:///./data/flowbit.db")

if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY. Put it in backend/.env")
