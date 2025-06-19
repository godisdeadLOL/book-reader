import json
import os
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session

import crud
from db import get_session
from models import Book
from schemas import BookCreate, BookPreview, BookPublic, BookUpdate
from security import check_access_token
from utils import get_file_ext


router = APIRouter()


@router.get("", response_model=list[BookPreview])
def list(session: Session = Depends(get_session)):
    return crud.query_many(session, Book)


@router.get("/{id}", response_model=BookPublic)
def show(id: int, session: Session = Depends(get_session)):
    book = crud.get_one(session, Book, id)

    if book == None:
        raise HTTPException(404)

    return book


_book_create_payload = '{"title": "Title", "title_original": "Title Original", "description": "Description", "tags": "tag 1, tag 2"}'


@router.post("", response_model=BookPublic)
def create(
    payload: str = Form(default=_book_create_payload),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    try:
        data = json.loads(payload)
        create_request = BookCreate(**data)
    except:
        raise HTTPException(422)

    # Создать экземлпяр книги
    book = Book(**create_request.model_dump())
    session.add(book)
    session.flush()
    session.refresh(book)

    # Сохранить изображение
    image_file = f"{book.id}.{get_file_ext(image.filename)}"
    image_path = f"./covers/{image_file}"

    with open(image_path, "wb+") as f:
        f.write(image.file.read())

    book.cover_path = image_file

    session.commit()
    return book


_book_update_payload = '{"title": "Title", "title_original": "Title Original", "description": "Description", "tags": "tag 1, tag 2"}'


@router.put("/{id}", response_model=BookPublic)
def update(
    id: int,
    payload: str = Form(default=_book_update_payload),
    image: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    access_check=Depends(check_access_token),
):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, id):
        raise HTTPException(404)

    try:
        data = json.loads(payload)
        update_request = BookUpdate(**data)
    except:
        raise HTTPException(422)

    book = crud.update(session, Book, id, update_request.model_dump())
    assert type(book) is Book

    # Обновить изображение
    if image is not None:
        # Удалить старое
        if book.cover_path is not None:
            try:
                os.remove(f"./covers/{book.cover_path}")
            except:
                pass

        # Загрузить новое
        image_file = f"{book.id}.{get_file_ext(image.filename)}"
        image_path = f"./covers/{image_file}"

        with open(image_path, "wb+") as f:
            f.write(image.file.read())

        book.cover_path = image_file
        session.add(book)
        session.commit()

    return book


@router.delete("/{id}", response_model=BookPublic)
def delete(id: int, session: Session = Depends(get_session), access_check=Depends(check_access_token)):
    if not access_check:
        raise HTTPException(401)

    if not crud.exists(session, Book, id):
        raise HTTPException(404)

    book = crud.delete(session, Book, id)
    assert type(book) is Book

    # Удалить обложку
    if book.cover_path is not None:
        try: os.remove(f"./covers/{book.cover_path}")
        except: pass

    return book
