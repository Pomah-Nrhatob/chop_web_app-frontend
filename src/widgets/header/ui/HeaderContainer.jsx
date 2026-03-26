import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function HeaderContainer({ children }) {
  return (
    <Flex
      as="header"
      px={10}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.200"
      justify="space-between"
      alignItems="center"
    >
      <Text fontWeight="bold">
        <Link href="/">CHOP CRM</Link>
      </Text>
      {children}
    </Flex>
  )
}
