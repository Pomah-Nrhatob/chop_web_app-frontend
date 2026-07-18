import { useUser } from '@/features/users/api/use-user'

export const useActiveCompanyId = () => {
  const { user } = useUser()

  return user?.activeCompanyId
}
