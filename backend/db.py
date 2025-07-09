from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=False)


def init_db():
    Base.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
