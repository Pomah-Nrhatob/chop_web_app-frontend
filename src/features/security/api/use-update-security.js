import { useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useUpdateSecurity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => securityApi.updateSecurity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securities'] })
      toaster.create({
        title: 'Усрешно',
        description: 'Данные охранника изменены',
        type: 'success',
      })
    },
  })
}
