from functools import wraps
from ninja.errors import HttpError
from myproject.errors.error_controller import handle__errors


def handle_api_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_response = handle__errors(e)
            raise HttpError(error_response.status_code, error_response.body)

    return wrapper
