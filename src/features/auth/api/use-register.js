import { useMutation } from '@tanstack/react-query'
import { authApi } from './auth-api' // импортируем объект с запросами из этой же папки

export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => authApi.registration(data),
    onSuccess: (res) => {
      alert(res.message || 'Проверьте почту для подтверждения!')
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Ошибка при регистрации')
    },
  })
}
