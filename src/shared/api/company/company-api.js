import { apiClient } from '@/shared/api/api'

export const companyApi = {
  getAllCompany: async () => apiClient.get('/company', { needAuth: true }),
  getActiveCompany: async () => apiClient.get('/company/getActiveCompany', { needAuth: true }),
  createCompany: async (data) => apiClient.post('/company', { data, needAuth: true }),
  updateCompany: async (data) => apiClient.put('/company', { data, needAuth: true }),
  deleteCompany: async (companyId) => apiClient.delete(`/company/${companyId}`, { needAuth: true }),
  getAllUserByCompany: async () => apiClient.get('/company/user-company', { needAuth: true }),
  addUserCompany: async (data) => apiClient.post('/company/user-company', { data, needAuth: true }),
  updateUserCompany: async (data) =>
    apiClient.put('/company/user-company', { data, needAuth: true }),
  deleteUserCompany: async (userId) =>
    apiClient.delete(`/company/user-company/${userId}`, { needAuth: true }),
}
