from ninja import Schema
from datetime import datetime
from typing import Optional


class TaskCreateIn(Schema):
    title: str
    description: str = ""
    status: str = "todo"
    due_date: Optional[datetime] = None


class TaskIn(Schema):
    id: int
    title: str
    description: str
    status: str
    completed: bool
    author_id: int


class TaskOut(Schema):
    id: int
    title: str
    description: str
    status: str
    completed: bool
    author: str
    created_at: datetime
    updated_at: datetime
    due_date: Optional[datetime] = None
