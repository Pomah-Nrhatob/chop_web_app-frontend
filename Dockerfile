FROM node:20-alpine AS base

# ... deps и builder этапы ...

FROM base AS runner
WORKDIR /app

# Создай пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# ✅ КРИТИЧНО: скопируй ВСЁ из standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public  # если есть

# Права на .next/static
RUN chown -R nextjs:nodejs .next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]