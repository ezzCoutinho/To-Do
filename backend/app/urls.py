from django.contrib import admin
from django.urls import path
from .api import api  # Certifique-se de importar de api.py

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", api.urls),
]
