from ninja import Schema


class UserIn(Schema):
    username: str
    first_name: str
    last_name: str = None
    email: str
    password: str


class UserOut(Schema):
    id: int
    username: str
