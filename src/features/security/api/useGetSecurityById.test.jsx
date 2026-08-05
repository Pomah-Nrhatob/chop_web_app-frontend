import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGetSecurityById } from './use-get-security-by-id'

describe('useGetSecurityById хук', () => {
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
  it('должен вернуть охранника, если он существует в кэше с указанными filters', () => {
    const filters = { name: 'Ivan', status: 'active' }
    const mockSecurities = [
      { id: 1, name: 'Ivan', status: 'active' },
      { id: 2, name: 'Oleg', status: 'active' },
      { id: 3, name: 'Alex', status: 'archived' },
    ]

    // ✅ КЛЮЧЕВОЙ МОМЕНТ: Вручную кладем данные в кэш перед рендером хука
    queryClient.setQueryData(['securities', filters], mockSecurities)

    // Запрашиваем объект с id: 2
    const { result } = renderHook(() => useGetSecurityById(1, filters), { wrapper })

    // Проверяем, что хук вернул правильный объект
    expect(result.current).toEqual({ id: 1, name: 'Ivan', status: 'active' })
  })

  // ============================================
  // ТЕСТ №2: Объект НЕ найден в кэше
  // ============================================
  it('должен вернуть undefined, если охраннника с таким id нет в кэше', () => {
    const filters = { status: 'active' }
    const mockSecurities = [{ id: 1, name: 'Stas' }]

    queryClient.setQueryData(['securities', filters], mockSecurities)

    // Запрашиваем несуществующий id: 99
    const { result } = renderHook(() => useGetSecurityById(99, filters), { wrapper })

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

    const { result } = renderHook(() => useGetSecurityById(1, filters), { wrapper })

    expect(result.current).toBeUndefined()
  })

  // ============================================
  // ТЕСТ №4: Проверка изоляции по filters
  // ============================================
  it('должен искать охранника только в кэше с соответствующими filters', () => {
    const activeFilters = { status: 'active' }
    const archivedFilters = { status: 'archived' }

    queryClient.setQueryData(['securities', activeFilters], [{ id: 1, name: 'Активный охранник' }])
    queryClient.setQueryData(
      ['securities', archivedFilters],
      [{ id: 1, name: 'Архивный охранник' }]
    )

    // Запрашиваем id: 1, но с filters для архива
    const { result } = renderHook(() => useGetSecurityById(1, archivedFilters), { wrapper })

    // Должен вернуться объект из архива, а не активный
    expect(result.current).toEqual({ id: 1, name: 'Архивный охранник' })
  })
})
