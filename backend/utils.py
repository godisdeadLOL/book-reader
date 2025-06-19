from typing import Optional


def get_file_ext(filename: Optional[str]):
    if filename is not None:
        parts = filename.split(".")

        if len(parts) > 1:
            return parts[-1]

    return "png"
