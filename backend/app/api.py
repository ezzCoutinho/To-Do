from ninja import NinjaAPI, Router
from django.contrib.auth import authenticate
from .models import User, Tarefa
from .schemas import UserSchema, LoginSchema, TarefaSchema, TarefaCreateSchema, TarefaUpdateSchema
from ninja.errors import HttpError
from rest_framework.authtoken.models import Token  # Certifique-se de importar Token corretamente
from typing import List

api = NinjaAPI()
router = Router()

@router.post("/register")
def register(request, payload: UserSchema):
    if payload.password != payload.confirm_password:
        raise HttpError(400, "Passwords do not match")
    if User.objects.filter(email=payload.email).exists():
        raise HttpError(400, "Email already registered")
    if User.objects.filter(username=payload.username).exists():
        raise HttpError(400, "Username already taken")

    user = User.objects.create_user(
        email=payload.email,
        username=payload.username,
        password=payload.password
    )
    return {"id": user.id, "email": user.email, "username": user.username}

@router.post("/login")
def login(request, payload: LoginSchema):
    user = authenticate(email=payload.email, password=payload.password)
    if not user:
        raise HttpError(400, "Invalid credentials")
    token, created = Token.objects.get_or_create(user=user)
    return {"token": token.key}

@router.get("/tarefas", response=List[TarefaSchema])
def listar_tarefas(request):
    return Tarefa.objects.all()

@router.post("/tarefas", response=TarefaSchema)
def criar_tarefa(request, payload: TarefaCreateSchema):
    tarefa = Tarefa.objects.create(**payload.dict())
    return tarefa

@router.put("/tarefas/{tarefa_id}", response=TarefaSchema)
def atualizar_tarefa(request, tarefa_id: int, payload: TarefaUpdateSchema):
    try:
        tarefa = Tarefa.objects.get(id=tarefa_id)
        for attr, value in payload.dict().items():
            setattr(tarefa, attr, value)
        tarefa.save()
        return tarefa
    except Tarefa.DoesNotExist:
        raise HttpError(404, "Tarefa não encontrada")

@router.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(request, tarefa_id: int):
    try:
        tarefa = Tarefa.objects.get(id=tarefa_id)
        tarefa.delete()
        return {"success": True}
    except Tarefa.DoesNotExist:
        raise HttpError(404, "Tarefa não encontrada")

api.add_router("/", router)
