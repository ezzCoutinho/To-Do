from ninja import Schema

class UserSchema(Schema):
    email: str
    username: str
    password: str
    confirm_password: str

class LoginSchema(Schema):
    email: str
    password: str

class TarefaSchema(Schema):
    id: int
    titulo: str
    descricao: str = None
    status: str

class TarefaCreateSchema(Schema):
    titulo: str
    descricao: str = None
    status: str

class TarefaUpdateSchema(Schema):
    titulo: str = None
    descricao: str = None
    status: str = None
