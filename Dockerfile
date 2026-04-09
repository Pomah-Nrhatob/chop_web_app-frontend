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