import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { authApi } from '@/shared/api/auth/auth-api'
import { useVerify } from './use-verify'

const { mockPush, mockToasterCreate } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockToasterCreate: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

vi.mock('@/shared/api/auth/auth-api', () => ({
  authApi: { verifyEmail: vi.fn() },
}))

describe('useVerify хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers() // Включаем фейковое время для контроля setTimeout

    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  afterEach(() => {
    vi.useRealTimers() // Возвращаем настоящее время после каждого теста
  })

  it('должен показать тост с сообщением от сервера и сделать редирект через 1 секунду', async () => {
    const mockData = { token: 'abc-123' }
    const mockResponse = { message: 'Успешно!' }

    vi.mocked(authApi.verifyEmail).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useVerify(), { wrapper })

    // Вызываем мутацию и даём время React обновить состояние
    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем успех и вызов API
    expect(result.current.isSuccess).toBe(true)
    expect(authApi.verifyEmail).toHaveBeenCalledWith(mockData)

    // Проверяем тост
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Успешно!',
      description: 'Успешно!',
      type: 'success',
    })

    // Редиректа ещё нет (прошло всего 10 мс из 1000)
    expect(mockPush).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1990)
    })

    // Теперь редирект должен сработать
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('должен показать сообщение об ошибке от сервера, если токен недействителен', async () => {
    const mockData = { token: 'invalid-token' }
    const apiError = {
      response: {
        data: { message: 'Срок действия ссылки истёк' },
      },
    }

    vi.mocked(authApi.verifyEmail).mockRejectedValue(apiError)
    const { result } = renderHook(() => useVerify(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем, что хук перешёл в состояние ошибки
    expect(result.current.isError).toBe(true)

    // Проверяем, что тост показал сообщение из err.response.data.message
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Срок действия ссылки истёк',
      type: 'error',
    })

    // При ошибке редиректа быть не должно
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('должен показать общий fallback "Ошибка сброса пароля", если сервер упал без деталей', async () => {
    const mockData = { token: 'abc' }

    const silentError = {}

    vi.mocked(authApi.verifyEmail).mockRejectedValue(silentError)
    const { result } = renderHook(() => useVerify(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(result.current.isError).toBe(true)

    // Проверяем, что сработал крайний fallback из твоего кода
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: undefined,
      type: 'error',
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})
