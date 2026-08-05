import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGetObjectById } from './use-get-object-by-id' // Укажи правильный путь

describe('useGetObjectById хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    // Создаем чистый клиент для каждого теста
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
  // ТЕСТ №1: Объект найден в кэше
  // ============================================
  it('должен вернуть объект, если он существует в кэше с указанными filters', () => {
    const filters = { status: 'active', type: 'building' }
    const mockObjects = [
      { id: 1, name: 'Объект А', status: 'active' },
      { id: 2, name: 'Объект Б', status: 'active' },
      { id: 3, name: 'Объект В', status: 'archived' },
    ]

    // ✅ КЛЮЧЕВОЙ МОМЕНТ: Вручную кладем данные в кэш перед рендером хука
    queryClient.setQueryData(['objects', filters], mockObjects)

    // Запрашиваем объект с id: 2
    const { result } = renderHook(() => useGetObjectById(2, filters), { wrapper })

    // Проверяем, что хук вернул правильный объект
    expect(result.current).toEqual({ id: 2, name: 'Объект Б', status: 'active' })
  })

  // ============================================
  // ТЕСТ №2: Объект НЕ найден в кэше
  // ============================================
  it('должен вернуть undefined, если объекта с таким id нет в кэше', () => {
    const filters = { status: 'active' }
    const mockObjects = [{ id: 1, name: 'Объект А' }]

    queryClient.setQueryData(['objects', filters], mockObjects)

    // Запрашиваем несуществующий id: 99
    const { result } = renderHook(() => useGetObjectById(99, filters), { wrapper })

    // Метод .find() вернет undefined, если ничего не нашел
    expect(result.current).toBeUndefined()
  })

  // ============================================
  // ТЕСТ №3: Кэш пуст (данные еще не загружены)
  // ============================================
  it('должен вернуть undefined и не упасть с ошибкой, если кэш пуст', () => {
    const filters = { status: 'active' }

    // Мы НАМЕРЕННО не вызываем queryClient.setQueryData.
    // Кэш для этого ключа пуст (undefined).

    const { result } = renderHook(() => useGetObjectById(1, filters), { wrapper })

    // Благодаря опциональной цепочке (objects?.find), хук должен вернуть undefined, а не выбросить ошибку
    expect(result.current).toBeUndefined()
  })

  // ============================================
  // ТЕСТ №4: Проверка изоляции по filters
  // ============================================
  it('должен искать объект только в кэше с соответствующими filters', () => {
    const activeFilters = { status: 'active' }
    const archivedFilters = { status: 'archived' }

    queryClient.setQueryData(['objects', activeFilters], [{ id: 1, name: 'Активный объект' }])
    queryClient.setQueryData(['objects', archivedFilters], [{ id: 1, name: 'Архивный объект' }])

    // Запрашиваем id: 1, но с filters для архива
    const { result } = renderHook(() => useGetObjectById(1, archivedFilters), { wrapper })

    // Должен вернуться объект из архива, а не активный
    expect(result.current).toEqual({ id: 1, name: 'Архивный объект' })
  })
})
