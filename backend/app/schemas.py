from ninja import Schema
from pydantic import EmailStr, constr

class TarefaSchema(Schema):
    id: int
    titulo: str
    descricao: str | None
    status: str
    responsavel: str | None

class RegistroSchema(Schema):
    username: constr(min_length=3, max_length=150)
    email: EmailStr
    password: constr(min_length=6)
    confirm_password: str

