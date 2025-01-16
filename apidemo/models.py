from django.db import models # models trabalha com objetos relacionais
from django.utils import timezone 

class Tag(models.Model):
  name = models.CharField(max_length=50)

  def __str__(self):
    return self.name

class Task(models.Model):
  id = models.AutoField(primary_key=True) # chave única 
  title = models.CharField(max_length=255) # campo máximo de 255 caracteres 
  description = models.TextField() # texto longo
  completed = models.BooleanField(default=False) # padrão false 
  due_date = models.DateField(null=True, blank=True) # data de vencimento
  tags = models.ManyToManyField(Tag, related_name="tasks") # relacionamento muitos para muitos
  create_at = models.DateTimeField(auto_now_add=True) # criada em 
  updated_at = models.DateTimeField(auto_now=True) # atualizada em 

  def __str__(self): # função que retorna o título
    return self.title
  
  @property
  def is_overdue(self): # função que verifica se a tarefa está atrasada
    return self.due_date and self.due_date < timezone.now() and not self.completed