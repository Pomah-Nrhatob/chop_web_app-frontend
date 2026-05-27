import { toaster } from '@/providers/chakraProvider/toaster'
import { scheduleApi } from '@/shared/api/schedule/schedule-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => scheduleApi.createschedule(data),
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
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
