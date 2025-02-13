from ninja import NinjaAPI, Router, Form
from ninja.files import UploadedFile
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Tarefa
from channels.layers import get_channel_layer
from .schemas import UserSchema, LoginSchema, TarefaSchema, TarefaCreateSchema, TarefaUpdateSchema
from asgiref.sync import async_to_sync
from ninja.errors import HttpError
from rest_framework.authtoken.models import Token
from typing import List
from .authentication import TokenAuth
import logging
import json
from minio import Minio
from minio.error import S3Error
from django.http import JsonResponse
import io

api = NinjaAPI()
router = Router()

def enviar_websocket(tarefa):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "tarefas",
        {
            "type": "send_message",
            "message": json.dumps({
                "id": tarefa.id,
                "titulo": tarefa.titulo,
                "descricao": tarefa.descricao,
                "status": tarefa.status,
                "usuario": tarefa.usuario.username,
            }),
        }
    )

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
def criar_tarefa(request, payload: TarefaCreateSchema = Form(...), file: UploadedFile = None):
  """
  Cria uma nova tarefa e a associa ao usuário autenticado.
  """
  if not request.auth:
      raise HttpError(401, "Usuário não autenticado")

  file_url = None

  if file:
      file_ext = file.name.split(".")[-1]
      file_name = f"{uuid.uuid4()}.{file_ext}"
      file_data = file.read()
      file_size = len(file_data)

      minio_client.put_object(
          MINIO_BUCKET_NAME,
          file_name,
          data=io.BytesIO(file_data),
          length=file_size,
          content_type=file.content_type
      )

      file_url = f"http://{MINIO_URL}/{MINIO_BUCKET_NAME}/{file_name}"

  tarefa = Tarefa.objects.create(
      titulo=payload.titulo,
      descricao=payload.descricao,
      status=payload.status,
      usuario=request.auth,  # ✅ Agora `request.auth` contém o usuário autenticado
      file_url=file_url
  )

  enviar_websocket(tarefa)

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

  enviar_websocket(tarefa)

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

# Endpoint de upload de arquivos
logger = logging.getLogger(__name__)

MINIO_URL = "localhost:9000"
MINIO_ACCESS_KEY = "miniouser"
MINIO_SECRET_KEY = "miniosecurepassword"
MINIO_BUCKET_NAME = "meu-bucket"

minio_client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # Defina como True se estiver usando HTTPS
)

import uuid

# Configurações do MinIO
MINIO_URL = "localhost:9000"
MINIO_ACCESS_KEY = "miniouser"
MINIO_SECRET_KEY = "miniosecurepassword"
MINIO_BUCKET_NAME = "meu-bucket"

minio_client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # Defina como True se estiver usando HTTPS
)

@router.post("/upload", response=dict)
async def upload_file(request, file: UploadedFile):
    """
    Recebe um arquivo e o armazena no MinIO.
    """
    try:
        # Gera um nome único para o arquivo
        file_ext = file.name.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"

        # Salva o arquivo no MinIO
        file_data = file.read()
        file_size = len(file_data)

        minio_client.put_object(
            MINIO_BUCKET_NAME,
            file_name,
            data=io.BytesIO(file_data),
            length=file_size,
            content_type=file.content_type
        )

        # URL do arquivo armazenado
        file_url = f"http://{MINIO_URL}/{MINIO_BUCKET_NAME}/{file_name}"

        return {"message": "Arquivo enviado com sucesso!", "file_url": file_url}

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
api.add_router("/", router)
