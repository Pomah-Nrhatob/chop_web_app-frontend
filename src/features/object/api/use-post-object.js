import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { objectApi } from '@/shared/api/object/object-api'

export const usePostObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => objectApi.postObject(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Объект добавлен',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['objects'] })
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
