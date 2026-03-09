import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from './auth-api'

export const useVerify = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (token) => authApi.verifyEmail(token),
    onSuccess: (res) => {
      alert(res.message || 'Почта подтверждена!')
      router.push('/login') // После успеха отправляем на логин
    },
    onError: (err) => {
      console.log(err)
      alert(err.response?.data?.message || 'Ошибка верификации')
    },
  })
}
