import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useUpdateObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => objectApi.updateObject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      toaster.create({
        title: 'Успешно',
        description: 'Данные объекта изменены',
        type: 'success',
      })
    },
  })
}
