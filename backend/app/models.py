from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="+",  # Evita conflitos com o modelo auth.User
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="+",  # Evita conflitos com o modelo auth.User
        blank=True
    )

    def __str__(self):
        return self.username

class Tarefa(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('pendente', 'Pendente'), ('andamento', 'Em andamento'), ('concluido', 'Concluído')])
    responsavel = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.titulo
