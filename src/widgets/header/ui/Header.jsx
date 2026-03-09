'use client'
import { Flex, Button, Text } from '@chakra-ui/react'
import { useUserStore } from '@/entities/user/model/store'
import { useLogout } from '@/features/auth/api/use-logout'

export const Header = () => {
  const { user } = useUserStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <Flex as="header" p={4} borderBottom="1px solid" borderColor="gray.200" justify="space-between">
      <Text fontWeight="bold">CHOP CRM</Text>

      <Flex align="center" gap={4}>
        {user && <Text fontSize="sm">{user.email}</Text>}
        <Button variant="outline" colorPalette="red" loading={isPending} onClick={() => logout()}>
          Выйти
        </Button>
      </Flex>
    </Flex>
  )
}
