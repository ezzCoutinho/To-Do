from ninja import Schema

class UserSchema(Schema):
    email: str
    username: str
    password: str
    confirm_password: str

class LoginSchema(Schema):
    email: str
    password: str
