import asyncio
import os
import random
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from db import init_db

from routers.books import router as books_router
from routers.chapters import router as chapters_router
from routers.comments import router as comments_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)


@app.get("/test")
def test_endpoint():
    return "test indeed"


app.include_router(books_router, prefix="/books", tags=["Books"])
app.include_router(chapters_router, prefix="/chapters", tags=["Chapters"])
app.include_router(comments_router, prefix="/comments", tags=["Comments"])

app.mount("/covers", StaticFiles(directory="covers"), name="covers")

# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
# @app.exception_handler(404)
# def redirect_to_index(request: Request, exc):
#     return FileResponse("../frontend/dist/index.html")


@app.on_event("startup")
def on_startup():
    load_dotenv()
    init_db()


# todo: проверка деплой ли
@app.middleware("http")
async def emulate_latency(request: Request, call_next):
    if os.environ["PRODUCTION"] != "true":
        await asyncio.sleep(1 + 1 * random.random())
    return await call_next(request)
