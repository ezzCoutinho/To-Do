from ninja import NinjaAPI, Schema

api = NinjaAPI()


class User(Schema):
    username: str
    password: str


class UserOut(Schema):
    id: int
    username: str


@api.post("/register", User, response=UserOut)
def create_user(request, data: User):
    user = User(username=data.username, password=data.password)
    user.save()
    return user


@api.get("/hello")
def hello(request):
    return "Hello world"
