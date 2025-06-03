from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from ninja import NinjaAPI
from ninja.errors import HttpError

from myproject.schemas.auth_schema import LoginIn, TokenOut
from myproject.schemas.task_schema import TaskIn, TaskOut, TaskCreateIn
from myproject.schemas.user_schema import UserIn, UserOut
from tasks.models import Task

from .auth_utils import generate_jwt_token
from .middlewares.auth_middleware import JWTAuth

api = NinjaAPI()

jwt_auth = JWTAuth()


@api.post("/register", response=UserOut)
def create_user(request, data: UserIn):
    user = User.objects.create(
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=make_password(data.password),
    )
    return UserOut(id=user.id, username=user.username)


@api.post("/login", response=TokenOut)
def login(request, data: LoginIn):
    user = authenticate(username=data.username, password=data.password)
    if user:
        token = generate_jwt_token(user.id, user.username)
        return TokenOut(access_token=token, user_id=user.id, username=user.username)

    raise HttpError(401, "Credenciais inválidas")


@api.get("/get_users", response=list[UserOut])
def get_users(request):
    users = User.objects.all()
    return users


@api.get("/me", response=UserOut, auth=jwt_auth)
def get_current_user(request):
    user = request.auth
    return UserOut(id=user.id, username=user.username)


@api.post("/tasks", response=TaskOut, auth=jwt_auth)
def create_task(request, data: TaskCreateIn):
    """
    Cria uma nova tarefa para o usuário autenticado
    """
    user = request.auth
    task = Task.objects.create(
        title=data.title,
        description=data.description,
        status=data.status,
        author=user,
        due_date=data.due_date,
    )
    return TaskOut(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        completed=task.completed,
        author=task.author.username,
        created_at=task.created_at,
        updated_at=task.updated_at,
        due_date=task.due_date,
    )


@api.get("/my_tasks", response=list[TaskOut], auth=jwt_auth)
def get_my_tasks(request):
    """
    Retorna tarefas do usuário autenticado
    """
    user = request.auth
    tasks = Task.objects.filter(author=user)
    return [
        TaskOut(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            completed=task.completed,
            author=task.author.username,
            created_at=task.created_at,
            updated_at=task.updated_at,
            due_date=task.due_date,
        )
        for task in tasks
    ]
