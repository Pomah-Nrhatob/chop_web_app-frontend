import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useRouter } from 'next/navigation'

export const useForgotPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data) => authApi.resetPasswordRequest(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Сброс пароля успешен',
        description: res?.message,
        type: 'success',
      })
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    },
  })
}
