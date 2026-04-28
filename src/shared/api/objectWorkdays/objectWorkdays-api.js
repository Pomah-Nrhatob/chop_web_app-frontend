import { apiClient } from '@/shared/api/api'

const cleanQuery = (query) => {
  return Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== '' && v !== undefined))
}

export const objectWorkdaysApi = {
  getObjectWorkdaysMonth: async (query) => {
    return apiClient.get('/object-workday', { needAuth: true, query: cleanQuery(query) })
  },

  getAllObjectWorkdaysWithPagination: async (query) => {
    return apiClient.get('/object-workday/all-objects', {
      needAuth: true,
      query: cleanQuery(query),
    })
  },

  getOneDayAllObjectWorkdaysWithPagination: async (query) => {
    return apiClient.get('/object-workday/one-day', { needAuth: true, query: cleanQuery(query) })
  },

  getOneObjectWorkday: async (id) => {
    return apiClient.get(`/object-workday/${id}`, { needAuth: true })
  },

  createObjectWorkday: async (data) => {
    return apiClient.post('/object-workday', { needAuth: true, data })
  },

  createManyObjectWorkdays: async (data) => {
    return apiClient.post('/object-workday/bulk', { needAuth: true, data })
  },

  deleteObjectWorkday: async (id) => {
    return apiClient.delete(`/object-workday/${id}`, { needAuth: true })
  },

  deleteManyObjectWorkdays: async (data) => {
    return apiClient.post('/object-workday/delete-bulk', { needAuth: true, data })
  },
}
