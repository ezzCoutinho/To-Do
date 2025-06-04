from ninja.security import HttpBearer
from ..auth_utils import verify_jwt_token
from ..errors.types.http_unauthorized import HttpUnauthorized


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        if not token:
            raise HttpUnauthorized("Token de acesso não fornecido")

        user = verify_jwt_token(token)
        if user:
            return user
        raise HttpUnauthorized("Token inválido ou expirado")
