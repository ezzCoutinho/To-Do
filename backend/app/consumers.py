import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TarefaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("tarefas", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("tarefas", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send("tarefas", {
            "type": "send_tarefa_update",
            "message": data,
        })

    async def send_tarefa_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
