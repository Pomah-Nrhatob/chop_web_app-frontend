FROM node:25-alpine3.21 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# ARG для env-переменных (из docker-compose.yml)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаём пользователя ДО копирования файлов
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 1. Сначала создаём структуру директорий (важно!)
RUN mkdir -p /app/.next/static /app/public

# 2. Копируем standalone (серверная часть)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/. /app/

# 3. Копируем статику (используем АБСОЛЮТНЫЕ пути!)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static

# 4. Копируем public
COPY --from=builder --chown=nextjs:nodejs /app/public /app/public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]