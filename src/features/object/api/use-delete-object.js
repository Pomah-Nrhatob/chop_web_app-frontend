import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useDeleteObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => objectApi.deleteObject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      toaster.create({
        title: 'Удалено',
        description: 'Объект успешно удален из базы',
        type: 'success',
      })
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
