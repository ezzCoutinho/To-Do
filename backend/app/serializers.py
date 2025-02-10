from rest_framework import serializers
from .models import Tarefa  # Importe o modelo Tarefa

class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = '__all__'  # Ou defina os campos específicos que você quer incluir
