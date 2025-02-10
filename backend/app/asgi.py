from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from django.core.asgi import get_asgi_application
from app.consumers import TarefaConsumer  # Ajuste para o nome correto

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/tarefas/", TarefaConsumer.as_asgi()),  # Verifique a URL
        ])
    ),
})
