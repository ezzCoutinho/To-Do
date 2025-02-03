from ninja import Schema
from pydantic import EmailStr, constr

class TarefaSchema(Schema):
    id: int
    titulo: str
    descricao: str | None
    concluida: bool

class TarefaCreateSchema(Schema):
    titulo: str
    descricao: str | None
    concluida: bool

class TarefaSchema(TarefaCreateSchema):
    id: int

class RegistroSchema(Schema):
    username: constr(min_length=3, max_length=150)
    email: EmailStr
    password: constr(min_length=6)
    confirm_password: str

