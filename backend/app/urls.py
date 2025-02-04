from django.contrib import admin
from .api import api, router
from django.urls import path
from ninja import NinjaAPI

api = NinjaAPI()
api.add_router("/api/", router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", api.urls),
]
