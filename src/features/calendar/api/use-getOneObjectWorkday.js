import { objectWorkdaysApi } from '@/shared/api/objectWorkdays/objectWorkdays-api'
import { useQuery } from '@tanstack/react-query'

export const useGetOneObjectWorkday = (id, options = {}) => {
  const query = useQuery({
    queryKey: ['oneObjectWorkdayInfo', id],
    queryFn: () => objectWorkdaysApi.getOneObjectWorkday(id),
    staleTime: 0,
    ...options,
    enabled: (options.enabled !== undefined ? options.enabled : true) && !!id,
  })

  return {
    ...query,
    oneObjectWorkdayInfo: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
