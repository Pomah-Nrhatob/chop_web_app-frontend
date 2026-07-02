import { useQuery } from '@tanstack/react-query'
// Предполагаем, что функция находится в вашей api-библиотеке

import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'

export const useGetCalendarSecurityWorkdays = ({ securityId, year, month }) => {
  return useQuery({
    queryKey: ['calendar-security-workdays', { securityId, year, month }],
    queryFn: async () => {
      try {
        const response = await securityWorkdaysApi.getSecurityWorkdaysMonth({
          year,
          month,
          securityId,
        })
        return response?.data || response
      } catch (err) {
        // Так как в useQuery писать onError нельзя, перехватываем ошибку здесь
        toaster.create({
          title: 'Ошибка загрузки',
          description:
            err.response?.data?.message || err?.message || 'Не удалось загрузить календарь',
          type: 'error',
        })
        throw err // Обязательно пробрасываем ошибку дальше для TanStack Query
      }
    },
    enabled: !!securityId,
  })
}
