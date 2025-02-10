import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TarefaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "tarefas"  # Nome do canal ou identificador
        self.room_group_name = f"room_{self.room_name}"

        # Cria o canal para o WebSocket
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove o canal do grupo quando o WebSocket for desconectado
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recebe a mensagem do WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        tarefa_id = data["id"]
        novo_status = data["status"]

        # Importando o modelo Tarefa aqui para evitar problemas de inicialização
        from app.models import Tarefa  # Adiada a importação até o momento de uso

        # Atualiza a tarefa no banco de dados
        tarefa = await Tarefa.objects.aget(id=tarefa_id)
        tarefa.status = novo_status
        await tarefa.asave()

        # Envia de volta para os WebSockets conectados
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'tarefa_update',  # Tipo da mensagem
                'id': tarefa.id,
                'status': novo_status,
            }
        )

    # Envia a mensagem para o WebSocket
    async def tarefa_update(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'status': event['status']
        }))
