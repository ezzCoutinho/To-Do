from ninja import NinjaAPI
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from apidemo.schemas import RegisterSchema, LoginSchema
from django.core.exceptions import ValidationError


api = NinjaAPI()

@api.get("/todos", response=list)
def get_todos(request):
    return [{"id": 1, "title": "Task 1"}, {"id": 2, "title": "Task 2"}]

@api.post("/login")
def login(request, data: LoginSchema):
  user = authenticate(username=data.username, password=data.password)
  if user is not None:
    return {"success": True, "message": "Usuário autenticado."}
  else:
    return {"success": False, "message": "Usuário não autenticado."}

@api.post("/register")
def register(request, data: RegisterSchema):
  if User.objects.filter(username=data.username).exists():
    return {"success": False, "message": "Usuário já existe."}
  if User.objects.filter(email=data.email).exists():
    return {"success": False, "message": "Email já existe."}

  try:
      user = User.objects.create_user(username=data.username, email=data.email, password=data.password)
  except ValidationError as e:
      return {"success": False, "message": str(e)}
  return {"success": True, "message": "Usuário criado."}


@api.get("/test-auth")
def test_auth(request):
    return {"success": True, "message": "Autenticação bem-sucedida."}
