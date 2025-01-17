from django.db import models # models trabalha com objetos relacionais.
from django.utils import timezone # trabalha com datas e horas.

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
  created_at = models.DateTimeField(auto_now_add=True) # criada em 
  updated_at = models.DateTimeField(auto_now=True) # atualizada em 

  def __str__(self): # função que retorna o título
    return self.title
  
  @property # método abaixo vai se comportar como um atributo da classe Task.
  def is_overdue(self): # função que verifica se a tarefa está atrasada
    return self.due_date and self.due_date < timezone.now() and not self.completed
  
class Department(models.Model):
    title = models.CharField(max_length=100)

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    birthdate = models.DateField(null=True, blank=True)
    cv = models.FileField(null=True, blank=True)