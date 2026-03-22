import { apiClient } from '@/shared/api/api'

export const securityApi = {
  getSecurityList: async () => apiClient.get('/security', { needAuth: true }),
}
