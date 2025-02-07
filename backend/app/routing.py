from django.urls import path
from app.consumers import TarefaConsumer

websocket_urlpatterns = [
    path("ws/tarefas/", TarefaConsumer.as_asgi()),  # WebSocket para tarefas
]
