import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useRouter } from 'next/navigation'

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data) => authApi.registration(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Регистрация успешна',
        description: res?.message || 'Проверьте почту.',
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
