import { toaster } from '@/providers/chakraProvider/toaster'
import { userApi } from '@/shared/api/user/user-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const USER_QUERY_KEY = ['user', 'me']

export const useUser = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => userApi.getMe(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const refreshUser = async () => {
    return queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
  }

  const updateUserCache = (userData) => {
    queryClient.setQueryData(USER_QUERY_KEY, (old) => (old ? { ...old, ...userData } : old))
  }

  return {
    ...query,
    user: query.data,
    isLoading: query.isLoading,
    refreshUser,
    updateUserCache,
  }
}

export const useChangeActiveCompany = (additionalOnSuccess) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => userApi.changeActiveCompany(data),

    onSuccess: (response, variables) => {
      queryClient.setQueryData(USER_QUERY_KEY, (oldUser) => {
        if (!oldUser) return oldUser

        return {
          ...oldUser,
          activeCompanyId: variables.activeCompanyId,
        }
      })

      additionalOnSuccess?.()

      toaster.create({
        title: 'Активная компания успешно изменена',
        type: 'success',
      })
    },

    onError: (error) => {
      toaster.create({
        title: 'Ошибка изменения активной компании',
        description: error.response?.data?.message || 'Попробуйте позже',
        type: 'error',
      })
    },
  })

  return {
    changeActiveCompany: mutation.mutate,
    isLoading: mutation.isPending, // или mutation.isLoading в старых версиях React Query
    isError: mutation.isError,
    error: mutation.error,
  }
}
