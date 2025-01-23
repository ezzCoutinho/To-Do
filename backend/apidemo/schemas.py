from ninja import Schema, ModelSchema
from apidemo.models import Task, Tag
from datetime import date
from pydantic import BaseModel, EmailStr
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

class TagSchema(ModelSchema): # convertendo o modelo para uma schema
  class Config:
    model = Tag
    model_fields = ["id", "name"]

class TaskSchema(ModelSchema): # convertendo o modelo para uma schema
  class Config:
    model = Task
    model_fields = ["id", "title", "description", "completed", "created_at", "updated_at"]

class TaskCreateSchema(Schema): # criando uma nova schema
  title: str
  description: str
  due_date: str = None
  tags: list[int] = []

class LoginSchema(BaseModel):
  username: str
  password: str

class RegisterSchema(BaseModel):
  username: str
  password: str
  email: EmailStr

class EmployeeIn(Schema):
    first_name: str
    last_name: str
    department_id: int = None
    birthdate: date = None
