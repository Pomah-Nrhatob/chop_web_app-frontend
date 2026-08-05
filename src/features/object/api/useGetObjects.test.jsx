import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGetObjects } from './use-get-objects' // Убедись, что путь верный!
import { objectApi } from '@/shared/api/object/object-api'

const { mockGetObjectList } = vi.hoisted(() => ({
  mockGetObjectList: vi.fn(),
}))

vi.mock('@/shared/api/object/object-api', () => ({
  objectApi: {
    getObjectList: mockGetObjectList,
  },
}))

describe('useGetObjects хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('должен выполнить запрос с начальными фильтрами', async () => {
    const initialFilters = { page: 1, limit: 10, search: '' }
    const mockResponse = { data: [{ id: 1, name: 'Объект 1' }] }

    mockGetObjectList.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useGetObjects(initialFilters), { wrapper })

    // ✅ ИСПРАВЛЕНИЕ: Явно продвигаем время на 400 мс.
    // Это запускает useEffect, который вызывает setDebouncedFilters,
    // а затем useQuery делает запрос, и промис разрешается.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(mockGetObjectList).toHaveBeenCalledTimes(1)
    expect(mockGetObjectList).toHaveBeenCalledWith(initialFilters)
    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.isLoading).toBe(false)
  })

  it('должен выполнить запрос МГНОВЕННО при изменении page или limit', async () => {
    const initialFilters = { page: 1, limit: 10, search: '' }
    mockGetObjectList.mockResolvedValue({ data: [] })

    const { result, rerender } = renderHook(({ filters }) => useGetObjects(filters), {
      wrapper,
      initialProps: { filters: initialFilters },
    })

    // 1. Ждем начальной инициализации
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    mockGetObjectList.mockClear()

    // 2. Меняем пагинацию
    const newFilters = { page: 2, limit: 10, search: '' }
    rerender({ filters: newFilters })

    // 3. Для пагинации задержки 400 мс нет, но useQuery всё равно асинхронный.
    // Даем ему 0 мс (один тик событийного цикла), чтобы промис запустился.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(mockGetObjectList).toHaveBeenCalledTimes(1)
    expect(mockGetObjectList).toHaveBeenCalledWith(newFilters)
  })

  it('должен ждать 400 мс перед запросом при изменении search', async () => {
    const initialFilters = { page: 1, limit: 10, search: '' }
    mockGetObjectList.mockResolvedValue({ data: [] })

    const { result, rerender } = renderHook(({ filters }) => useGetObjects(filters), {
      wrapper,
      initialProps: { filters: initialFilters },
    })

    // Начальная инициализация
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    mockGetObjectList.mockClear()

    // Меняем поисковый запрос
    const searchFilters = { page: 1, limit: 10, search: 'тест' }
    rerender({ filters: searchFilters })

    // Продвигаем на 300 мс. Запроса еще быть не должно!
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(mockGetObjectList).not.toHaveBeenCalled()

    // Продвигаем еще на 100 мс (итого 400 мс). Теперь запрос должен уйти.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(mockGetObjectList).toHaveBeenCalledTimes(1)
    expect(mockGetObjectList).toHaveBeenCalledWith(searchFilters)
  })
})
