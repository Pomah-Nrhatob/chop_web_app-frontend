import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUpdateSecurity } from './use-update-security'

const { mockToasterCreate, mockUpdateSecurity, mockResetDictionaryCache } = vi.hoisted(() => ({
  mockToasterCreate: vi.fn(),
  mockUpdateSecurity: vi.fn(),
  mockResetDictionaryCache: vi.fn(),
}))

vi.mock('@/shared/api/security/security-api', () => ({
  securityApi: { updateSecurity: mockUpdateSecurity },
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: { create: mockToasterCreate },
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

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useUpdateSecurity хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })
  it('должен показать тост и обновить кэш при успешном обновлении', async () => {
    const payload = { id: 123, data: { name: 'Обновленное имя', status: 'active' } }

    mockUpdateSecurity.mockResolvedValue({})

    // Шпионим за методами queryClient
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateSecurity(), { wrapper })

    result.current.mutate(payload)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // 1. Проверка вызова API с правильным объектом
    expect(mockUpdateSecurity).toHaveBeenCalledWith(123, {
      name: 'Обновленное имя',
      status: 'active',
    })

    // 2. Проверка тоста с фиксированными строками из хука
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Усрешно',
      description: 'Данные охранника изменены',
      type: 'success',
    })

    // 3. Проверка очистки кэша объектов
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['securities'] })

    // 4. Проверка сброса кэша словарей
    expect(mockResetDictionaryCache).toHaveBeenCalledWith(['mock-dictionary-key'])
  })

  it('должен показать сообщение об ошибке от сервера и НЕ обновлять кэш при неудаче', async () => {
    const payload = { id: 456, data: { name: 'Ошибка' } }
    const apiError = {
      response: {
        data: { message: 'Охранник с таким ID уже существует в другом регионе' },
      },
    }

    mockUpdateSecurity.mockRejectedValue(apiError)

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateSecurity(), { wrapper })

    result.current.mutate(payload)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // 1. Проверка тоста об ошибке (берем сообщение из response.data.message)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Охранник с таким ID уже существует в другом регионе',
      type: 'error',
    })

    // 2. КРИТИЧЕСКИ ВАЖНО: Убедиться, что действия из onSuccess НЕ выполнились
    expect(invalidateSpy).not.toHaveBeenCalled()
    expect(mockResetDictionaryCache).not.toHaveBeenCalled()
  })

  it('должен показать общий fallback, если сервер упал без деталей', async () => {
    const payload = { id: 789, data: { name: 'Тест' } }

    // Создаем "тихую" ошибку, у которой нет ни response.data, ни message
    // Чтобы сработал самый последний вариант в цепочке: || 'Не удалось обновить данные объекта'
    const silentError = {}

    mockUpdateSecurity.mockRejectedValue(silentError)

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateSecurity(), { wrapper })

    result.current.mutate(payload)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockResetDictionaryCache).not.toHaveBeenCalled()
    expect(invalidateSpy).not.toHaveBeenCalled()
    // Проверяем, что сработал крайний fallback из твоего кода
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Не удалось обновить данные сотрудника',
      type: 'error',
    })
  })
})
