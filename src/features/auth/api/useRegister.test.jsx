import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useRegister } from './use-register' // Укажи правильный путь к твоему хуку
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
  authApi: { registration: vi.fn() },
}))

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useRegister хук', () => {
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
  // ТЕСТ №1: Успешная регистрация (с сообщением от сервера)
  // ============================================
  it('должен показать тост с сообщением от сервера и сделать редирект через 1 секунду', async () => {
    const mockData = { email: 'new@test.com', password: '123456' }
    const mockResponse = { message: 'Подтвердите email' }

    // Говорим API вернуть успех
    vi.mocked(authApi.registration).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useRegister(), { wrapper })

    // Вызываем мутацию
    await act(async () => {
      result.current.mutate(mockData)
      // Даём время React обновить состояние (isSuccess)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем успех и вызов API
    expect(result.current.isSuccess).toBe(true)
    expect(authApi.registration).toHaveBeenCalledWith(mockData)

    // Проверяем тост (должно взять message из mockResponse)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Регистрация успешна',
      description: 'Подтвердите email',
      type: 'success',
    })

    // Редиректа ещё нет (прошло всего 10 мс)
    expect(mockPush).not.toHaveBeenCalled()

    // Перематываем время до 1000 мс (10 + 990)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(990)
    })

    // Теперь редирект должен сработать
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  // ============================================
  // ТЕСТ №2: Успешная регистрация (без сообщения от сервера, fallback)
  // ============================================
  it('должен показать fallback-сообщение "Проверьте почту.", если сервер не вернул message', async () => {
    const mockData = { email: 'new@test.com', password: '123456' }
    // Сервер вернул пустой ответ или без поля message
    const mockResponse = {}

    vi.mocked(authApi.registration).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useRegister(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем, что сработал fallback из твоего кода: res?.message || 'Проверьте почту.'
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Регистрация успешна',
      description: 'Проверьте почту.', // <-- Вот здесь проверяем fallback
      type: 'success',
    })
  })

  // ============================================
  // ТЕСТ №3: Ошибка с конкретным сообщением от сервера
  // ============================================
  it('должен показать ошибку из ответа сервера, если email уже занят', async () => {
    const mockData = { email: 'exists@test.com', password: '123456' }
    const apiError = {
      response: {
        data: { message: 'Пользователь с таким email уже существует' },
      },
    }

    // Заставляем API вернуть ошибку
    vi.mocked(authApi.registration).mockRejectedValue(apiError)
    const { result } = renderHook(() => useRegister(), { wrapper })

    await act(async () => {
      result.current.mutate(mockData)
      await vi.advanceTimersByTimeAsync(10)
    })

    // Проверяем, что хук перешёл в состояние ошибки
    expect(result.current.isError).toBe(true)

    // Проверяем, что тост показал сообщение из err.response.data.message
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Пользователь с таким email уже существует',
      type: 'error',
    })

    // При ошибке редиректа быть не должно
    expect(mockPush).not.toHaveBeenCalled()
  })
})
