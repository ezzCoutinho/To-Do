from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from ninja import NinjaAPI

from myproject.schemas.user_schema import UserIn, UserOut

api = NinjaAPI()


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


@api.get("/get_users", response=list[UserOut])
def get_users(request):
    users = User.objects.all()
    return users
