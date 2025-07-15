import os
import requests


def check_captcha(captcha: str):
    response = requests.post(
        f"https://www.google.com/recaptcha/api/siteverify?secret={os.environ['SITE_SECRET']}&response={captcha}"
    )
    response.raise_for_status()
    
    return response.json()["success"]
