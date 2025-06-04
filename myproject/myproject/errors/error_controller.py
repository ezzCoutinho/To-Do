from myproject.errors.types.http_not_found import HttpNotFound
from myproject.errors.types.http_unauthorized import HttpUnauthorized
from myproject.errors.types.http_unprocessable_entity import HttpUnprocessableEntity
from myproject.errors.types.http_bad_request import HttpBadRequest


def handle__errors(error: Exception) -> dict:
    if isinstance(
        error, (HttpNotFound, HttpUnauthorized, HttpUnprocessableEntity, HttpBadRequest)
    ):
        return {
            "status_code": error.status_code,
            "body": {
                "errors": [
                    {
                        "title": error.name,
                        "status": error.status_code,
                        "detail": error.message,
                    }
                ]
            },
        }
    else:
        return {
            "status_code": 500,
            "body": {"errors": [{"title": "Server Error", "detail": str(error)}]},
        }
