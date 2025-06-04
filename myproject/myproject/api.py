from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from ninja import NinjaAPI

from myproject.errors.error_decorator import handle_api_errors
from myproject.errors.types.http_not_found import HttpNotFound
from myproject.errors.types.http_unauthorized import HttpUnauthorized
from myproject.schemas.auth_schema import LoginIn, TokenOut
from myproject.schemas.task_schema import TaskCreateIn, TaskOut, TaskUpdateIn
from myproject.schemas.user_schema import UserIn, UserOut
from tasks.models import Task

from .auth_utils import generate_jwt_token
from .middlewares.auth_middleware import JWTAuth

api = NinjaAPI()

jwt_auth = JWTAuth()


@api.post("/register", response=UserOut)
@handle_api_errors
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
@handle_api_errors
def login(request, data: LoginIn):
    user = authenticate(username=data.username, password=data.password)
    if user:
        token = generate_jwt_token(user.id, user.username)
        return TokenOut(access_token=token, user_id=user.id, username=user.username)
    else:
        raise HttpUnauthorized("Credenciais inválidas")


@api.get("/get_users", response=list[UserOut])
@handle_api_errors
def get_users(request):
    users = User.objects.all()
    return users


@api.get("/me", response=UserOut, auth=jwt_auth)
@handle_api_errors
def get_current_user(request):
    user = request.auth
    return UserOut(id=user.id, username=user.username)


@api.post("/tasks", response=TaskOut, auth=jwt_auth)
@handle_api_errors
def create_task(request, data: TaskCreateIn):
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
@handle_api_errors
def get_my_tasks(request):
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


@api.get("/tasks", response=list[TaskOut], auth=jwt_auth)
@handle_api_errors
def get_all_tasks(request):
    tasks = Task.objects.all()
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


@api.put("/tasks/{task_id}", response=TaskOut, auth=jwt_auth)
@handle_api_errors
def update_task(request, task_id: int, data: TaskUpdateIn):
    user = request.auth
    try:
        task = Task.objects.get(id=task_id, author=user)
    except Task.DoesNotExist:
        raise HttpNotFound("Tarefa não encontrada.")

    task.title = data.title
    task.description = data.description
    task.status = data.status
    task.due_date = data.due_date
    task.completed = data.status == "done"
    task.save()

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


@api.delete("/tasks/{task_id}", auth=jwt_auth)
@handle_api_errors
def delete_task(request, task_id: int):
    user = request.auth
    try:
        task = Task.objects.get(id=task_id, author=user)
    except Task.DoesNotExist:
        raise HttpNotFound("Tarefa não encontrada.")

    task.delete()
    return {"message": "Tarefa deletada com sucesso"}
