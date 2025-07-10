from typing import List, Optional, Sequence
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, false, func, or_, select, true
from sqlalchemy.orm import Session

import crud
from db import get_session
from models import Book, Chapter
from schemas import ChapterCreate, ChapterOverview, ChapterPublic, ChapterReorder, ChapterUpdate
from security import check_access_token
from utils import get_chapter_sequence


router = APIRouter()


@router.get("/query/", response_model=ChapterPublic)
def query_one(
    book_id: str, index: int, volume: Optional[int] = None, session: Session = Depends(get_session)
):
    entry: Optional[Chapter] = crud.query_one(
        session, Chapter, and_(Chapter.book_id == book_id, Chapter.volume == volume, Chapter.index == index)
    )

    if not entry:
        raise HTTPException(404)

    return entry


@router.get("/query", response_model=List[ChapterOverview])
def query_many(book_id: str, volume: Optional[int] = None, session: Session = Depends(get_session)):
    return crud.query_many(
        session,
        Chapter,
        and_(Chapter.book_id == book_id, or_(Chapter.volume == volume, true if volume is None else false)),
        [Chapter.volume, Chapter.index],
    )


@router.post("", response_model=ChapterPublic)
def create(
    create_request: ChapterCreate,
    book_id: str,
    replace: bool = False,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, book_id):
        raise HTTPException(404)

    # Получить главу с идентичным томом/номером
    current: Optional[Chapter] = crud.query_one(
        session,
        Chapter,
        and_(
            Chapter.book_id == book_id,
            Chapter.volume == create_request.volume,
            Chapter.index == create_request.index,
        ),
    )

    # Перезапись идентичной главы
    if current:
        if not replace:
            raise HTTPException(400)
        else:
            crud.delete(session, Chapter, current.id, commit=False)

    # Определить номер главы если он не указан
    if create_request.index is None:
        stmt = select(func.max(Chapter.index)).where(
            and_(Chapter.book_id == book_id, Chapter.volume == create_request.volume)
        )

        last_index = session.scalar(stmt)
        create_request.index = (last_index + 1) if last_index is not None else 1

    return crud.create(session, Chapter, create_request.model_dump(), book_id=book_id)


@router.post("/reorder/{id}")
def reorder(
    id: int,
    reorder_request: ChapterReorder,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    current_chapter: Optional[Chapter] = crud.get_one(session, Chapter, id)
    if not current_chapter:
        raise HTTPException(404)

    # todo: проверки там всякие на корректность входа

    # Заблокировать все главы книги
    # todo: протестировать работу блокировки
    session.execute(select(Chapter).where(Chapter.book_id == current_chapter.book_id).with_for_update())
    session.refresh(current_chapter)

    # Сдвинуть главы после целевой главы
    to_chapters: List[Chapter] = crud.query_many(
        session,
        Chapter,
        and_(
            Chapter.book_id == current_chapter.book_id,
            Chapter.volume == reorder_request.volume,
            Chapter.index >= reorder_request.index,
        ),
        Chapter.index,
    )
    to_chapters = get_chapter_sequence(to_chapters)

    if len(to_chapters) > 0 and to_chapters[0].index == reorder_request.index:
        for chapter in to_chapters:
            chapter.index += 1

    session.add_all(to_chapters)

    # Сдвинуть главы после текущей главы
    from_chapters: List[Chapter] = crud.query_many(
        session,
        Chapter,
        and_(
            Chapter.book_id == current_chapter.book_id,
            Chapter.volume == current_chapter.volume,
            Chapter.index > current_chapter.index,
        ),
        Chapter.index,
    )
    from_chapters = get_chapter_sequence(from_chapters)

    if len(from_chapters) > 0 and from_chapters[0].index == current_chapter.index + 1:
        for chapter in from_chapters:
            chapter.index -= 1

    session.add_all(from_chapters)

    # Изменить номер текущей главы
    current_chapter.index = reorder_request.index
    current_chapter.volume = reorder_request.volume
    session.add(current_chapter)

    session.commit()

    return {"from": from_chapters, "to": to_chapters}


@router.get("", response_model=list[ChapterOverview])
def list(book_id: str, session: Session = Depends(get_session)):
    return None


@router.get("/{id}", response_model=ChapterPublic)
def show(id: int, session: Session = Depends(get_session)):
    chapter: Optional[Chapter] = crud.get_one(session, Chapter, id)

    if chapter == None:
        raise HTTPException(404)

    return chapter


@router.put("/{id}", response_model=ChapterPublic)
def update(
    id: int,
    update_request: ChapterUpdate,
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    chapter: Optional[Chapter] = crud.get_one(session, Chapter, id)
    if not chapter:
        raise HTTPException(404)

    # Получить главу с идентичным томом/номером
    current: Optional[Chapter] = crud.query_one(
        session,
        Chapter,
        and_(
            Chapter.book_id == chapter.book_id,
            Chapter.id != id,
            Chapter.volume == update_request.volume,
            Chapter.index == update_request.index,
        ),
    )
    if current:
        raise HTTPException(400)

    chapter = crud.update(session, Chapter, id, update_request.model_dump())

    # а как пустые поля задавать?
    if chapter and update_request.volume is None:
        chapter.volume = None
    session.add(chapter)
    session.commit()

    return chapter


@router.delete("/{id}")
def delete(id: int, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Chapter, id):
        raise HTTPException(404)

    # Обновить порядок
    current_chapter: Chapter = crud.get_one(session, Chapter, id)

    # блокировка всех глав книги
    session.execute(select(Chapter).where(Chapter.book_id == current_chapter.book_id).with_for_update())
    session.refresh(current_chapter)

    chapters: List[Chapter] = crud.query_many(
        session,
        Chapter,
        and_(
            Chapter.book_id == current_chapter.book_id,
            Chapter.volume == current_chapter.volume,
            Chapter.index > current_chapter.index,
        ),
    )
    chapters = get_chapter_sequence(chapters)

    if chapters[0].index == current_chapter.index + 1:
        for chapter in chapters:
            chapter.index -= 1

    session.delete(current_chapter)
    session.add_all(chapters)
    session.commit()
