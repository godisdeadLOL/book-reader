from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

from datetime import datetime, timezone


class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    title_original: str
    description: str
    tags: str

    cover_path: Optional[str]

    chapters: list["Chapter"] = Relationship(back_populates="book", cascade_delete=True)

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )

    @property
    def chapter_count(self):
        return len(self.chapters)


class Chapter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    content: str

    index: int

    book_id: int = Field(foreign_key="book.id")
    book: Book = Relationship(back_populates="chapters")

    comments: list["Comment"] = Relationship(back_populates="chapter", cascade_delete=True)

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user: str
    content: str

    chapter_id: int = Field(foreign_key="chapter.id")
    chapter: Chapter = Relationship(back_populates="comments")

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
