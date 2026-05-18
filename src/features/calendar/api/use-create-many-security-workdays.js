import { toaster } from '@/providers/chakraProvider/toaster'
import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateManySecurityWorkdays = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => securityWorkdaysApi.createManySecurityWorkdays(data),
    onError: (err) => {
      console.log(err)
      toaster.create({
        title: 'Ошибка создания рабочих дней',
        description: err?.message,
        type: 'error',
      })
    },
  })
}
