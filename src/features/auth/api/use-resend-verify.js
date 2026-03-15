import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from './auth-api'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useResendVerify = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data) => authApi.requestVerifyEmail(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно!',
        description: res?.message,
        type: 'success',
      })

      router.push('/login')
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
