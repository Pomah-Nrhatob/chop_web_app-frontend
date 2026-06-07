// configs/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { REFRESH_TOKEN_BUFFER_MS } from '@/configs/data' // если используется

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
      // При логине сохраняем токены
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user.expiresAt
        return token
      }

      // Если нет refreshToken — ошибка
      if (!token.refreshToken) {
        return { ...token, error: 'NoRefreshToken' }
      }

      // ✅ ВСЕГДА возвращаем актуальные токены (refresh происходит в axios)
      return token
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error
        session.user = {
          accessToken: null,
          expiresAt: 0,
          refreshToken: null,
        }
        return session
      }

      // ✅ Передаём токены в session.user
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
      name: `next-auth.session-token`, // ✅ Правильно для HTTP/dev
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        // domain: 'uchop.ru', // ✅ Раскомментируйте для IP!
      },
    },
  },
  csrfToken: {
    name: `next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
      // domain: 'uchop.ru',
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(authOptions)
