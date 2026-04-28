import { objectWorkdaysApi } from '@/shared/api/objectWorkdays/objectWorkdays-api'
import { useQuery } from '@tanstack/react-query'

export const useCalendarAllObjects = (queryParams) => {
  const query = useQuery({
    queryKey: ['calendar-allObjects', queryParams],
    queryFn: () => objectWorkdaysApi.getAllObjectWorkdaysWithPagination(queryParams),
    staleTime: 5 * 60 * 1000,
  })

  return {
    ...query,
    allObjectsWorkdays: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
