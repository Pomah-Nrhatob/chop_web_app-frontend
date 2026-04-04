import { useState, useEffect } from 'react' // Добавьте эту строку
import { useQuery } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'

export const useGetSecurity = (filters) => {
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    // Если изменилась ТОЛЬКО страница или лимит — обновляем фильтры МГНОВЕННО
    const isPaginationOnly =
      filters.page !== debouncedFilters.page || filters.limit !== debouncedFilters.limit

    if (isPaginationOnly) {
      setDebouncedFilters(filters)
      return
    }

    // Для поиска и других фильтров оставляем задержку
    const handler = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 400)

    return () => clearTimeout(handler)
  }, [filters])

  return useQuery({
    queryKey: ['securities', debouncedFilters],
    queryFn: () => securityApi.getSecurityList(debouncedFilters),
    placeholderData: (previousData) => previousData, // Чтобы список не прыгал

    staleTime: 5 * 60 * 1000, // 5 минут (данные считаются свежими и не перезапрашиваются зря)
    gcTime: 30 * 60 * 1000, // 30 минут (хранить в памяти для мгновенного возврата назад)
  })
}
