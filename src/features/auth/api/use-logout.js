'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { authApi } from '@/shared/api/auth/auth-api'
import { cachedTokens, clearUserSession, USER_QUERY_KEY } from '@/shared/api/api'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        // 1. Backend logout с refresh_token из кэша
        if (cachedTokens?.refreshToken) {
          await authApi.logout({ refresh_token: cachedTokens.refreshToken })
        }

        // 2. NextAuth logout (очищает JWT куки)
        await signOut({ redirect: false })

        // 3. Очищаем фронт состояние
        clearUserSession()
        queryClient.removeQueries({ queryKey: USER_QUERY_KEY })
        queryClient.clear()

        console.log('✅ Полный logout завершён')
      } catch (error) {
        console.error('Backend logout error:', error)
        // Продолжаем локальный logout даже при ошибке backend
        await signOut({ redirect: false })
        clearUserSession()
        queryClient.clear()
      }
    },
    onSuccess: () => {
      router.push('/login')
      router.refresh()
    },
    onError: () => {
      router.push('/login')
      router.refresh()
    },
  })
}
