import { apiClient } from '@/shared/api/api'

export const profileApi = {
  get: async () => apiClient.get('users/me', { needAuth: true }),

  update: async (data) => apiClient.patch('/users/me', { data, needAuth: true }),

  changePassword: async (data) =>
    apiClient.post('/users/me/change-password', { data, needAuth: true }),
}
