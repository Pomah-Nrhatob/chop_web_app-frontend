import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'

export const useUpdateObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => objectApi.updateObject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
    },
  })
}
