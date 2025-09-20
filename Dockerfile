# Stage 1: Build
FROM node:20-alpine AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala dependências
RUN npm install --production

# Copia todo o código da aplicação
COPY . .

# Build do Prisma (gera client)
RUN npx prisma generate

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da stage de build
COPY --from=build /app ./

# Expõe a porta que o app vai rodar
EXPOSE 3000

# Variáveis de ambiente podem ser passadas no docker run ou no .env
ENV NODE_ENV=production

# Comando para rodar o servidor
CMD ["node", "server.js"]
