from ninja import Schema, ModelSchema
from apidemo.models import Task, Tag

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

from datetime import date
from ninja import Schema

class EmployeeIn(Schema):
    first_name: str
    last_name: str
    department_id: int = None
    birthdate: date = None