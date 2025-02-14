from ninja import Schema
from pydantic import BaseModel, EmailStr

class UserSchema(Schema):
    email: str
    username: str
    password: str
    confirm_password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TarefaSchema(Schema):
    id: int
    titulo: str
    descricao: str = None
    status: str
    file_url: str = None

class TarefaCreateSchema(Schema):
    titulo: str
    descricao: str = None
    status: str

class TarefaUpdateSchema(Schema):
    titulo: str = None
    descricao: str = None
    status: str = None
    file_url: str = None
