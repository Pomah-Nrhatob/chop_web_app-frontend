'use client'
import { Flex, Button, Text, Box } from '@chakra-ui/react'
import { useLogout } from '@/features/auth/api/use-logout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useChangeActiveCompany, useUser } from '@/features/users/api/use-user'
import { CiLogin } from 'react-icons/ci'
import { FaBusinessTime } from 'react-icons/fa'
import HeaderContainer from '@/widgets/header/ui/HeaderContainer'
import AvatarButton from '@/widgets/header/ui/AvatarButton'
import { SelectActiveCompany } from '@/widgets/header/ui/SelectActiveCompany'
import { toaster } from '@/providers/chakraProvider/toaster'
import { ThemeToggle } from '@/widgets/header/ui/ThemeToggle'

export const Header = () => {
  const { user, isLoading } = useUser()
  const { mutate: logout, isPending } = useLogout()
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <Text>Загрузка...</Text>

  return (
    <HeaderContainer>
      <Flex align="center" gap={4}>
        {session ? (
          <Box display="flex" alignItems="center" gap="5">
            <Button variant="ghost" rounded="md">
              <Link href="/bc">
                <Flex align="center" gap={2}>
                  <FaBusinessTime color="gray" />
                  <Text>Crm система</Text>
                </Flex>
              </Link>
            </Button>

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
          </Box>
        ) : (
          <Button colorPalette="teal" variant="solid" onClick={() => router.push('login')}>
            Войти <CiLogin />
          </Button>
        )}
        <ThemeToggle />
      </Flex>
    </HeaderContainer>
  )
}
