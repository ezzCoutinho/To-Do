from ninja import NinjaAPI, Router
from .models import Tarefa
from .schemas import TarefaSchema
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .models import Usuario
from .schemas import RegistroSchema

api = NinjaAPI()
router = Router()

@api.post("/register/")
def register_user(request, data: RegistroSchema):
    # Verifica se as senhas são iguais
    if data.password != data.confirm_password:
        return {"error": "As senhas não coincidem."}

    # Verifica se o e-mail já está em uso
    if Usuario.objects.filter(email=data.email).exists():
        return {"error": "Este e-mail já está cadastrado."}

    # Verifica se o username já está em uso
    if Usuario.objects.filter(username=data.username).exists():
        return {"error": "Este nome de usuário já está em uso."}

    # Criar o usuário
    try:
        user = Usuario.objects.create(
            username=data.username,
            email=data.email,
            password=make_password(data.password)  # Hash da senha
        )
        return {"message": "Usuário cadastrado com sucesso!", "user_id": user.id}

    except ValidationError as e:
        return {"error": str(e)}

@router.get("/tarefas/", response=list[TarefaSchema])
def listar_tarefas(request):
    return Tarefa.objects.all()
