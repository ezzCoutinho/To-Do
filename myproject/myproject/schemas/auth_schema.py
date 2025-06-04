from ninja import Schema


class LoginIn(Schema):
    username: str
    password: str


class TokenOut(Schema):
    access_token: str
    token_type: str = "Bearer"
    user_id: int
    username: str
