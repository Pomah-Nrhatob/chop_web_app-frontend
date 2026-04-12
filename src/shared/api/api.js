import axios from 'axios'

let cachedTokens = null // {accessToken, refreshToken, expiresAt}
let isRefreshing = false
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

// Получаем свежие токены из NextAuth
const fetchTokensFromSession = async () => {
  try {
    const { getSession } = await import('next-auth/react')
    const session = await getSession()
    return {
      accessToken: session?.user?.accessToken,
      refreshToken: session?.user?.refreshToken,
      expiresAt: session?.user?.expiresAt,
    }
  } catch {
    return null
  }
}

const updateCachedTokens = async () => {
  cachedTokens = await fetchTokensFromSession()
}

const makeRefreshRequest = async (refreshToken) => {
  const { authApi } = await import('@/shared/api/auth/auth-api')
  return authApi.refresh({ refresh_token: refreshToken })
}

baseClient.interceptors.request.use(
  async (config) => {
    if (config.needAuth) {
      if (!cachedTokens || !cachedTokens.accessToken) {
        await updateCachedTokens()
      }

      if (!cachedTokens?.accessToken) {
        throw new AuthError('No access token available')
      }

      config.headers.Authorization = `Bearer ${cachedTokens.accessToken}`
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

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((tokens) => {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
            return baseClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // ✅ БЕЗ getSession() — используем refreshToken из кэша
        if (!cachedTokens?.refreshToken) {
          throw new Error('No refresh token in cache')
        }

        const refreshed = await makeRefreshRequest(cachedTokens.refreshToken)

        // ✅ Обновляем кэш
        cachedTokens = {
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          expiresAt: new Date(refreshed.expires_at).getTime(),
        }

        // ✅ НЕ трогаем NextAuth update() — только кэш!
        processQueue(null, cachedTokens)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${cachedTokens.accessToken}`
        return baseClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        cachedTokens = null

        // ✅ Логаут только при ошибке refresh
        const { signOut } = await import('next-auth/react')
        await signOut({ redirect: false })

        return Promise.reject(new AuthError('Session expired'))
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
  cachedTokens = null
}

export const USER_QUERY_KEY = ['user']
export { cachedTokens }
