import { apiClient } from '@/shared/api/api'

export const securityPositionDictionaryApi = {
  getSecurityPositionDictionary: async () => {
    return apiClient.get('/dictionary/security-position', { needAuth: true })
  },

  createSecurityPositionDictionary: async (data) => {
    return apiClient.post('/dictionary/security-position', { data, needAuth: true })
  },

  deleteSecurityPositionDictionary: async (id) => {
    return apiClient.delete(`/dictionary/security-position/${id}`, { needAuth: true })
  },
}
