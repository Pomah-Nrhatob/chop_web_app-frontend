import { USER_QUERY_KEY } from '@/features/users/api/use-user'
import { companyApi } from '@/shared/api/company/company-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const COMPANY_QUERY_KEY = ['companies']

export const useCompanies = () => {
  return useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: () => companyApi.getAllUserByCompany(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyApi.createCompany(data),

    onSuccess: (newCompany) => {
      queryClient.setQueryData(USER_QUERY_KEY, (oldUser) => {
        if (!oldUser) return oldUser

        return {
          ...oldUser,
          activeCompanyId: newCompany.company.id,
          companies: [...(oldUser.companies || []), newCompany.company],
          // Если в ответе есть companyUsers, обновляем и их
          companyUsers: newCompany.companyUsers
            ? [...(oldUser.companyUsers || []), newCompany.companyUsers]
            : oldUser.companyUsers,
        }
      })

      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY })
    },
  })
}

// 🔹 Удаление компании
export const useDeleteCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId) => companyApi.deleteCompany(companyId),

    onSuccess: (_, companyId) => {
      // Удаляем компанию из кэша пользователя
      queryClient.setQueryData(USER_QUERY_KEY, (oldUser) => {
        if (!oldUser) return oldUser

        return {
          ...oldUser,
          companies: (oldUser.companies || []).filter((c) => c.id !== companyId),
          activeCompanyId: oldUser.activeCompanyId === companyId ? null : oldUser.activeCompanyId,
        }
      })

      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY })
    },
  })
}

// 🔹 Обновление связи пользователь-компания (роль)
export const useUpdateUserCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyApi.updateUserCompany(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}

// 🔹 Удаление связи пользователь-компания (выход из компании)
export const useDeleteUserCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => companyApi.deleteUserCompany(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}
