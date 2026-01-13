from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Text, DateTime
from datetime import datetime
import uuid

class Base(DeclarativeBase):
    pass

class Item(Base):
    __tablename__ = "items"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type: Mapped[str] = mapped_column(String, index=True)  # pdf | web | note
    title: Mapped[str] = mapped_column(String, default="")
    source: Mapped[str] = mapped_column(String, default="") # filename or url
    content: Mapped[str] = mapped_column(Text, default="")  # cleaned text
    summary: Mapped[str] = mapped_column(Text, default="")
    takeaways: Mapped[str] = mapped_column(Text, default="")
    tags: Mapped[str] = mapped_column(String, default="")   # comma-separated
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
