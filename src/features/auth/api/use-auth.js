import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/entities/user/model/store'
import { authApi } from './auth-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useAuth = () => {
  const router = useRouter()
  const { setAuth } = useUserStore()

  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Вход выполнен успешно',
        type: 'success',
      })
      setAuth(res.access_token)
      router.push('/')
    },

    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
