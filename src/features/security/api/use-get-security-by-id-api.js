import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'

export const useGetSecurityByIdApi = () => {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const fetchSecurity = async (id) => {
    if (!id) {
      throw new Error('ID is required')
    }

    setIsLoading(true)
    try {
      return await queryClient.fetchQuery({
        queryKey: ['security', id],
        queryFn: () => securityApi.getSecurityById(id),
        staleTime: 0,
        retry: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchSecurity,
    isLoading,
  }
}
