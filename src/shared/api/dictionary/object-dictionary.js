import { apiClient } from '@/shared/api/api'

export const objectDictionaryApi = {
  getObjectDictionary: async () => {
    return apiClient.get('/dictionary/security-objects', { needAuth: true })
  },
}
