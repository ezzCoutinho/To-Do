# Generated by Django 5.2.1 on 2025-06-03 01:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Título')),
                ('description', models.TextField(blank=True, verbose_name='Descrição')),
                ('status', models.CharField(choices=[('todo', 'A Fazer'), ('in_progress', 'Em Progresso'), ('done', 'Concluído')], default='todo', max_length=20, verbose_name='Status')),
                ('completed', models.BooleanField(default=False, verbose_name='Concluída')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
                ('due_date', models.DateTimeField(blank=True, null=True, verbose_name='Data de vencimento')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to=settings.AUTH_USER_MODEL, verbose_name='Autor')),
            ],
            options={
                'verbose_name': 'Tarefa',
                'verbose_name_plural': 'Tarefas',
                'ordering': ['-created_at'],
            },
        ),
    ]
