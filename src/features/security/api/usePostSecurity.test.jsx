import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePostSecurity } from './use-post-security'

const { mockToasterCreate, mockPostSecurity, mockResetDictionaryCache } = vi.hoisted(() => ({
  mockToasterCreate: vi.fn(),
  mockPostSecurity: vi.fn(),
  mockResetDictionaryCache: vi.fn(),
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

vi.mock('@/shared/api/security/security-api', () => ({
  securityApi: { postSecurity: mockPostSecurity },
}))

vi.mock('@/features/dictionary/hooks/useDictionaryCacheReset', () => ({
  useDictionaryCacheReset: () => ({
    resetDictionaryCache: mockResetDictionaryCache,
  }),
}))

// Мокаем константу ключа для полной изоляции теста
vi.mock('@/features/dictionary/api/use-get-dictionary-securities', () => ({
  DICTIONARY_SECURITIES_KEY: 'mock-dictionary-key',
}))

describe('usePostSecurity хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    // ✅ Про-совет: Мокаем console.log, чтобы ошибки из onError не засоряли вывод тестов
    vi.spyOn(console, 'log').mockImplementation(() => {})

    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  // ============================================
  // ТЕСТ №1: Успешное создание с сообщением от сервера
  // ============================================
  it('должен показать тост с сообщением от сервера и обновить кэш при успехе', async () => {
    const mockData = { name: 'Новый охранник', address: 'ул. Тестовая' }
    const mockResponse = { message: 'Охранник успешно создан' }

    mockPostSecurity.mockResolvedValue(mockResponse)

    // Шпионим за методами queryClient
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => usePostSecurity(), { wrapper })

    result.current.mutate(mockData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // 1. Проверка вызова API
    expect(mockPostSecurity).toHaveBeenCalledWith(mockData)

    // 2. Проверка тоста (должно взять message из ответа)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Успешно',
      description: 'Охранник успешно создан',
      type: 'success',
    })

    // 3. Проверка очистки кэша (2 вызова)
    expect(invalidateSpy).toHaveBeenCalledTimes(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['securities'] })

    // 4. Проверка сброса кэша словарей
    expect(mockResetDictionaryCache).toHaveBeenCalledWith(['mock-dictionary-key'])
  })

  // ============================================
  // ТЕСТ №2: Успешное создание БЕЗ сообщения от сервера (fallback)
  // ============================================
  it('должен показать fallback "Объект добавлен", если сервер не вернул message', async () => {
    const mockData = { name: 'Без сообщения' }

    // Сервер вернул пустой ответ или без поля message
    mockPostSecurity.mockResolvedValue({})

    const { result } = renderHook(() => usePostSecurity(), { wrapper })

    result.current.mutate(mockData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Проверяем, что сработал fallback из твоего кода: res?.message || 'Объект добавлен'
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Успешно',
      description: 'Охранник добавлен',
      type: 'success',
    })
  })

  // ============================================
  // ТЕСТ №3: Ошибка с конкретным сообщением от сервера
  // ============================================
  it('должен показать ошибку от сервера и НЕ обновлять кэш при неудаче', async () => {
    const mockData = { name: 'Дубликат' }
    const apiError = {
      response: {
        data: { message: 'Охранник уже существует' },
      },
    }

    mockPostSecurity.mockRejectedValue(apiError)

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => usePostSecurity(), { wrapper })

    result.current.mutate(mockData)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // 1. Проверка тоста об ошибке
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Охранник уже существует',
      type: 'error',
    })

    // 2. КРИТИЧЕСКИ ВАЖНО: Убедиться, что действия из onSuccess НЕ выполнились
    expect(invalidateSpy).not.toHaveBeenCalled()
    expect(mockResetDictionaryCache).not.toHaveBeenCalled()
  })

  // ============================================
  // ТЕСТ №4: Ошибка без деталей (сетевая ошибка, fallback)
  // ============================================
  it('должен показать общую ошибку, если сервер упал без деталей', async () => {
    const mockData = { name: 'Тест' }

    // Имитируем обрыв сети или ошибку, у которой нет response.data
    const networkError = new Error('Network Error')

    mockPostSecurity.mockRejectedValue(networkError)

    const { result } = renderHook(() => usePostSecurity(), { wrapper })

    result.current.mutate(mockData)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // Проверяем, что сработал fallback: err.response?.data?.message || err?.message
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Network Error',
      type: 'error',
    })
  })
})
