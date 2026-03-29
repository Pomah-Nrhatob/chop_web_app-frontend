import { useQueryClient } from '@tanstack/react-query'

export const useGetObjectById = (id, filters) => {
  const queryClient = useQueryClient()

  const objects = queryClient.getQueryData(['objects', filters])

  return objects?.find((item) => item.id === id)
}
