import { securityWorkdaysApi } from '@/shared/api/securityWorkdays/securityWorkdays-api'
import { useQuery } from '@tanstack/react-query'

export const useGetOneSecurityWorkday = (id, options = {}) => {
  const query = useQuery({
    queryKey: ['oneSecurityWorkdayInfo', id],
    queryFn: () => securityWorkdaysApi.getOneSecurityWorkday(id),
    ...options,
    staleTime: options.staleTime ?? 0, // не даём переопределить
    enabled: (options.enabled !== undefined ? options.enabled : true) && !!id,
  })

  return {
    ...query,
    oneSecurityWorkdayInfo: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
