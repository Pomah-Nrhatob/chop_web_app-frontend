import { apiClient } from '@/shared/api/api'

export const scheduleApi = {
  createschedule: async (data) => {
    return apiClient.post('/schedule', { needAuth: true, data })
  },
}
