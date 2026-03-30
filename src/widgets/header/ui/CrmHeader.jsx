'use client'
import { useLogout } from '@/features/auth/api/use-logout'
import HeaderContainer from '@/widgets/header/ui/HeaderContainer'
import AvatarButton from '@/widgets/header/ui/AvatarButton'
import { useUser } from '@/features/users/api/use-user'
import { useRouter } from 'next/navigation'
import { SelectActiveCompany } from '@/widgets/header/ui/SelectActiveCompany'
import { Flex, Text } from '@chakra-ui/react'
import { ThemeToggle } from '@/widgets/header/ui/ThemeToggle'

export const CrmHeader = () => {
  const { user, isLoading } = useUser()
  const { mutate: logout, isPending } = useLogout()
  const router = useRouter()

  return (
    <HeaderContainer>
      <Flex align="center" gap={5}>
        {!isLoading ? (
          <SelectActiveCompany
            activeCompany={user?.companies ? user?.activeCompanyId : null}
            companies={user?.companies ? user?.companies : []}
          />
        ) : (
          <Text color="fg.muted" fontSize="sm">
            Загрузка...
          </Text>
        )}

        <AvatarButton
          name={user?.name ?? ''}
          surname={user?.surname ?? ''}
          email={user?.email ?? ''}
          onLogout={() => logout()}
          isLoading={isLoading || isPending || !user}
          onProfileClick={() => router.push('/profile')}
          onCompaniesClick={() => router.push('/company')}
        />
        {/* <ThemeToggle /> */}
      </Flex>
    </HeaderContainer>
  )
}
