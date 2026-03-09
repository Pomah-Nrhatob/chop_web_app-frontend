import { $api } from '@/shared/api/api'

export const authApi = {
  // Регистрация
  registration: async (data) => {
    const response = await $api.post('/auth/registration', data)
    return response.data
  },

  // Логин
  login: async (data) => {
    const response = await $api.post('/auth/login', data)
    return response.data
  },

  // Выход
  logout: async () => {
    const response = await $api.post('/auth/logout')
    return response.data
  },

  verifyEmail: async (token) => {
    const response = await $api.get(`/auth/verify/${token}`)
    return response.data
  },

  resetPasswordRequest: async (data) => {
    const response = await $api.post('/auth/request-password-reset', data)
    return response.data
  },

  resetPassword: async (data) => {
    const response = await $api.put(`auth/reset-password/${data.token}`, {
      newPassword: data.newPassword,
    })
    return response.data
  },

  requestVerifyEmail: async (data) => {
    const response = await $api.post('/auth/request-verify-email', data)
    return response.data
  },
}
