import { useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { signIn } from 'next-auth/react'
import { authApi } from '@/shared/api/auth/auth-api'
import { useRouter } from 'next/navigation'
import { useUser } from '@/features/users/api/use-user'

export const useAuth = () => {
  const router = useRouter()
  const { refreshUser } = useUser()

  return useMutation({
    mutationFn: async (data) => {
      try {
        const userData = await authApi.login({
          email: data.email,
          password: data.password,
        })

        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          userFromFrontend: JSON.stringify(userData),
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Ошибка авторизации')
        }

        return result
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Ошибка входа'
        throw new Error(message)
      }
    },
    onSuccess: async () => {
      // refreshUser()
      toaster.create({
        title: 'Вход выполнен успешно',
        type: 'success',
      })
      router.push('/')
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка входа',
        description: err.message,
        type: 'error',
      })
    },
  })
}
