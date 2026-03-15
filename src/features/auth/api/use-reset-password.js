import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api' // импортируем объект с запросами из этой же папки
import { toaster } from '@/providers/chakraProvider/toaster'
import { useRouter } from 'next/navigation'

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
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
