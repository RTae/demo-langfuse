from pydantic import BaseModel

class Chat(BaseModel):
    email: str
    session_id: str
    message_id: str
    message: str