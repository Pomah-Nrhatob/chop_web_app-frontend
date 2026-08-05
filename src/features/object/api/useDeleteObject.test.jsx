import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDeleteObject } from './use-delete-object' // Укажи правильный путь

// ============================================
// ШАГ 1: Создаём "пустышки" (моки)
// ============================================
const { mockToasterCreate, mockResetDictionaryCache, mockDeleteObject } = vi.hoisted(() => ({
  mockToasterCreate: vi.fn(),
  mockResetDictionaryCache: vi.fn(),
  mockDeleteObject: vi.fn(),
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

vi.mock('@/shared/api/object/object-api', () => ({
  objectApi: { deleteObject: mockDeleteObject },
}))

// Мокаем хук сброса кэша словарей
vi.mock('@/features/dictionary/hooks/useDictionaryCacheReset', () => ({
  useDictionaryCacheReset: () => ({
    resetDictionaryCache: mockResetDictionaryCache,
  }),
}))

// Мокаем константу ключа, чтобы тест был полностью изолирован
vi.mock('@/features/dictionary/api/use-get-dictionary-objects', () => ({
  DICTIONARY_OBJECTS_KEY: 'dictionary-objects-key',
}))

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useDeleteObject хук', () => {
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
    const objectId = 123
    const mockCallback = vi.fn() // Создаём шпиона для колбэка

    vi.mocked(mockDeleteObject).mockResolvedValue({})

    // ✅ Шпионим за методами queryClient, чтобы проверить их вызов
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteObject(mockCallback), { wrapper })

    // Вызываем мутацию
    result.current.mutate(objectId)

    // Ждём успешного завершения
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // 1. Проверяем вызов API
    expect(mockDeleteObject).toHaveBeenCalledWith(objectId)

    // 2. Проверяем очистку кэша TanStack Query (вызывалась 2 раза с разными ключами)
    expect(invalidateSpy).toHaveBeenCalledTimes(2)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['objects'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['calendar-allObjects'] })

    // 3. Проверяем вызов сброса кэша словарей с правильным ключом
    expect(mockResetDictionaryCache).toHaveBeenCalledWith(['dictionary-objects-key'])

    // 4. Проверяем тост
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Удалено',
      description: 'Объект успешно удален из базы',
      type: 'success',
    })

    // 5. Проверяем, что наш колбэк был вызван
    expect(mockCallback).toHaveBeenCalled()
  })

  // ============================================
  // ТЕСТ №2: Успешное удаление БЕЗ колбэка
  // ============================================
  it('должен корректно отработать, если onSuccessCallback не передан', async () => {
    const objectId = 456

    vi.mocked(mockDeleteObject).mockResolvedValue({})

    // Передаем undefined вместо колбэка (или просто не передаем аргумент)
    const { result } = renderHook(() => useDeleteObject(), { wrapper })

    result.current.mutate(objectId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Проверяем, что тост всё равно показался
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Удалено',
      description: 'Объект успешно удален из базы',
      type: 'success',
    })
  })

  // ============================================
  // ТЕСТ №3: Ошибка при удалении
  // ============================================
  it('должен показать ошибку и НЕ вызывать очистку кэша, если API вернул ошибку', async () => {
    const objectId = 789
    const apiError = new Error('Объект используется в расписании')

    vi.mocked(mockDeleteObject).mockRejectedValue(apiError)

    const { result } = renderHook(() => useDeleteObject(), { wrapper })

    result.current.mutate(objectId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // Проверяем тост об ошибке с сообщением из ошибки
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка',
      description: 'Объект используется в расписании',
      type: 'error',
    })

    // Проверяем, что действия из onSuccess НЕ выполнялись
    expect(mockResetDictionaryCache).not.toHaveBeenCalled()
    expect(mockToasterCreate).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }))
  })
})
