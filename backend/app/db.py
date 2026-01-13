import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DB_URL, DATA_DIR

os.makedirs(DATA_DIR, exist_ok=True)

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
