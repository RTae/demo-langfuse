from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
)
from langchain.schema import SystemMessage
from config import settings
import os

os.environ["OPENAI_API_KEY"] = settings.CHATGPT_KEY
model = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content="""
    You are a helpful assistant. Answer all questions to the best of your ability.
"""
        ),
        MessagesPlaceholder(
            variable_name="chat_history", optional=True
        ),
        HumanMessagePromptTemplate.from_template(
            "{input}"
        ),
    ]
)
chain = prompt | model | StrOutputParser()

def conversation(question: str, callbacks: list):
    answer = chain.invoke(
            {"input": question,},
            config={"callbacks": callbacks}
        )
    
    return answer