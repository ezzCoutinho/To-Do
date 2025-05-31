import jwt
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from jwt_configs import jwt_infos


def generate_jwt_token(user_id: int, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=jwt_infos["JWT_HOURS"]),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(payload, jwt_infos["KEY"], algorithm=jwt_infos["ALGORITHM"])

    return token


def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(
            token, jwt_infos["KEY"], algorithms=[jwt_infos["ALGORITHM"]]
        )

        user_id = payload.get("user_id")
        if user_id:
            user = User.objects.get(id=user_id)
            return user
        return None

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except User.DoesNotExist:
        return None
