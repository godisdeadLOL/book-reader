from typing import Any, Iterable, List, Optional, TypeVar

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Base


def count(session: Session, model, filter=None) -> int:
    stmt = select(func.count(model.id))

    if filter is not None:
        stmt = stmt.where(filter)

    count = session.scalars(stmt).first()
    assert count is not None

    return count


def exists(session: Session, model, id):
    return count(session, model, model.id == id) > 0


def create(session: Session, model, data: dict, **values) -> Any:
    entry = model(**data, **values)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def get_one(session: Session, model, id) -> Any:
    stmt = select(model).where(model.id == id)
    entry = session.scalars(stmt).first()

    return entry


def delete(session: Session, model, id, commit=True) -> Any:
    entry = get_one(session, model, id)
    session.delete(entry)
    if commit:
        session.commit()
    return entry


def query_one(session: Session, model, filter=None) -> Any:
    statement = select(model)

    if filter is not None:
        statement = statement.where(filter)
    return session.scalars(statement).first()


def query_many(session: Session, model, filter=None, order: Any = None) -> Any:  # todo: пагинация?
    statement = select(model)

    if filter is not None:
        statement = statement.where(filter)

    if order is not None:
        elements: list = []
        if isinstance(order, Iterable):
            elements.extend(order)
        else:
            elements.append(order)

        statement = statement.order_by(*elements)

    return session.scalars(statement).all()


def update(session: Session, model, id, data: dict) -> Any:
    entry = get_one(session, model, id)
    if entry is None:
        return None

    for key, value in data.items():
        if value is not None:
            setattr(entry, key, value)
    session.commit()
    session.refresh(entry)
    return entry
