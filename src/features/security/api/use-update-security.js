import { useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'

export const useUpdateSecurity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => securityApi.updateSecurity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securities'] })
    },
  })
}
