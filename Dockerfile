# 1. Escolher a imagem base
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Copiar pasta do Prisma antes de instalar
COPY prisma ./prisma

# Instalar dependências (prisma generate vai funcionar agora)
RUN npm install

# Copiar resto do projeto
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
