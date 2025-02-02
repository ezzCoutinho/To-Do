# Usa a imagem oficial do Python
FROM python:3.10

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do backend para dentro do container
COPY . .

# Instala dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Expõe a porta 8000 (padrão do Django)
EXPOSE 8000

# Comando para rodar o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
