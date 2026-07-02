import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { profileApi } from '@/shared/api/profile/profile-api'

export const PROFILE_KEY = 'profile'

export const useProfile = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: async () => {
      const response = await profileApi.get()
      return response
    },
  })

  return { profile: data, isLoading, isFetching }
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => profileApi.update(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Профиль обновлен',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message || err?.message || 'Не удалось обновить профиль',
        type: 'error',
      })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Пароль изменен',
        type: 'success',
      })
    },
    onError: (err) => {
      const errorMessage =
        err?.message || err?.response?.data?.message || 'Не удалось изменить пароль'

      toaster.create({
        title: 'Ошибка',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
    },
  })
}
