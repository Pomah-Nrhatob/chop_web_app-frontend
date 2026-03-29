import { apiClient } from '@/shared/api/api'

export const objectApi = {
  getObjectList: async (filters) => {
    const cleanQuery = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined)
    )

    return apiClient.get('/security-objects', {
      query: cleanQuery,
      needAuth: true,
    })
  },

  postObject: async (data) => {
    return apiClient.post('/security-objects', {
      data,
      needAuth: true,
    })
  },

  updateObject: async (id, data) => {
    return apiClient.put(`/security-objects/${id}`, {
      data,
      needAuth: true,
    })
  },

  deleteObject: async (id) => {
    return apiClient.delete(`/security-objects/${id}`, {
      needAuth: true,
    })
  },
}
