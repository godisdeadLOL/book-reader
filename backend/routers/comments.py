import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
import requests
from sqlmodel import Session, and_

import crud
from db import get_session
from models import Chapter, Comment
from schemas import BookCreate, CommentCreate, CommentPublic
from security import check_access_token


router = APIRouter()


@router.get("", response_model=list[CommentPublic])
def list(book_id: int, chapter_index: int, session: Session = Depends(get_session)):
    chapter: Optional[Chapter] = crud.query_one(
        session, Chapter, and_(Chapter.book_id == book_id, Chapter.index == chapter_index)
    )

    if chapter is None:
        raise HTTPException(404)

    return crud.query_many(session, Comment, Comment.chapter_id == chapter.id)


@router.post("", response_model=CommentPublic)
def create(
    book_id: int,
    chapter_index: int,
    create_request: CommentCreate,
    captcha: str = Header(default=None),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    # Проверка капчи
    if access_check is None:
        response = requests.post(
            f"https://www.google.com/recaptcha/api/siteverify?secret={os.environ['SITE_SECRET']}&response={captcha}"
        )
        success: bool = response.json()["success"]

        if not success:
            raise HTTPException(422)
    elif not access_check:
        raise HTTPException(401)

    chapter: Optional[Chapter] = crud.query_one(
        session, Chapter, and_(Chapter.book_id == book_id, Chapter.index == chapter_index)
    )

    if chapter is None:
        raise HTTPException(404)

    data = create_request.model_dump()
    data["chapter_id"] = chapter.id

    return crud.create(session, Comment, data)


@router.delete("/{id}", response_model=CommentPublic)
def delete(id: int, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Comment, id):
        return HTTPException(404)

    return crud.delete(session, Comment, id)
