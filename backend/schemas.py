from datetime import datetime
import json
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class Base(BaseModel):
    @model_validator(mode="before")
    @classmethod
    def validate(cls, data):
        if type(data) is str:
            return json.loads(data)
        else:
            return data


#
# Book
#
class BookPublic(Base):
    id: str

    title: str
    title_original: str
    description: str
    tags: str

    cover_path: str

    chapter_count: int


class BookPreview(Base):
    id: str
    title: str
    title_original: str
    cover_path: str


class BookCreate(Base):
    title: str
    title_original: str
    description: str
    tags: str


class BookUpdate(Base):
    id: Optional[str] = None
    title: Optional[str] = None
    title_original: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None


#
# Chapter
#
class ChapterPublic(Base):
    id: int

    volume: Optional[int]
    index: int

    title: str
    content: str

    total_amount: Optional[int] = None


class ChapterOverview(Base):
    id: int

    volume: Optional[int]
    index: int

    title: str
    updated_at: datetime
    created_at: datetime


class ChapterCreate(Base):
    volume: Optional[int] = None
    index: Optional[int] = None

    title: str
    content: str


class ChapterUpdate(Base):
    volume: Optional[int] = None
    index: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None


class ChapterReorder(Base):
    volume: Optional[int] = None
    index: int


#
# Comment
#
class CommentPublic(Base):
    id: int
    user: str
    content: str
    updated_at: datetime


class CommentCreate(Base):
    user: str = Field(max_length=50)
    content: str = Field(max_length=500)
