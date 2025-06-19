from ast import List
from typing import Any
from sqlalchemy import func
from sqlmodel import SQLModel, Session, select


def get_one(session: Session, model, id):
    return session.get(model, id)


def query_one(session: Session, model, filter=None):
    statement = select(model)

    if filter is not None:
        statement = statement.where(filter)
    return session.exec(statement).one_or_none()


def query_many(session: Session, model, filter=None, order=None):  # todo: пагинация?
    statement = select(model)

    if filter is not None:
        statement = statement.where(filter)

    if order is not None:
        statement = statement.order_by(order)

    return session.exec(statement).all()


def count(session: Session, model, filter=None):
    statement = select(func.count(model.id))

    if filter is not None:
        statement = statement.where(filter)

    return session.exec(statement).one()


def exists(session: Session, model, id):
    return count(session, model, model.id == id) > 0


def create(session: Session, model, data: dict, **values):
    entry = model(**data, **values)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def delete(session: Session, model, id):
    entry = get_one(session, model, id)
    session.delete(entry)
    session.commit()
    return entry


def update(session: Session, model, id, data: dict):
    entry = get_one(session, model, id)
    if entry is None:
        return None

    for key, value in data.items():
        if value is not None:
            setattr(entry, key, value)
    session.commit()
    session.refresh(entry)
    return entry
