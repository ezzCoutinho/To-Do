from ninja import NinjaAPI, Router
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Tarefa
from .schemas import UserSchema, LoginSchema, TarefaSchema, TarefaCreateSchema, TarefaUpdateSchema
from ninja.errors import HttpError
from rest_framework.authtoken.models import Token
from typing import List

api = NinjaAPI()
router = Router()
api.add_router("/", router)

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
    # if not request.user.is_authenticated:
    #     raise HttpError(401, "Usuário não autenticado")
    """
    Lista todas as tarefas, ordenadas pelo ID (ou outro critério se necessário).
    """
    return Tarefa.objects.all().order_by("-id")  # Mantém a ordem para evitar confusão

@router.post("/tarefas", response=TarefaSchema)
def criar_tarefa(request, payload: TarefaCreateSchema):
    """
    Cria uma nova tarefa.
    """
    tarefa = Tarefa.objects.create(**payload.dict())
    return tarefa

@router.put("/tarefas/{tarefa_id}", response=TarefaSchema)
def atualizar_tarefa(request, tarefa_id: int, payload: TarefaUpdateSchema):
    """
    Atualiza uma tarefa existente. Apenas os campos enviados serão alterados.
    """
    tarefa = get_object_or_404(Tarefa, id=tarefa_id)  # Usa `get_object_or_404` para melhor tratamento de erro
    data = payload.dict(exclude_unset=True)  # Evita sobrescrever com valores vazios

    if "status" in data:
        print(f"Atualizando status da tarefa {tarefa_id} para: {data['status']}")  # Log para debug

    for attr, value in data.items():
        setattr(tarefa, attr, value)

    tarefa.save()
    return tarefa

@router.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(request, tarefa_id: int):
    """
    Deleta uma tarefa pelo ID.
    """
    tarefa = get_object_or_404(Tarefa, id=tarefa_id)
    tarefa.delete()
    return {"success": True}
