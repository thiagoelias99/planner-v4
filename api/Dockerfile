# -------------------------
# STAGE 1 — DEPENDENCIES
# -------------------------
FROM node:22-slim AS deps

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm ci

# -------------------------
# STAGE 2 — BUILDER
# -------------------------
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma precisa de DATABASE_URL para gerar client
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# gera client com tipos
RUN npx prisma generate

# build do nest
RUN npm run build

# -------------------------
# STAGE 3 — RUNNER
# -------------------------
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# gera engine correto no runtime
RUN npx prisma generate

EXPOSE 3333

CMD ["node", "dist/src/main.js"]