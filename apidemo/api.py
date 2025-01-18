from ninja import NinjaAPI, Schema, UploadedFile, File, Form
from apidemo.schemas import EmployeeIn
from apidemo.models import Employee
api = NinjaAPI()

@api.post("/employees")
def create_employee(request, employee: EmployeeIn = Form(...), cv: UploadedFile = File(...)):
    employee_dict = employee.dict()
    employee_instance = Employee(**employee_dict)
    employee_instance.cv.save(cv.name, cv)
    employee_instance.save()
    return {"id": employee_instance.id}

@api.get("/hello") # primeira rota
def hello(request, name):
  return {"message": f"Hello {name}"}

@api.get("/math/{a}and{b}")
def math(request, a:int, b:int):
  return {"add": a + b, "multiply": a * b}