from ninja import NinjaAPI, Schema
from apidemo.schemas import EmployeeIn
from apidemo.models import Employee
api = NinjaAPI()

@api.post("/employees")
def create_employee(request, payload: EmployeeIn):
    employee = Employee.objects.create(**payload.dict())
    return {"id": employee.id}

@api.get("/hello") # primeira rota
def hello(request, name):
  return {"message": f"Hello {name}"}

@api.get("/math/{a}and{b}")
def math(request, a:int, b:int):
  return {"add": a + b, "multiply": a * b}