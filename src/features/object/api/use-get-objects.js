import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'

export const useGetObjects = (filters) => {
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    // Проверяем, изменилась ли страница или лимит
    const isPaginationAction =
      filters.page !== debouncedFilters.page || filters.limit !== debouncedFilters.limit

    // Если это пагинация — обновляем фильтры МГНОВЕННО
    if (isPaginationAction) {
      setDebouncedFilters(filters)
      return
    }

    // Если это поиск или другие фильтры — используем задержку
    const handler = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 400) // 400мс обычно достаточно

    return () => clearTimeout(handler)
  }, [filters, debouncedFilters.page, debouncedFilters.limit])

  return useQuery({
    // Используем дебаунс-фильтры для кеширования и запроса
    queryKey: ['objects', debouncedFilters],
    queryFn: () => objectApi.getObjectList(debouncedFilters),

    // placeholderData критически важен: он не дает списку исчезнуть при смене страницы
    placeholderData: (previousData) => previousData,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
