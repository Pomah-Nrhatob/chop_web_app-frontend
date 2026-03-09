import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api'
import { useRouter } from 'next/navigation'

export const useResendVerify = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data) => authApi.requestVerifyEmail(data),
    onSuccess: (res) => {
      alert(res.message || 'Новое письмо отправлено!')
      router.push('/login')
    },
    onError: (err) => alert(err.response?.data?.message || 'Ошибка отправки'),
  })
}
