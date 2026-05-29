'use client'
import { Flex, Button, Text, Box } from '@chakra-ui/react'
import { useLogout } from '@/features/auth/api/use-logout'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation' // ✅ usePathname!
import Link from 'next/link'
import { useChangeActiveCompany, useUser } from '@/features/users/api/use-user'
import { CiLogin } from 'react-icons/ci'
import { FaBusinessTime } from 'react-icons/fa'
import HeaderContainer from '@/widgets/header/ui/HeaderContainer'
import AvatarButton from '@/widgets/header/ui/AvatarButton'
import { SelectActiveCompany } from '@/widgets/header/ui/SelectActiveCompany'

export const Header = () => {
  const { user, isLoading } = useUser()
  const { mutate: logout, isPending } = useLogout()
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname() // ✅ Текущий путь

  if (status === 'loading') return <Text>Загрузка...</Text>

  // ✅ Проверяем путь
  const isBcPage = pathname.includes('/bc')
  const showCrmButton = session && !isBcPage

  return (
    <HeaderContainer>
      <Flex align="center" gap={4}>
        {session ? (
          <Box display="flex" alignItems="center" gap="5">
            {/* ✅ Показываем кнопку только НЕ на /bc страницах */}
            {showCrmButton && (
              <Button variant="ghost" rounded="md">
                <Link href="/bc">
                  <Flex align="center" gap={2}>
                    <FaBusinessTime color="gray" />
                    <Text>Crm система</Text>
                  </Flex>
                </Link>
              </Button>
            )}

            {!isLoading ? (
              !showCrmButton && (
                <Box>
                  <SelectActiveCompany
                    activeCompany={user?.companies ? user?.activeCompanyId : null}
                    companies={user?.companies ? user?.companies : []}
                  />
                </Box>
              )
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
      </Flex>
    </HeaderContainer>
  )
}
