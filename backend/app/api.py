from ninja import NinjaAPI, Router
from django.contrib.auth import authenticate
from .models import User
from .schemas import UserSchema, LoginSchema
from ninja.errors import HttpError
from rest_framework.authtoken.models import Token  # Certifique-se de importar Token corretamente

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

api.add_router("/", router)
