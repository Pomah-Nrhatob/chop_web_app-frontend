import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useResetPassword } from './use-reset-password'
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
  authApi: { resetPassword: vi.fn() },
}))

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useResetPassword хук', () => {
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

  // ============================================
  // ТЕСТ №1: Успешный сброс пароля
  // ============================================
  it('должен показать тост с сообщением от сервера и сделать редирект через 1 секунду', async () => {
    // Данные, которые обычно отправляются при сбросе пароля (токен и новый пароль)
    const mockData = { token: 'abc-123', password: 'newPassword123' }
    const mockResponse = { message: 'Пароль успешно изменён' }

    vi.mocked(authApi.resetPassword).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useResetPassword(), { wrapper })

    // Вызываем мутацию и даём время React обновить состояние
    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем успех и вызов API
    expect(result.current.isSuccess).toBe(true)
    expect(authApi.resetPassword).toHaveBeenCalledWith(mockData)

    // Проверяем тост
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Успешно!',
      description: 'Пароль успешно изменён',
      type: 'success',
    })

    // Редиректа ещё нет (прошло всего 10 мс из 1000)
    expect(mockPush).not.toHaveBeenCalled()

    // Доматываем время до 1000 мс (10 + 990)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(990)
    })

    // Теперь редирект должен сработать
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  // ============================================
  // ТЕСТ №2: Ошибка с конкретным сообщением от сервера
  // ============================================
  it('должен показать сообщение об ошибке от сервера, если токен недействителен', async () => {
    const mockData = { token: 'invalid-token', password: 'newPassword123' }
    const apiError = {
      response: {
        data: { message: 'Срок действия ссылки истёк' },
      },
    }

    vi.mocked(authApi.resetPassword).mockRejectedValue(apiError)
    const { result } = renderHook(() => useResetPassword(), { wrapper })

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

  // ============================================
  // ТЕСТ №3: Ошибка без деталей (проверка финального fallback)
  // ============================================
  it('должен показать общий fallback "Ошибка сброса пароля", если сервер упал без деталей', async () => {
    const mockData = { token: 'abc', password: '123' }

    // Создаем "тихую" ошибку, у которой нет ни response.data, ни message
    // Чтобы сработал самый последний вариант в цепочке: || 'Ошибка сброса пароля'
    const silentError = {}

    vi.mocked(authApi.resetPassword).mockRejectedValue(silentError)
    const { result } = renderHook(() => useResetPassword(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(result.current.isError).toBe(true)

    // Проверяем, что сработал крайний fallback из твоего кода
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Ошибка сброса пароля',
      type: 'error',
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})
