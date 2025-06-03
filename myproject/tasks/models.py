from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    STATUS_CHOICES = [
        ("todo", "A Fazer"),
        ("in_progress", "Em Progresso"),
        ("done", "Concluído"),
    ]

    title = models.CharField(max_length=255, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descrição")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="todo", verbose_name="Status"
    )
    completed = models.BooleanField(default=False, verbose_name="Concluída")
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tasks", verbose_name="Autor"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    due_date = models.DateTimeField(
        null=True, blank=True, verbose_name="Data de vencimento"
    )

    class Meta:
        verbose_name = "Tarefa"
        verbose_name_plural = "Tarefas"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
