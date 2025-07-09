from ast import List
import os
from typing import Optional

from fastapi import UploadFile

from models import Chapter


def get_file_ext(filename: Optional[str], default="png"):
    if filename is not None:
        parts = filename.split(".")

        if len(parts) > 1:
            return parts[-1]

    return default


def save_cover(image: UploadFile, id: str):
    filename = f"{id}.{get_file_ext(image.filename)}"
    path = f"covers/{filename}"

    with open(path, "wb+") as f:
        f.write(image.file.read())

    return filename


def delete_cover(filename: str):
    path = f"covers/{filename}"

    if os.path.exists(path):
        os.remove(path)


def get_chapter_sequence(chapters: list[Chapter]):
    if len(chapters) == 0:
        return chapters

    res: list[Chapter] = []

    prev_index = chapters[0].index
    for chapter in chapters:
        if abs(prev_index - chapter.index) > 1:
            break
        
        res.append(chapter)

        prev_index = chapter.index

    return res
