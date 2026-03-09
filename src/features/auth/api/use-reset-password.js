import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api' // импортируем объект с запросами из этой же папки
import { useRouter } from 'next/navigation'

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      alert('Пароль успешно изменён')
      router.push('/login')
    },
    onError: (err) => alert(err.response?.data?.message || 'Ошибка сброса пароля'),
  })
}
