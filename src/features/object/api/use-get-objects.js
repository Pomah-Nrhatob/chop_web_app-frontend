import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'

export const useGetObjects = (filters) => {
  // 1. Создаем внутреннее состояние для "отложенных" фильтров
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    // 2. Устанавливаем таймер
    const handler = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 500) // Задержка 500мс

    // 3. Очищаем таймер, если filters изменились до истечения 500мс
    // Это и есть магия debounce — старый таймер убивается, новый запускается
    return () => clearTimeout(handler)
  }, [filters])

  return useQuery({
    // 4. В Ключе и в Функции запроса используем ТОЛЬКО дебаунс-версию
    queryKey: ['objects', debouncedFilters],
    queryFn: () => objectApi.getObjectList(debouncedFilters),
    // 5. Важно: оставляем старые данные на экране, пока грузятся новые (чтобы список не моргал)
    placeholderData: (previousData) => previousData,

    staleTime: 5 * 60 * 1000, // 5 минут (данные считаются свежими и не перезапрашиваются зря)
    gcTime: 30 * 60 * 1000, // 30 минут (хранить в памяти для мгновенного возврата назад)
  })
}
