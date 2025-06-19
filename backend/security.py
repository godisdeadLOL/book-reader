import os
from typing import Optional

from fastapi import Depends, Header
from fastapi.security import APIKeyHeader

token_scheme = APIKeyHeader(name="token", auto_error=False)

def check_access_token(token: Optional[str] = Depends(token_scheme)) -> Optional[bool]:
    if token == None:
        return None
    
    return token == os.environ["ACCESS_TOKEN"]
