import axios from 'axios'

// ✅ Используем Promise для синхронизации refresh
let refreshPromise = null
let failedQueue = []

const processQueue = (error, tokens = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(tokens)
    }
  })
  failedQueue = []
}

const baseClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

class AuthError extends Error {
  constructor(message = 'AUTH_REQUIRED', redirectTo = '/login') {
    super(message)
    this.name = 'AuthError'
    this.isAuthError = true
    this.redirectTo = redirectTo
  }
}

const getTokensFromSession = async () => {
  try {
    const { getSession } = await import('next-auth/react')
    const session = await getSession()
    return {
      id: session?.user?.id,
      accessToken: session?.user?.accessToken,
      refreshToken: session?.user?.refreshToken,
      expiresAt: session?.user?.expiresAt,
    }
  } catch {
    return null
  }
}

const makeRefreshRequest = async (refreshToken) => {
  const { authApi } = await import('@/shared/api/auth/auth-api')
  return authApi.refresh({ refresh_token: refreshToken })
}

baseClient.interceptors.request.use(
  async (config) => {
    if (config.needAuth) {
      const tokens = await getTokensFromSession()

      if (!tokens?.accessToken) {
        throw new AuthError('No access token available')
      }

      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

baseClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest.needAuth &&
      !originalRequest._retryAttempted
    ) {
      originalRequest._retryAttempted = true

      // ✅ Если уже идёт refresh, добавляем в очередь
      if (refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((tokens) => {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
            return baseClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      // ✅ Инициируем refresh, если очередь была пуста
      refreshPromise = (async () => {
        try {
          const tokens = await getTokensFromSession()

          if (!tokens?.refreshToken) {
            throw new Error('No refresh token available')
          }

          const refreshed = await makeRefreshRequest(tokens.refreshToken)

          // ✅ Обновляем сессию через signIn
          const { signIn } = await import('next-auth/react')

          await signIn('credentials', {
            userFromFrontend: JSON.stringify({
              id: tokens.id || 'user-id',
              access_token: refreshed.access_token,
              refresh_token: refreshed.refresh_token,
              expires_at: new Date(refreshed.expires_at).toISOString(),
            }),
            redirect: false,
          })

          // ✅ Ждем немного для обновления сессии
          await new Promise((resolve) => setTimeout(resolve, 150))

          const updatedTokens = await getTokensFromSession()

          // ✅ Очищаем refreshPromise и разрешаем очередь
          const queuePromise = refreshPromise
          refreshPromise = null
          processQueue(null, updatedTokens)

          return updatedTokens
        } catch (refreshError) {
          // ✅ Очищаем refreshPromise и отклоняем очередь
          const queuePromise = refreshPromise
          refreshPromise = null
          processQueue(refreshError, null)

          const { signOut } = await import('next-auth/react')
          await signOut({ redirect: false })

          throw new AuthError('Session expired')
        }
      })()

      try {
        // ✅ Ждем завершения refresh и получаем обновленные токены
        const updatedTokens = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${updatedTokens.accessToken}`
        return baseClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

const makeAuthenticatedRequest = async (
  method,
  endpoint,
  { data = null, query = null, options = {}, needAuth = false } = {}
) => {
  const config = {
    method,
    url: endpoint,
    params: query,
    headers: { ...options.headers },
    needAuth,
    ...options,
  }

  if (data && method.toLowerCase() !== 'get') {
    config.data = data
  }

  try {
    const response = await baseClient(config)
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error
  }
}

export const apiClient = {
  get: (endpoint, params = {}) => makeAuthenticatedRequest('GET', endpoint, params),
  post: (endpoint, params = {}) => makeAuthenticatedRequest('POST', endpoint, params),
  put: (endpoint, params = {}) => makeAuthenticatedRequest('PUT', endpoint, params),
  delete: (endpoint, params = {}) => makeAuthenticatedRequest('DELETE', endpoint, params),
  patch: (endpoint, params = {}) => makeAuthenticatedRequest('PATCH', endpoint, params),
}

export const clearUserSession = () => {
  console.log('🧹 clearUserSession вызван')
}

export const USER_QUERY_KEY = ['user']
export const getCurrentTokens = getTokensFromSession
