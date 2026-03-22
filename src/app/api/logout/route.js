import { getToken } from 'next-auth/jwt'
import { authApi } from '@/shared/api/auth/auth-api'

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Пользователь не авторизован (JWT токен отсутствует)' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const refreshToken = token.refreshToken

    if (!refreshToken) {
      console.error('refreshToken не найден в JWT токене.')
      return new Response(JSON.stringify({ error: 'Токен для инвалидации не найден' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await authApi.logout({ refreshToken })

    return new Response(JSON.stringify({ message: 'Выход выполнен успешно' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Ошибка при выходе:', error)
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера при попытке выхода' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
