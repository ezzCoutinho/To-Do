from ninja import Schema


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
