import { useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useRouter } from 'next/navigation'
import { authApi } from '@/shared/api/auth/auth-api'

export const useResetPassword = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),

    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно!',
        description: res?.message,
        type: 'success',
      })

      setTimeout(() => {
        router.push('/login')
      }, 1000)
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message || err?.message || 'Ошибка сброса пароля',
        type: 'error',
      })
    },
  })
}
