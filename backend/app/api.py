from ninja import NinjaAPI, Router
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Tarefa
from .schemas import UserSchema, LoginSchema, TarefaSchema, TarefaCreateSchema, TarefaUpdateSchema
from ninja.errors import HttpError
from rest_framework.authtoken.models import Token
from typing import List
from ninja.security import HttpBearer
from .authentication import TokenAuth

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
  print(f"🔍 Tentativa de login para: {payload.email}")  # Log

  # Verifica manualmente se o usuário existe
  from app.models import User
  try:
      user_check = User.objects.get(email=payload.email)
      print(f"✅ Usuário existe: {user_check}")
  except User.DoesNotExist:
      print("❌ Usuário NÃO encontrado no banco de dados!")
      raise HttpError(401, "Usuário não encontrado!")

  # Testa autenticação
  user = authenticate(request, username=payload.email, password=payload.password)

  if not user:
      print("❌ Autenticação falhou!")
      raise HttpError(401, "Invalid credentials")

  token, created = Token.objects.get_or_create(user=user)
  print(f"✅ Usuário autenticado: {user}, Token: {token.key}")

  return {"token": token.key}

@router.get("/tarefas", response=List[TarefaSchema], auth=TokenAuth())
def listar_tarefas(request):
    # if not request.user.is_authenticated:
    #     raise HttpError(401, "Usuário não autenticado")
    """
    Lista todas as tarefas, ordenadas pelo ID (ou outro critério se necessário).
    """
    return Tarefa.objects.all().order_by("-id")  # Mantém a ordem para evitar confusão

@router.post("/tarefas", response=TarefaSchema, auth=TokenAuth())
def criar_tarefa(request, payload: TarefaCreateSchema):
    """
    Cria uma nova tarefa e a associa ao usuário autenticado.
    """
    if not request.auth:
        raise HttpError(401, "Usuário não autenticado")

    tarefa = Tarefa.objects.create(
        titulo=payload.titulo,
        descricao=payload.descricao,
        status=payload.status,
        usuario=request.auth  # ✅ Agora `request.auth` contém o usuário autenticado
    )
    return tarefa

@router.put("/tarefas/{tarefa_id}", auth=TokenAuth())
def atualizar_tarefa(request, tarefa_id: int, payload: TarefaUpdateSchema):
  print(f"🔍 Usuário autenticado na requisição: {request.user}")

  tarefa = get_object_or_404(Tarefa, id=tarefa_id)

  if request.user != tarefa.usuario:
    print(f"❌ Usuário {request.user} NÃO tem permissão para editar a tarefa {tarefa_id}!")
    raise HttpError(403, "Você não tem permissão para editar esta tarefa.")

  data = payload.dict(exclude_unset=True)

  for attr, value in data.items():
    setattr(tarefa, attr, value)

  tarefa.save()

  # ✅ Corrigindo o erro de serialização, convertendo o objeto em dicionário
  return {
    "id": tarefa.id,
    "titulo": tarefa.titulo,
    "descricao": tarefa.descricao,
    "status": tarefa.status,
    "usuario": tarefa.usuario.email,  # Mostra o email do usuário ao invés do objeto User
  }


@router.delete("/tarefas/{tarefa_id}", auth=TokenAuth())
def deletar_tarefa(request, tarefa_id: int):
  """
  Deleta uma tarefa pelo ID.
  """
  tarefa = get_object_or_404(Tarefa, id=tarefa_id)
  tarefa.delete()
  return {"success": True}

@router.get("/test")
def test_view(request):
  return {"message": "API está funcionando!"}

api.add_router("/", router)
