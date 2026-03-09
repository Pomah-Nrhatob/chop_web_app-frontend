import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/entities/user/model/store'
import { authApi } from './auth-api'

export const useAuth = () => {
  const router = useRouter()
  const { setAuth } = useUserStore()

  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      // Сохраняем в память приложения (не в localStorage!)
      setAuth(res.access_token)
      router.push('/')
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Ошибка входа')
    },
  })
}
