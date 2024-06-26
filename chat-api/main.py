from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langfuse.callback import CallbackHandler

from src.custom_exception import handle_errors
from src.llm import conversation
from src.request_model import Chat

from config import settings

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"success": True}

@app.post("/chat/message")
@handle_errors
def chat(data: Chat):
    langfuse_handler = CallbackHandler(
        public_key=settings.LANGFUSE_PK_KEY,
        secret_key=settings.LANGFUSE_SK_KEY,
        host=settings.LANGFUSE_HOST,
        session_id=data.session_id,
        user_id=data.name
    )
    answer = conversation(data.message, [langfuse_handler])
    langfuse_handler.flush()

    return {
        "success": True,
        "data": {
            "answer": answer,
        },
    }