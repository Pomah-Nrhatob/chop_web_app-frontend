import { apiClient } from '@/shared/api/api'

const cleanQuery = (query) => {
  return Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== '' && v !== undefined))
}

export const reportGeneratorApi = {
  getReportObject: async (query, objectId) => {
    return apiClient.get(`/report/object/${objectId}`, {
      needAuth: true,
      query: cleanQuery(query),
      options: {
        responseType: 'blob',
      },
    })
  },

  getReportSecurity: async (query, securityId) => {
    return apiClient.get(`/report/security/${securityId}`, {
      needAuth: true,
      query: cleanQuery(query),
      options: {
        responseType: 'blob',
      },
    })
  },
}
