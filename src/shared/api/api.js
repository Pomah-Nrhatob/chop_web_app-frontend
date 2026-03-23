import axios from 'axios'

let isRefreshing = false
let failedQueue = []
let refreshFailed = false // ✅ Флаг проваленного рефреша

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error || refreshFailed) {
      prom.reject(new Error('AUTH_REQUIRED'))
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = [] // ✅ Всегда очищаем очередь
}

const createApiClient = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  })
}

class AuthError extends Error {
  constructor(message = 'AUTH_REQUIRED', redirectTo = '/login') {
    super(message)
    this.name = 'AuthError'
    this.isAuthError = true
    this.redirectTo = redirectTo
  }
}

// ✅ Универсальная функция для получения сессии
export async function getSession() {
  try {
    // Client Components
    if (typeof window !== 'undefined') {
      const { getSession } = await import('next-auth/react')
      return await getSession()
    }

    // Server Components/API Routes
    const { auth } = await import('@/configs/auth')
    return await auth()
  } catch {
    return null
  }
}

export const makeAuthenticatedRequest = async (
  method,
  endpoint,
  { data = null, query = null, options = {}, needAuth = false } = {}
) => {
  const client = createApiClient()

  if (needAuth) {
    const session = await getSession()
    if (!session?.user?.accessToken) {
      throw new AuthError()
    }
    client.defaults.headers.common['Authorization'] = `Bearer ${session.user.accessToken}`
  }

  const config = {
    method,
    url: endpoint,
    params: query,
    headers: { ...options.headers },
    ...options,
  }

  if (data && method.toLowerCase() !== 'get') {
    config.data = data
  }

  try {
    const response = await client(config)
    refreshFailed = false // ✅ Сброс флага при успехе
    return response.data
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      needAuth &&
      !config.__retryAttempted
    ) {
      config.__retryAttempted = true

      // ✅ Если уже идет рефреш ИЛИ рефреш провалился
      if (isRefreshing || refreshFailed) {
        if (refreshFailed) {
          throw new AuthError('Refresh token expired')
        }

        // Ждем завершения рефреша из очереди
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () =>
              resolve(
                makeAuthenticatedRequest(method, endpoint, { data, query, options, needAuth })
              ),
            reject: () => reject(new AuthError()),
          })
        })
      }

      // ✅ Начинаем рефреш
      isRefreshing = true
      try {
        console.log('🔄 Token refresh started...')

        // Обновляем сессию через NextAuth
        if (typeof window !== 'undefined') {
          const { update } = await import('next-auth/react')
          await update({ refetch: true })
        }

        const session = await getSession()
        if (!session?.user?.accessToken) {
          throw new Error('No access token after refresh')
        }

        const newToken = session.user.accessToken
        client.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        processQueue(null, newToken)

        // Повторяем запрос с новым токеном
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        }
        const retryResponse = await client(retryConfig)
        return retryResponse.data
      } catch (refreshError) {
        console.error('❌ Refresh failed:', refreshError)
        refreshFailed = true // ✅ Блокируем будущие рефреши

        processQueue(refreshError, null)

        // ✅ Принудительный logout ПЕРЕД выбросом ошибки
        if (typeof window !== 'undefined') {
          const { signOut } = await import('next-auth/react')
          await signOut({ callbackUrl: '/login' }) // Await, чтобы гарантировать выполнение
        }

        throw new AuthError('Session expired - please login again')
      } finally {
        isRefreshing = false
      }
    }

    // Перебрасываем другие ошибки
    if (error.response?.data) {
      throw error.response.data
    }
    throw error
  }
}

export const apiClient = {
  get: (endpoint, { query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('GET', endpoint, { query, options, needAuth }),
  post: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('POST', endpoint, { data, query, options, needAuth }),
  put: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('PUT', endpoint, { data, query, options, needAuth }),
  delete: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('DELETE', endpoint, { data, query, options, needAuth }),
  patch: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('PATCH', endpoint, { data, query, options, needAuth }),
}
