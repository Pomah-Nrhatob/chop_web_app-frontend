import { apiClient } from '@/shared/api/api'

export const securityApi = {
  getSecurityById: async (id) => {
    return apiClient.get(`/security/${id}`, { needAuth: true })
  },

  getSecurityList: async (filters) => {
    const cleanQuery = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined)
    )

    return apiClient.get('/security', {
      query: cleanQuery,
      needAuth: true,
    })
  },

  postSecurity: async (data) => {
    return apiClient.post('/security', {
      data,
      needAuth: true,
    })
  },

  updateSecurity: async (id, data) => {
    return apiClient.put(`/security/${id}`, {
      data,
      needAuth: true,
    })
  },

  deleteSecurity: async (id) => {
    return apiClient.delete(`/security/${id}`, {
      needAuth: true,
    })
  },
}
