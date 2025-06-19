from operator import index
from typing import Any, List, Optional, Sequence
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session, and_, func, select

import crud
from db import get_session
from models import Book, Chapter
from schemas import ChapterCreate, ChapterOverview, ChapterPublic, ChapterSwap, ChapterUpdate
from security import check_access_token


router = APIRouter()


@router.get("/", response_model=ChapterPublic)
def show(book_id: int, chapter_index: int, session: Session = Depends(get_session)):
    chapter: Optional[Chapter] = crud.query_one(
        session, Chapter, and_(Chapter.book_id == book_id, Chapter.index == chapter_index)
    )

    if not chapter:
        raise HTTPException(404)

    chapter_public = ChapterPublic.model_validate(chapter.__dict__, strict=False)
    chapter_public.total_amount = crud.count(session, Chapter, Chapter.book_id == book_id)

    return chapter_public


@router.get("", response_model=list[ChapterOverview])
def list(book_id: int, session: Session = Depends(get_session)):
    if not crud.exists(session, Book, book_id):
        raise HTTPException(404)

    return crud.query_many(session, Chapter, Chapter.book_id == book_id, Chapter.index)


@router.post("", response_model=ChapterPublic)
def create(
    create_request: ChapterCreate,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, create_request.book_id):
        raise HTTPException(404)

    last_index = session.exec(
        select(func.max(Chapter.index)).where(Chapter.book_id == create_request.book_id)
    ).one_or_none()

    if last_index is None:
        last_index = 0

    return crud.create(session, Chapter, create_request.model_dump(), index=last_index + 1)


@router.put("/{id}", response_model=ChapterPublic)
def update(
    id: int,
    update_request: ChapterUpdate,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Chapter, id):
        raise HTTPException(404)

    return crud.update(session, Chapter, id, update_request.model_dump())


@router.post("/swap")
def swap(
    swap_request: ChapterSwap,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    index_from = swap_request.index_from
    index_to = swap_request.index_to

    chapters: Sequence[Chapter]
    if index_from < index_to:
        chapters = crud.query_many(
            session, Chapter, and_(Chapter.index >= index_from, Chapter.index <= index_to), Chapter.index
        )

        chapters[0].index = index_to
        for i in range(1, len(chapters)):
            chapters[i].index -= 1
    elif index_from > index_to:
        chapters = crud.query_many(
            session, Chapter, and_(Chapter.index >= index_to, Chapter.index <= index_from), Chapter.index
        )

        chapters[-1].index = index_to
        for i in range(0, len(chapters) - 1):
            chapters[i].index += 1
    else:
        return

    session.add_all(chapters)
    session.commit()


@router.delete("/{id}", response_model=ChapterPublic)
def delete(id: int, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Chapter, id):
        raise HTTPException(404)

    # Обновить порядок
    current_chapter = crud.get_one(session, Chapter, id)
    assert type(current_chapter) is Chapter

    chapters: Sequence[Chapter] = crud.query_many(
        session,
        Chapter,
        and_(Chapter.book_id == current_chapter.book_id, Chapter.index > current_chapter.index),
    )
    for chapter in chapters:
        chapter.index -= 1

    session.delete(current_chapter)
    session.add_all(chapters)
    session.commit()
    
    return current_chapter
