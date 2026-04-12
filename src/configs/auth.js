// configs/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { REFRESH_TOKEN_BUFFER_MS } from '@/configs/data'

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.userFromFrontend) {
          const userData = JSON.parse(credentials.userFromFrontend)
          const expiresAtMs = new Date(userData.expires_at).getTime()

          return {
            accessToken: userData.access_token,
            refreshToken: userData.refresh_token,
            expiresAt: expiresAtMs,
          }
        }

        throw new Error('Данные пользователя не предоставлены')
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Инициализация токенов при первом входе
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user.expiresAt
        return token
      }

      // Нет токенов вообще — выходим
      if (!token.refreshToken || !token.accessToken) {
        return { ...token, error: 'NoTokens' }
      }

      // Нет времени истечения — выходим
      if (!token.expiresAt) {
        return { ...token, error: 'NoExpiresAt' }
      }

      // Токен ещё валиден — возвращаем как есть
      if (Date.now() + REFRESH_TOKEN_BUFFER_MS < token.expiresAt) {
        return token
      }

      // ❌ УБРАЛИ refresh отсюда! Теперь делает фронтенд
      console.log('⚠️ Сервер не обновляет токены. Ждём фронтенд.')
      return token
    },

    async session({ session, token }) {
      // Если ошибка в токене — чистим сессию
      if (token.error) {
        session.error = token.error
        session.user = {
          accessToken: null,
          expiresAt: 0,
          refreshToken: null,
        }
        return session
      }

      // Нормальная сессия — передаём все токены
      session.user = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
      }

      return session
    },
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // ✅ HTTP!
        domain: '212.67.13.62', // 🔥 КРИТИЧНО для IP!
      },
    },
  },
  csrfToken: {
    name: `next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
      domain: '212.67.13.62', // 🔥 ТОЖЕ!
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней для сессии
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
