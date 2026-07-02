import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toaster } from '@/providers/chakraProvider/toaster'
import { authApi } from '@/shared/api/auth/auth-api'

export const useVerify = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (token) => authApi.verifyEmail(token),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно!',
        description: res?.message,
        type: 'success',
      })

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message || err?.message,
        type: 'error',
      })
    },
  })
}
