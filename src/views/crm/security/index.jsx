import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Security from '@/views/crm/security/ui/Security'
import { securityApi } from '@/shared/api/security/security-api'

export default async function SecurityPage() {
  const queryClient = new QueryClient()

  const INITIAL_FILTERS = {
    search: '',
    hasLicense: '',
    maxShiftSalary: '',
    statusId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  }

  await queryClient.prefetchQuery({
    queryKey: ['securities', INITIAL_FILTERS],
    queryFn: () => securityApi.getSecurityList(INITIAL_FILTERS),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Security />
    </HydrationBoundary>
  )
}
