from ninja.security import HttpBearer
from rest_framework.authtoken.models import Token

class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        print(f"🔍 Token Recebido no TokenAuth: {token}")

        try:
            user = Token.objects.get(key=token).user
            print(f"✅ Usuário autenticado via TokenAuth: {user}")

            # 🔥 FORÇANDO A ATRIBUIÇÃO DO USUÁRIO NA REQUISIÇÃO
            request.user = user
            return user
        except Token.DoesNotExist:
            print("❌ Token inválido!")
            return None
