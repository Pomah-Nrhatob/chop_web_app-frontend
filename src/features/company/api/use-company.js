import { USER_QUERY_KEY } from '@/features/users/api/use-user'
import { toaster } from '@/providers/chakraProvider/toaster'
import { companyApi } from '@/shared/api/company/company-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const COMPANY_QUERY_KEY = ['companies']
export const ONE_COMPANY_QUERY_KEY = ['company']

export const useCompanies = () => {
  const query = useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: () => companyApi.getAllCompany(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  return {
    ...query,
    companies: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}

export const useOneCompany = () => {
  const query = useQuery({
    queryKey: ONE_COMPANY_QUERY_KEY,
    queryFn: () => companyApi.getActiveCompany(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  return {
    ...query,
    activeCompanyInfo: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
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
      queryClient.invalidateQueries({ queryKey: ONE_COMPANY_QUERY_KEY })
    },
  })
}

// 🔹 Удаление компании
export const useDeleteCompany = (additionalOnSuccess) => {
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
      additionalOnSuccess?.()

      toaster.create({
        title: 'Компания удалена',
        description: 'Компания успешно удалена',
        type: 'success',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
    onError: (error) => {
      additionalOnSuccess?.()
      toaster.create({
        title: 'Ошибка',
        description: error.message,
        type: 'error',
        duration: 3000,
      })
    },
  })
}

// 🔹 Обновление связи пользователь-компания (роль)
export const useUpdateUserCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyApi.updateUserCompany(data),

    onSuccess: () => {
      toaster.create({
        title: 'Сотрудник в компании изменен',
        type: 'success',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: ONE_COMPANY_QUERY_KEY })
    },
    onError: (error) => {
      toaster.create({
        title: 'Ошибка',
        description: error.message || 'Неизвестная ошибка, повторите попытку',
        type: 'error',
        duration: 3000,
      })
    },
  })
}

export const useAddUserCompany = (additionalOnSuccess) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyApi.addUserCompany(data),
    onSuccess: () => {
      additionalOnSuccess?.()

      toaster.create({
        title: 'Сотрудник добавлен в компанию',
        type: 'success',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: ONE_COMPANY_QUERY_KEY })
    },
    onError: (error) => {
      additionalOnSuccess?.()
      toaster.create({
        title: 'Ошибка',
        description: error.message || 'Неизвестная ошибка, повторите попытку',
        type: 'error',
        duration: 3000,
      })
    },
  })
}

// 🔹 Удаление связи пользователь-компания (выход из компании)
export const useDeleteUserCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => companyApi.deleteUserCompany(userId),

    onSuccess: () => {
      toaster.create({
        title: 'Сотрудник удален из компании',
        type: 'success',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: ONE_COMPANY_QUERY_KEY })
    },
    onError: (error) => {
      toaster.create({
        title: 'Ошибка',
        description: error.message || 'Неизвестная ошибка, повторите попытку',
        type: 'error',
        duration: 3000,
      })
    },
  })
}
