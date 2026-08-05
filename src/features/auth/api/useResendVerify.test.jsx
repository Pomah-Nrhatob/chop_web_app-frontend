import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useResendVerify } from './use-resend-verify' // Укажи правильный путь
import { authApi } from '@/shared/api/auth/auth-api'

// ============================================
// ШАГ 1: Создаём "пустышки" (моки)
// ============================================
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
  authApi: { requestVerifyEmail: vi.fn() },
}))

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useResendVerify хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  // ============================================
  // ТЕСТ №1: Успешная отправка
  // ============================================
  it('должен показать тост и СРАЗУ перенаправить на /login при успехе', async () => {
    const mockData = { email: 'test@test.com' }
    const mockResponse = { message: 'Письмо отправлено повторно' }

    vi.mocked(authApi.requestVerifyEmail).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useResendVerify(), { wrapper })

    // Вызываем мутацию
    result.current.mutate(mockData)

    // ✅ ИСПРАВЛЕНИЕ: Ждем, пока React Query обновит состояние на isSuccess
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(authApi.requestVerifyEmail).toHaveBeenCalledWith(mockData)

    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Успешно!',
      description: 'Письмо отправлено повторно',
      type: 'success',
    })

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  // ============================================
  // ТЕСТ №2: Ошибка с конкретным сообщением от сервера
  // ============================================
  it('должен показать сообщение об ошибке от сервера, если email не найден', async () => {
    const mockData = { email: 'notfound@test.com' }
    const apiError = {
      response: {
        data: { message: 'Пользователь с таким email не найден' },
      },
    }

    vi.mocked(authApi.requestVerifyEmail).mockRejectedValue(apiError)
    const { result } = renderHook(() => useResendVerify(), { wrapper })

    result.current.mutate(mockData)

    // ✅ ИСПРАВЛЕНИЕ: Ждем, пока React Query обработает ошибку
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Пользователь с таким email не найден',
      type: 'error',
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  // ============================================
  // ТЕСТ №3: Ошибка без деталей (проверка финального fallback)
  // ============================================
  it('должен показать общий fallback "Ошибка отправки...", если сервер упал без деталей', async () => {
    const mockData = { email: 'test@test.com' }

    // Создаем "тихую" ошибку, у которой нет ни response.data, ни message
    const silentError = {}

    vi.mocked(authApi.requestVerifyEmail).mockRejectedValue(silentError)
    const { result } = renderHook(() => useResendVerify(), { wrapper })

    result.current.mutate(mockData)

    // ✅ ИСПРАВЛЕНИЕ: Ждем обновления состояния
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // Проверяем, что сработал крайний fallback из твоего кода
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Ошибка отправки письма подтверждения',
      type: 'error',
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})
