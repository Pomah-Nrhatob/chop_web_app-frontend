import { toaster } from '@/providers/chakraProvider/toaster'

import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => securityWorkdaysApi.removeVacationWorkday(id),
    onSuccess: () => {
      toaster.create({
        title: 'Успешно',
        description: 'День отпуска удалён',
        type: 'success',
      })

      // Инвалидируем все связанные кэши
      queryClient.invalidateQueries({ queryKey: ['calendar-security-workdays'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-allObjects'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-oneDay'] })
      queryClient.invalidateQueries({ queryKey: ['oneObjectWorkdayInfo'] })
    },
    onError: (err) => {
      console.error('Error removing vacation workday:', err)
      toaster.create({
        title: 'Ошибка',
        description:
          err?.response?.data?.message || err?.message || 'Не удалось удалить день отпуска',
        type: 'error',
      })
    },
  })
}
