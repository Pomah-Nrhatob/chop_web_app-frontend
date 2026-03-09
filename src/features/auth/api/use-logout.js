import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/entities/user/model/store'
import { authApi } from './auth-api'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout: clearStore } = useUserStore()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearStore() // Очищаем Zustand (user: null, isAuth: false)
      queryClient.clear() // Очищаем кеш React Query
      router.push('/login') // Редирект на вход
    },
    onError: (err) => {
      console.error('Ошибка при выходе:', err)
      // Даже если на бэкенде ошибка (токен протух),
      // лучше всё равно очистить локальный стор
      clearStore()
      router.push('/login')
    },
  })
}
