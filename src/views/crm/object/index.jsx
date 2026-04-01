import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Object from '@/views/crm/object/ui/Object'
import { objectApi } from '@/shared/api/object/object-api'

export default async function ObjectPage() {
  const queryClient = new QueryClient()

  const INITIAL_FILTERS = {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  }

  await queryClient.prefetchQuery({
    queryKey: ['objects', INITIAL_FILTERS],
    queryFn: () => objectApi.getObjectList(INITIAL_FILTERS),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Object />
    </HydrationBoundary>
  )
}
