import { apiClient } from '@/shared/api/api'

const cleanQuery = (query) => {
  return Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== '' && v !== undefined))
}

export const securityWorkdaysApi = {
  getSecurityWorkdaysMonth: async (query) => {
    return apiClient.get('/security-workdays', { needAuth: true, query: cleanQuery(query) })
  },

  getOneSecurityWorkday: async (id) => {
    return apiClient.get(`/security-workdays/${id}`, { needAuth: true })
  },

  createSecurityWorkday: async (data) => {
    return apiClient.post('/security-workdays', { needAuth: true, data })
  },

  createManySecurityWorkdays: async (data) => {
    return apiClient.post('/security-workdays/bulk', { needAuth: true, data })
  },

  createVacation: async (data) => {
    return apiClient.post('/security-workdays/create-vacation', { data, needAuth: true })
  },

  removeVacationWorkday: async (id) => {
    return apiClient.delete(`/security-workdays/remove-vacation/${id}`, {
      needAuth: true,
    })
  },

  updateSecurityWorkday: async (id, data) => {
    return apiClient.patch(`/security-workdays/${id}`, { needAuth: true, data })
  },

  updateManySecurityWorkdays: async (data) => {
    return apiClient.patch('/security-workdays/bulk', { needAuth: true, data })
  },

  deleteSecurityWorkday: async (id) => {
    return apiClient.delete(`/security-workdays/${id}`, { needAuth: true })
  },

  deleteManySecurityWorkdays: async (data) => {
    return apiClient.post('/security-workdays/delete-bulk', { needAuth: true, data })
  },
}
