import { authApi } from '@/shared/api/auth/auth-api'
import { auth } from '@/configs/auth'

export async function POST(request) {
  try {
    // 1. Получаем JWT токен из NextAuth

    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Инвалидируем refreshToken на бэкенде
    await authApi.logout({ refresh_token: session.refreshToken })

    return Response.json({
      message: 'Выход выполнен успешно',
    })
  } catch (error) {
    console.error('Ошибка logout:', error)
    return Response.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
