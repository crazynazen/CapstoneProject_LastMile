from pydantic import BaseModel
from datetime import datetime

class SessionCreate(BaseModel):
    title: str

class MessageResponse(BaseModel):
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: str
    title: str
    created_at: datetime

    class Config:
        from_attributes = True