from math import ceil
from fastapi import APIRouter, Depends, HTTPException, Header, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from captcha import check_captcha
import crud
from db import get_session
from models import Chapter, Comment
from schemas import CommentCreate, CommentPublic
from security import check_access_token


router = APIRouter()


@router.get("", response_model=list[CommentPublic])
def list(response: Response, chapter_id: int, page: int = 1, session: Session = Depends(get_session)):
    if not crud.exists(session, Chapter, chapter_id):
        raise HTTPException(404)

    page_size = 5
    total_pages = max(0, ceil(crud.count(session, Comment, Comment.chapter_id == chapter_id) / page_size))

    stmt = (
        select(Comment)
        .where(Comment.chapter_id == chapter_id)
        .order_by(Comment.created_at.desc())
        .offset(page_size * (page - 1))
        .limit(page_size)
    )
    comments = session.execute(stmt).scalars().all()

    response.headers["X-Total-Pages"] = str(total_pages)

    return comments


@router.post("", response_model=CommentPublic)
def create(
    chapter_id: int,
    create_request: CommentCreate,
    captcha: str = Header(default=None),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if access_check is None:
        if not captcha or not check_captcha(captcha):
            raise HTTPException(422)
    elif not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Chapter, chapter_id):
        raise HTTPException(404)

    data = create_request.model_dump()
    data["chapter_id"] = chapter_id

    return crud.create(session, Comment, data)


@router.delete("/{id}", response_model=CommentPublic)
def delete(id: int, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Comment, id):
        return HTTPException(404)

    return crud.delete(session, Comment, id)
