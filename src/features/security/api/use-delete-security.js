// features/security/api/use-delete-security.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useDeleteSecurity = (onSuccessCallback) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => securityApi.deleteSecurity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securities'] })
      toaster.create({
        title: 'Удалено',
        description: 'Охранник успешно удален из базы',
        type: 'success',
      })
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.message || 'Не удалось удалить объект',
        type: 'error',
      })
    },
  })
}
