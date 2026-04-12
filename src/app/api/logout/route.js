import { getToken } from 'next-auth/jwt'
import { authApi } from '@/shared/api/auth/auth-api'

export async function POST(request) {
  try {
    // 1. Получаем JWT токен из NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.refreshToken) {
      return Response.json({ error: 'Refresh токен отсутствует' }, { status: 400 })
    }

    // 2. Инвалидируем refreshToken на бэкенде
    await authApi.logout({ refresh_token: token.refreshToken })

    return Response.json({
      message: 'Выход выполнен успешно',
    })
  } catch (error) {
    console.error('Ошибка logout:', error)
    return Response.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
