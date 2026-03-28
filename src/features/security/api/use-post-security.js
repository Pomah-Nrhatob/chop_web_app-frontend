import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { securityApi } from '@/shared/api/security/security-api'

export const usePostSecurity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => securityApi.postSecurity(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Охранник добавлен',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['securities'] })
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
