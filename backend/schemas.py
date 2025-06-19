from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BookPublic(BaseModel):
    id: int
    title: str
    title_original: str
    description: str
    tags: str
    cover_path: str
    chapter_count: int


class BookPreview(BaseModel):
    id: int
    title: str
    title_original: str
    cover_path: str


class BookCreate(BaseModel):
    title: str
    title_original: str
    description: str
    tags: str


class BookUpdate(BaseModel):
    title: Optional[str] = None
    title_original: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None


class ChapterPublic(BaseModel):
    id: int
    index: int
    title: str
    content: str

    total_amount: Optional[int] = None


class ChapterOverview(BaseModel):
    id: int
    index: int
    title: str
    updated_at: datetime


class ChapterCreate(BaseModel):
    book_id: int
    title: str
    content: str


class ChapterSwap(BaseModel):
    book_id: int
    index_from: int
    index_to: int


class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class CommentPublic(BaseModel):
    id: int
    user: str
    content: str
    updated_at: datetime


class CommentCreate(BaseModel):
    user: str
    content: str
