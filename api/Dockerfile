# -------------------------
# STAGE 1 — DEPENDENCIES
# -------------------------
FROM node:24-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# -------------------------
# STAGE 2 — BUILDER
# -------------------------
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garante que a pasta prisma está aqui antes do generate
RUN ls -la prisma

# Gera Prisma Client
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# -------------------------
# STAGE 3 — RUNNER (PRODUÇÃO)
# -------------------------
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o build e dependências para produção
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 🔥 IMPORTANTE: copia a pasta prisma inteira
COPY --from=builder /app/prisma ./prisma

# Verifica se o prisma realmente está no container
RUN ls -la prisma

EXPOSE 3333

# Comando de execução
CMD npx prisma migrate deploy && node dist/main.js
