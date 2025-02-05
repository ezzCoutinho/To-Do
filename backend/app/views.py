from django.http import JsonResponse
from ninja import NinjaAPI

api = NinjaAPI()

@api.get("/hello")
def hello(request):
    return JsonResponse({"message": "Hello, World!"})

@api.get("/items/{item_id}")
def get_item(request, item_id: int):
    return JsonResponse({"item_id": item_id, "name": f"Item {item_id}"})
