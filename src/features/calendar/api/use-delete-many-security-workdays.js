import { toaster } from '@/providers/chakraProvider/toaster'
import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteManySecurityWorkdays = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => securityWorkdaysApi.deleteManySecurityWorkdays(data),
    onError: (err) => {
      console.log(err)
      toaster.create({
        title: 'Ошибка удаления рабочих дней',
        description: err?.message,
        type: 'error',
      })
    },
  })
}
