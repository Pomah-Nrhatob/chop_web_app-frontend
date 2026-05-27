import { objectWorkdaysApi } from '@/shared/api/objectWorkdays/objectWorkdays-api'
import { useQuery } from '@tanstack/react-query'

export const useCalendarOneDay = (queryParams) => {
  const query = useQuery({
    queryKey: ['calendar-oneDay', queryParams],
    queryFn: () => objectWorkdaysApi.getOneDayAllObjectWorkdaysWithPagination(queryParams),
    staleTime: 5 * 60 * 1000,
  })

  return {
    ...query,
    oneDayWorkdays: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
