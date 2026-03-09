import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api' // импортируем объект с запросами из этой же папки
import { useRouter } from 'next/navigation'

export const useForgotPassword = () => {
  const router = useRouter()

  return useMutation({
    // Убедитесь, что data передается целиком в authApi
    mutationFn: (data) => authApi.resetPasswordRequest(data),
    onSuccess: () => {
      alert('Инструкции отправлены на почту')
      router.push('/login')
    },
    onError: (err) => alert(err.response?.data?.message || 'Ошибка'),
  })
}
