import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGetSecurityByIdApi } from './use-get-security-by-id-api' // ⚠️ Убедись, что путь верный!

// ============================================
// ШАГ 1: Создаём "пустышки" (моки) через hoisted
// ============================================
const { mockGetSecurityById } = vi.hoisted(() => ({
  mockGetSecurityById: vi.fn(),
}))

vi.mock('@/shared/api/security/security-api', () => ({
  securityApi: {
    getSecurityById: mockGetSecurityById,
  },
}))

// ============================================
// ШАГ 2: Настройка окружения
// ============================================
describe('useGetSecurityByIdApi хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  // ============================================
  // ТЕСТ №1: Успешный запрос
  // ============================================
  it('должен вернуть данные сотрудника и сбросить isLoading после успешного запроса', async () => {
    const mockData = { id: 1, name: 'Иван', surname: 'Иванов' }
    mockGetSecurityById.mockResolvedValue(mockData)

    const { result } = renderHook(() => useGetSecurityByIdApi(), { wrapper })

    // Изначально isLoading = false
    expect(result.current.isLoading).toBe(false)

    // Вызываем функцию внутри act, так как она меняет состояние React
    let response
    await act(async () => {
      response = await result.current.fetchSecurity(1)
    })

    // 1. Проверяем, что вернулись правильные данные
    expect(response).toEqual(mockData)

    // 2. Проверяем, что API был вызван с правильным id
    expect(mockGetSecurityById).toHaveBeenCalledWith(1)

    // 3. Проверяем, что isLoading снова стал false (благодаря finally)
    expect(result.current.isLoading).toBe(false)
  })

  // ============================================
  // ТЕСТ №2: isLoading меняется во время запроса
  // ============================================
  it('должен установить isLoading в true во время выполнения запроса', async () => {
    // Создаем "медленный" промис, чтобы успеть проверить состояние isLoading
    let resolvePromise
    const slowPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockGetSecurityById.mockReturnValue(slowPromise)

    const { result } = renderHook(() => useGetSecurityByIdApi(), { wrapper })

    // Запускаем запрос, но НЕ ждём его завершения
    let fetchPromise
    act(() => {
      fetchPromise = result.current.fetchSecurity(1)
    })

    // В этот момент запрос ещё идёт, isLoading должен быть true
    expect(result.current.isLoading).toBe(true)

    // Завершаем "медленный" запрос
    await act(async () => {
      resolvePromise({ id: 1, name: 'Тест' })
      await fetchPromise
    })

    // После завершения isLoading снова false
    expect(result.current.isLoading).toBe(false)
  })

  // ============================================
  // ТЕСТ №3: Валидация (отсутствие id)
  // ============================================
  it('должен выбросить ошибку "ID is required", если id не передан', async () => {
    const { result } = renderHook(() => useGetSecurityByIdApi(), { wrapper })

    // Проверяем, что функция выбрасывает ошибку при отсутствии id
    await expect(async () => {
      await act(async () => {
        await result.current.fetchSecurity(null)
      })
    }).rejects.toThrow('ID is required')

    // API не должен был вызываться
    expect(mockGetSecurityById).not.toHaveBeenCalled()
  })

  // ============================================
  // ТЕСТ №4: Ошибка API (проверка finally)
  // ============================================
  it('должен сбросить isLoading в false даже при ошибке API (благодаря finally)', async () => {
    const apiError = new Error('Сотрудник не найден')
    mockGetSecurityById.mockRejectedValue(apiError)

    const { result } = renderHook(() => useGetSecurityByIdApi(), { wrapper })

    // Проверяем, что функция пробрасывает ошибку дальше
    await expect(async () => {
      await act(async () => {
        await result.current.fetchSecurity(999)
      })
    }).rejects.toThrow('Сотрудник не найден')

    // КРИТИЧЕСКИ ВАЖНО: isLoading должен быть false даже после ошибки
    // Это доказывает, что блок finally отработал корректно
    expect(result.current.isLoading).toBe(false)
  })

  // ============================================
  // ТЕСТ №5: Повторный вызов после ошибки
  // ============================================
  it('должен корректно работать после ошибки (сброс состояния позволяет повторный вызов)', async () => {
    // Первый вызов — с ошибкой
    mockGetSecurityById.mockRejectedValueOnce(new Error('Ошибка'))

    const { result } = renderHook(() => useGetSecurityByIdApi(), { wrapper })

    await expect(async () => {
      await act(async () => {
        await result.current.fetchSecurity(1)
      })
    }).rejects.toThrow()

    expect(result.current.isLoading).toBe(false)

    // Второй вызов — успешный
    const mockData = { id: 1, name: 'Успех' }
    mockGetSecurityById.mockResolvedValueOnce(mockData)

    let response
    await act(async () => {
      response = await result.current.fetchSecurity(1)
    })

    expect(response).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
  })
})
