# === Build Stage ===
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY package-lock.json* ./

RUN npm ci

COPY . .

# Сборка Next.js (создаёт .next)
RUN npm run build

# === Production Stage ===
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Создаём не-root пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем только нужное
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]