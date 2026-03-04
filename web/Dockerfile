# -------------------------
# STAGE 1 — DEPENDENCIES
# -------------------------
FROM node:24-alpine AS deps

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
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

# Build Next.js
RUN npm run build


# -------------------------
# STAGE 3 — RUNNER
# -------------------------
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copia build e node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 🔥 IMPORTANTE: copia a pasta prisma inteira
COPY --from=builder /app/prisma ./prisma

# Verifica se o prisma realmente está no container
RUN ls -la prisma

EXPOSE 3000

# Executa migrações antes do server
CMD npx prisma migrate deploy && node server.js
