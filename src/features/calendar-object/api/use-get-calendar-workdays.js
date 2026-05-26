import { useQuery } from '@tanstack/react-query'
// Предполагаем, что функция находится в вашей api-библиотеке
import { objectWorkdaysApi } from '@/shared/api/objectWorkdays/objectWorkdays-api'

export const useGetCalendarObjectWorkdays = ({ securityObjectId, year, month }) => {
  return useQuery({
    queryKey: ['calendar-allObjects', { securityObjectId, year, month }],
    queryFn: async () => {
      try {
        const response = await objectWorkdaysApi.getObjectWorkdaysMonth({
          year,
          month,
          securityObjectId,
        })
        return response?.data || response
      } catch (err) {
        // Так как в useQuery писать onError нельзя, перехватываем ошибку здесь
        toaster.create({
          title: 'Ошибка загрузки',
          description: err.response?.data?.message || 'Не удалось загрузить календарь',
          type: 'error',
        })
        throw err // Обязательно пробрасываем ошибку дальше для TanStack Query
      }
    },
    enabled: !!securityObjectId,
  })
}
