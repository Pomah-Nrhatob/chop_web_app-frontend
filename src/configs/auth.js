import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authApi } from '@/shared/api/auth/auth-api'
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
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user.expiresAt
      }

      if (Date.now() + REFRESH_TOKEN_BUFFER_MS >= token.expiresAt) {
        console.log('Access token истёк. Пытаемся обновить...')
        try {
          const refreshedTokens = await authApi.refresh({
            refresh_token: token.refreshToken,
          })

          token.accessToken = refreshedTokens.access_token
          token.expiresAt = new Date(refreshedTokens.expires_at).getTime()
          token.refreshToken = refreshedTokens.refresh_token

          console.log('Токен успешно обновлён.')
        } catch (error) {
          console.error('Ошибка обновления токена:', error)

          return null
        }
      }

      return token
    },
    async session({ session, token, trigger }) {
      session.user.accessToken = token.accessToken
      session.user.expiresAt = token.expiresAt

      return session
    },
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`, // префикс __Secure требует HTTPS
      options: {
        httpOnly: true,
        sameSite: 'lax', // или 'strict', но не 'none' без Secure
        path: '/',
        secure: true, // обязательно true на HTTPS
        domain: '.твой-домен.ru', // опционально: для поддоменов
      },
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
