'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clearUserSession, USER_QUERY_KEY } from '@/shared/api/api'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        // 1. ✅ СЕРВЕРНЫЙ LOGOUT (берёт refresh_token из сессии)
        await fetch('/api/logout', {
          method: 'POST',
          // Без тела — сервер берёт из JWT сессии
        })

        // 2. NextAuth logout (очищает JWT куки)
        await signOut({ redirect: false })

        // 3. Локальная очистка
        clearUserSession()
        queryClient.removeQueries({ queryKey: USER_QUERY_KEY })
        queryClient.clear()

        console.log('✅ Полный logout завершён')
      } catch (error) {
        console.error('Logout error:', error)
        // Fallback
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
