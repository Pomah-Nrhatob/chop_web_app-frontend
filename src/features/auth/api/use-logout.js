'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { USER_QUERY_KEY } from '@/features/users/api/use-user'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Ошибка при выходе')
      }

      const data = await res.json()

      await signOut({ redirect: false })

      return data
    },
    onSuccess: () => {
      // queryClient.clear()
      router.push('/login')
    },
    onError: (err) => {
      console.error('Ошибка при выходе:', err)

      signOut({ redirect: false }).finally(() => {
        router.push('/login')
      })
    },
  })
}
