from ninja import NinjaAPI
from django.contrib.auth import authenticate
from apidemo.schemas import EmployeeIn, LoginSchema
from apidemo.models import Employee
api = NinjaAPI()

@api.post("/login")
def login(request, data: LoginSchema):
  user = authenticate(username=data.username, password=data.password)
  if user is not None:
    return {"success": True, "message": "Usuário autenticado."}
  else:
    return {"success": False, "message": "Usuário não autenticado."}
  