import { ONE_COMPANY_QUERY_KEY } from '@/features/company/api/use-company'
import { DICTIONARY_OBJECTS_KEY } from '@/features/dictionary/api/use-get-dictionary-objects'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'
import { DICTIONARY_SECURITY_POSITION_KEY } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
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
  const { refreshUser } = useUser()
  const queryClient = useQueryClient()
  const { resetDictionaryCache } = useDictionaryCacheReset()

  const mutation = useMutation({
    mutationFn: (data) => userApi.changeActiveCompany(data),

    //
    onSuccess: async () => {
      await refreshUser()

      resetDictionaryCache([
        DICTIONARY_OBJECTS_KEY,
        DICTIONARY_SECURITIES_KEY,
        DICTIONARY_SECURITY_POSITION_KEY,
      ])

      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0]
          return (
            key === 'calendar-security-workdays' ||
            key === 'calendar-object-workdays' ||
            key === 'calendar-allObjects' ||
            key === 'calendar-oneDay' ||
            key === 'dictionary-securities' ||
            key === 'dictionary-securityPosition' ||
            key === 'dictionary-objects' ||
            key === 'objects' ||
            key === 'securities' ||
            USER_QUERY_KEY
          )
        },
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
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useSearchUsers = () => {
  const mutation = useMutation({
    mutationFn: (searchQuery) => userApi.getAllUsers(searchQuery),
  })

  return {
    users: mutation.data || [],
    searchUsers: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
