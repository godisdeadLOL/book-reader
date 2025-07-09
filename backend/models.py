from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)


class Book(Base):
    __tablename__ = "book"

    id: Mapped[str] = mapped_column(primary_key=True)

    title: Mapped[str]
    title_original: Mapped[str]
    description: Mapped[str]
    tags: Mapped[str]

    cover_path: Mapped[Optional[str]]

    chapters: Mapped[list["Chapter"]] = relationship(back_populates="book", cascade="all, delete")

    @property
    def chapter_count(self):
        return len(self.chapters)


class Chapter(Base):
    __tablename__ = "chapter"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    volume: Mapped[Optional[int]] = mapped_column(default=None)
    index: Mapped[int]
    
    title: Mapped[str]
    content: Mapped[str]

    book_id: Mapped[str] = mapped_column(ForeignKey("book.id"))
    book: Mapped["Book"] = relationship(back_populates="chapters")

    comments: Mapped[list["Comment"]] = relationship(back_populates="chapter", cascade="all, delete")


class Comment(Base):
    __tablename__ = "comment"
    
    id: Mapped[int] = mapped_column(primary_key=True)

    user: Mapped[str]
    content: Mapped[str]

    chapter_id: Mapped[int] = mapped_column(ForeignKey("chapter.id"))
    chapter: Mapped[Chapter] = relationship(back_populates="comments")
