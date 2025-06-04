from functools import wraps
from django.http import JsonResponse
from myproject.errors.error_controller import handle__errors


def handle_api_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_response = handle__errors(e)
            return JsonResponse(
                error_response["body"], status=error_response["status_code"]
            )

    return wrapper
