// src/features/object/api/use-delete-object.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'
import { toaster } from '@/providers/chakraProvider/toaster'

// 1. Добавляем аргумент onSuccessCallback
export const useDeleteObject = (onSuccessCallback) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => objectApi.deleteObject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.invalidateQueries({
        queryKey: ['calendar-allObjects'],
      })

      toaster.create({
        title: 'Удалено',
        description: 'Объект успешно удален из базы',
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
