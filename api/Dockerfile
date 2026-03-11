# -------------------------
# STAGE 1 — BASE
# -------------------------
FROM node:22-slim AS base

WORKDIR /app

# evita alguns warnings npm
ENV CI=true

# -------------------------
# STAGE 2 — DEPENDENCIES
# -------------------------
FROM base AS deps

COPY package*.json ./

RUN npm ci

# -------------------------
# STAGE 3 — BUILDER
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# env fake apenas para gerar prisma
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# gera prisma client
RUN npx prisma generate

# build nest
RUN npm run build

# -------------------------
# STAGE 4 — RUNNER
# -------------------------
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# apenas deps de produção
RUN npm ci --omit=dev

# copia build
COPY --from=builder /app/dist ./dist

# copia prisma
COPY --from=builder /app/prisma ./prisma

# copia prisma client gerado
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3333

CMD ["node", "dist/src/main.js"]