'use client'
import { Flex, Button, Text, Box } from '@chakra-ui/react'
import { useUserStore } from '@/entities/user/model/store'
import { useLogout } from '@/features/auth/api/use-logout'
import Link from 'next/link'

export const CrmHeader = () => {
  const { user } = useUserStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <Flex as="header" p={4} borderBottom="1px solid" borderColor="gray.200" justify="space-between">
      <Text fontWeight="bold">
        <Link href="/">CHOP CRM</Link>
        <Link href="/">Crm header</Link>
      </Text>

      <Flex align="center" gap={4}>
        {user && <Text fontSize="sm">{user.email}</Text>}
        <Box display="flex" alignItems="center" gap="5">
          <Text>
            <Link href="/bc">Дашборд</Link>
          </Text>
          <Button variant="outline" colorPalette="red" loading={isPending} onClick={() => logout()}>
            Выйти
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}
