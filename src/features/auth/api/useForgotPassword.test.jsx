import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useForgotPassword } from './use-forgot-password'
import { authApi } from '@/shared/api/auth/auth-api'

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
  authApi: { resetPasswordRequest: vi.fn() },
}))

describe('useForgotPassword хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('должен успешно отправить запрос, показать тост и сделать редирект через 1 секунду', async () => {
    const mockData = { email: 'test@test.com' }
    const mockResponse = { message: 'Инструкции отправлены на почту' }

    vi.mocked(authApi.resetPasswordRequest).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useForgotPassword(), { wrapper })

    // ✅ ИСПРАВЛЕНИЕ: Оборачиваем ВСЁ асинхронное действие в один act
    await act(async () => {
      result.current.mutate(mockData)
      // Даём время промису внутри мутации разрешиться и React обновить состояние
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(result.current.isSuccess).toBe(true)
    expect(authApi.resetPasswordRequest).toHaveBeenCalledWith(mockData)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Сброс пароля успешен',
      description: 'Инструкции отправлены на почту',
      type: 'success',
    })

    expect(mockPush).not.toHaveBeenCalled()

    // Доматываем время до 1000 мс
    await act(async () => {
      await vi.advanceTimersByTimeAsync(990)
    })

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('должен перейти в состояние ошибки, если API вернул ошибку', async () => {
    const mockData = { email: 'notfound@test.com' }
    const apiError = new Error('Network Error')

    vi.mocked(authApi.resetPasswordRequest).mockRejectedValue(apiError)
    const { result } = renderHook(() => useForgotPassword(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(result.current.isError).toBe(true)
    expect(mockToasterCreate).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})
