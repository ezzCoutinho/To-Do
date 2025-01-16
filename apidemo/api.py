from ninja import NinjaAPI, Schema
from schemas import HelloSchema, UserSchema, Error
api = NinjaAPI()

@api.get("/me", response={200: UserSchema, 403: Error}) # Primeira schema com rotas.
def me(request):
  if request.user.is_authenticated:
    return {
    "username": "ezzcoutinho",
    "is_authenticated": True,
    "email": "lammerlopes@hotmail.com",
    "first_name": "Ezequiel",
    "last_name": "Coutinho"
    }
  return 403, {"message": "Not authenticated"}



@api.post("/hello")
def post_hello(request, data: HelloSchema):
  return {"message": f"Hello {data.name}"}

@api.get("/hello") # primeira rota
def hello(request, name):
  return {"message": f"Hello {name}"}

@api.get("/math/{a}and{b}")
def math(request, a:int, b:int):
  return {"add": a + b, "multiply": a * b}