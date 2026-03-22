'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export const useLogout = () => {
  const router = useRouter()

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
