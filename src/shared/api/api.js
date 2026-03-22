import { REFRESH_TOKEN_BUFFER_MS } from '@/configs/data'
import axios from 'axios'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

const createApiClient = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  })
}

let cachedSessionPromise = null

const getCachedSession = async () => {
  if (!cachedSessionPromise) {
    const { getSession } = await import('next-auth/react')
    cachedSessionPromise = getSession()

    setTimeout(() => {
      cachedSessionPromise = null
    }, 100)
  }

  return cachedSessionPromise
}

const refreshSession = async () => {
  const { update, getSession } = await import('next-auth/react')

  await update()
  const session = await getSession()

  if (!session?.user?.accessToken) {
    throw new Error('No access token after refresh')
  }

  return session
}

class AuthError extends Error {
  constructor(message = 'AUTH_REQUIRED', redirectTo = '/login') {
    super(message)
    this.name = 'AuthError'
    this.isAuthError = true
    this.redirectTo = redirectTo
  }
}

const handleAuthFailure = async (redirectTo = '/login') => {
  const { signOut } = await import('next-auth/react')
  const { url } = await signOut({ redirect: false, callbackUrl: redirectTo })

  if (typeof window !== 'undefined') {
    try {
      const nextRouter = await import('next/router')
      const router = nextRouter.default
      if (router?.push) {
        await router.push(url || redirectTo)
        return
      }
    } catch {}

    window.location.href = url || redirectTo
  }

  throw new AuthError('AUTH_REQUIRED', redirectTo)
}

export const makeAuthenticatedRequest = async (
  method,
  endpoint,
  { data = null, query = null, options = {}, needAuth = false } = {}
) => {
  const client = createApiClient()

  const setAuthHeader = (token) => {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  if (needAuth) {
    let session = await getCachedSession()

    if (!session || !session.user?.accessToken) {
      await handleAuthFailure()
      throw new AuthError()
    }

    let token = session.user.accessToken
    const expiresAt = session.user.expiresAt

    if (expiresAt && Date.now() + REFRESH_TOKEN_BUFFER_MS >= expiresAt) {
      console.log('🔄 Токен скоро истечёт, обновляем...')

      if (isRefreshing) {
        try {
          token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          setAuthHeader(token)
        } catch {
          await handleAuthFailure()
        }
      } else {
        isRefreshing = true
        try {
          const updatedSession = await refreshSession()
          token = updatedSession.user.accessToken
          setAuthHeader(token)
          processQueue(null, token)
        } catch (error) {
          console.error('❌ Ошибка обновления токена:', error)
          processQueue(error, null)
          await handleAuthFailure()
        } finally {
          isRefreshing = false
        }
      }
    } else {
      setAuthHeader(token)
    }
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
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const serverResponse = error.response?.data

      if (status === 401 && needAuth && !error.config?.__retryAttempted) {
        console.log('🔐 401 received, attempting refresh...')

        error.config = error.config || {}
        error.config.__retryAttempted = true

        if (!isRefreshing) {
          isRefreshing = true
          try {
            const updatedSession = await refreshSession()
            const newToken = updatedSession.user.accessToken
            setAuthHeader(newToken)
            processQueue(null, newToken)

            const retryConfig = {
              ...config,
              headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
            }
            const retryResponse = await client(retryConfig)
            return retryResponse.data
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError)
            processQueue(refreshError, null)
            await handleAuthFailure()
          } finally {
            isRefreshing = false
          }
        } else {
          try {
            const newToken = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
            const retryConfig = {
              ...config,
              headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
            }
            const retryResponse = await client(retryConfig)
            return retryResponse.data
          } catch {
            await handleAuthFailure()
          }
        }
      }

      if (serverResponse) {
        throw serverResponse
      }

      throw new Error(`HTTP ${status || 'Unknown'}: ${error.message}`)
    }

    throw error
  }
}

export const apiClient = {
  get: (endpoint, { query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('GET', endpoint, { data: null, query, options, needAuth }),
  post: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('POST', endpoint, { data, query, options, needAuth }),
  put: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('PUT', endpoint, { data, query, options, needAuth }),
  delete: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('DELETE', endpoint, { data, query, options, needAuth }),
  patch: (endpoint, { data, query, options, needAuth } = {}) =>
    makeAuthenticatedRequest('PATCH', endpoint, { data, query, options, needAuth }),
}
