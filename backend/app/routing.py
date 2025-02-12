from django.urls import re_path
from .consumers import TarefaConsumer  # Verifique se o caminho está correto!

websocket_urlpatterns = [
    re_path(r"ws/tarefas/$", TarefaConsumer.as_asgi()),
]
