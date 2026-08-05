import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDeleteSecurity } from './use-delete-security'

const { mockToasterCreate, mockResetDictionaryCache, mockDeleteSecurity } = vi.hoisted(() => ({
  mockToasterCreate: vi.fn(),
  mockResetDictionaryCache: vi.fn(),
  mockDeleteSecurity: vi.fn(),
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

vi.mock('@/shared/api/security/security-api', () => ({
  securityApi: { deleteSecurity: mockDeleteSecurity },
}))

// Мокаем хук сброса кэша словарей
vi.mock('@/features/dictionary/hooks/useDictionaryCacheReset', () => ({
  useDictionaryCacheReset: () => ({
    resetDictionaryCache: mockResetDictionaryCache,
  }),
}))

// Мокаем константу ключа, чтобы тест был полностью изолирован
vi.mock('@/features/dictionary/api/use-get-dictionary-securities', () => ({
  DICTIONARY_SECURITIES_KEY: 'dictionary-securities-key',
}))

describe('useDeleteSecurity хук', () => {
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
  // ТЕСТ №1: Успешное удаление с колбэком
  // ============================================
  it('должен очистить кэш, показать тост и вызвать onSuccessCallback при успехе', async () => {
    const securityId = 123
    const mockCallback = vi.fn() // Создаём шпиона для колбэка

    vi.mocked(mockDeleteSecurity).mockResolvedValue({})

    // ✅ Шпионим за методами queryClient, чтобы проверить их вызов
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteSecurity(mockCallback), { wrapper })

    // Вызываем мутацию
    result.current.mutate(securityId)

    // Ждём успешного завершения
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // 1. Проверяем вызов API
    expect(mockDeleteSecurity).toHaveBeenCalledWith(securityId)

    expect(invalidateSpy).toHaveBeenCalledTimes(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['securities'] })

    // 3. Проверяем вызов сброса кэша словарей с правильным ключом
    expect(mockResetDictionaryCache).toHaveBeenCalledWith(['dictionary-securities-key'])

    // 4. Проверяем тост
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Удалено',
      description: 'Охранник успешно удален из базы',
      type: 'success',
    })

    // 5. Проверяем, что наш колбэк был вызван
    expect(mockCallback).toHaveBeenCalled()
  })

  it('должен корректно отработать, если onSuccessCallback не передан', async () => {
    const securityId = 456

    vi.mocked(mockDeleteSecurity).mockResolvedValue({})

    // Передаем undefined вместо колбэка (или просто не передаем аргумент)
    const { result } = renderHook(() => useDeleteSecurity(), { wrapper })

    result.current.mutate(securityId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Проверяем, что тост всё равно показался
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Удалено',
      description: 'Охранник успешно удален из базы',
      type: 'success',
    })
  })
  it('должен показать ошибку и НЕ вызывать очистку кэша, если API вернул ошибку', async () => {
    const securityId = 789
    const apiError = new Error('Охранник используется в расписании')

    vi.mocked(mockDeleteSecurity).mockRejectedValue(apiError)

    const { result } = renderHook(() => useDeleteSecurity(), { wrapper })

    result.current.mutate(securityId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // Проверяем тост об ошибке с сообщением из ошибки
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Охранник используется в расписании',
      type: 'error',
    })

    // Проверяем, что действия из onSuccess НЕ выполнялись
    expect(mockResetDictionaryCache).not.toHaveBeenCalled()
    expect(mockToasterCreate).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }))
  })
})
