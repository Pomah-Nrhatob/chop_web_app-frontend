import { apiClient } from '@/shared/api/api'

export const userApi = {
  getMe: async () => apiClient.get('/users/me', { needAuth: true }),
  changeActiveCompany: async (data) =>
    apiClient.patch('/users/active-company', { data, needAuth: true }),
}
