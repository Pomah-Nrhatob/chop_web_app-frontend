import { apiClient } from '@/shared/api/api'

export const authApi = {
  registration: async (data) => apiClient.post('/auth/registration', { data }),
  login: async (credentials) => apiClient.post('/auth/login', { data: credentials }),
  logout: async ({ refresh_token }) =>
    apiClient.post('/auth/logout', {
      data: { refresh_token },
      needAuth: false,
    }),
  verifyEmail: async (token) => apiClient.get(`/auth/verify/${token}`, {}),
  resetPasswordRequest: async (data) => apiClient.post('/auth/request-password-reset', { data }),
  resetPassword: async (resetData) =>
    apiClient.put(`/auth/reset-password/${resetData.token}`, {
      data: { newPassword: resetData.newPassword },
    }),
  requestVerifyEmail: async (data) => apiClient.post('/auth/request-verify-email', { data }),
  refresh: async (data) => apiClient.post('/auth/refresh', { data }),
}
