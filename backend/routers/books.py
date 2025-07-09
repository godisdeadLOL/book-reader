import json
import os
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

import crud
from db import get_session
from sqlalchemy.orm import Session

from models import Book
from schemas import BookCreate, BookPreview, BookPublic, BookUpdate
from security import check_access_token
from utils import delete_cover, get_file_ext, save_cover


router = APIRouter()


@router.get("", response_model=list[BookPreview])
def list(session: Session = Depends(get_session)):
    return crud.query_many(session, Book)


@router.get("/{id}", response_model=BookPublic)
def show(id: str, session: Session = Depends(get_session)):
    book: Optional[Book] = crud.get_one(session, Book, id)

    if book == None:
        raise HTTPException(404)

    return book


@router.post("/{id}", response_model=BookPublic)
def create(
    id: str,
    create_request: BookCreate = Form(...),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if crud.exists(session, Book, id):
        raise HTTPException(400)

    cover_path = save_cover(image, id)

    try:
        book = crud.create(session, Book, create_request.model_dump(), id=id, cover_path=cover_path)
    except Exception as e:
        delete_cover(cover_path)
        raise e

    return book


@router.delete("/{id}")
def delete(id: str, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, id):
        raise HTTPException(404)

    book: Book = crud.delete(session, Book, id)

    if book.cover_path is not None:
        try:
            os.remove(f"covers/{book.cover_path}")
        except:
            pass


@router.put("/{id}", response_model=BookPublic)
def update(
    id: str,
    update_request: BookUpdate = Form(...),
    image: UploadFile = File(None),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, id):
        raise HTTPException(404)

    if (
        update_request.id is not None
        and id != update_request.id
        and crud.exists(session, Book, update_request.id)
    ):
        raise HTTPException(400)

    book: Book = crud.update(session, Book, id, update_request.model_dump())

    if image is not None:
        assert book.cover_path
        delete_cover(book.cover_path)
        cover_path = save_cover(image, id)

        book.cover_path = cover_path
        session.add(book)
        session.commit()

    return book
