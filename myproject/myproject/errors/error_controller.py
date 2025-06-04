from myproject.errors.types.http_not_found import HttpNotFound
from myproject.errors.types.http_unauthorized import HttpUnauthorized
from myproject.errors.types.http_unprocessable_entity import HttpUnprocessableEntity
from myproject.errors.types.http_bad_request import HttpBadRequest
from myproject.main.http_types.http_response import HttpResponse


def handle__errors(error: Exception) -> dict:
    if isinstance(
        error, HttpNotFound, HttpUnauthorized, HttpUnprocessableEntity, HttpBadRequest
    ):
        return HttpResponse(
            body={"errors": [{"title": error.name, "detail": error.message}]},
            status_code=error.status_code,
        )
    else:
        return HttpResponse(
            body={"errors": [{"title": "Server Error", "detail": str(error)}]},
            status_code=500,
        )
