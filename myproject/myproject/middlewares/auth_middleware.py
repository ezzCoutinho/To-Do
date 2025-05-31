from ninja.security import HttpBearer
from ..auth_utils import verify_jwt_token


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        user = verify_jwt_token(token)
        if user:
            return user
        return None
