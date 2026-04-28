import { apiClient } from '@/shared/api/api'

export const securityDictionaryApi = {
  getSecurityDictionary: async () => {
    return apiClient.get('/dictionary/securities', { needAuth: true })
  },
}
