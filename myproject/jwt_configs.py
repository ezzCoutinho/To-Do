import os

jwt_infos = {
    "KEY": os.getenv("KEY"),
    "ALGORITHM": os.getenv("ALGORITHM"),
    "JWT_HOURS": int(os.getenv("JWT_HOURS")),
}
