import { toaster } from '@/providers/chakraProvider/toaster'
import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => securityWorkdaysApi.createVacation(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Расписание успешно создано',
        type: 'success',
      })

      queryClient.invalidateQueries({
        queryKey: ['calendar-allObjects'],
      })
      queryClient.invalidateQueries({ queryKey: ['calendar-security-workdays'] })

      queryClient.invalidateQueries({ queryKey: ['calendar-oneDay'] })
      queryClient.invalidateQueries({ queryKey: ['oneObjectWorkdayInfo'] })
    },
    onError: (err) => {
      console.log(err)
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message || err?.message,
        type: 'error',
      })
    },
  })
}
