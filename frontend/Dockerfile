# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos para o container
COPY . .

# Expõe a porta 3000 (Next.js)
EXPOSE 3000

# Comando para rodar o servidor Next.js
CMD ["npm", "run", "dev"]
