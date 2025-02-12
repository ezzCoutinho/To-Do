import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TarefaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "tarefas"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Conectado ao WebSocket"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")

        # Enviar a mensagem para todos os WebSockets conectados
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_message",
                "message": message,
            }
        )

    async def send_message(self, event):
        message = json.loads(event["message"])  # Converte JSON de volta para um dicionário

        # Enviar para o frontend
        await self.send(text_data=json.dumps({
            "id": message["id"],
            "titulo": message["titulo"],
            "descricao": message["descricao"],
            "status": message["status"],
            "usuario": message["usuario"],
        }))
